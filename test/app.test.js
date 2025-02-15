import assert from 'node:assert/strict';
import { beforeEach, afterEach, test } from 'node:test';
import jwt from 'jsonwebtoken';

import { buildApp } from '../src/app.js';
import { Roles } from '../src/constants/roles.js';
import { repositories } from '../src/services/repositories.js';

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

let app;

const setDefaults = () => {
  Object.assign(repositories.auth, {
    hashPassword: async () => 'hashed-password',
    comparePassword: async () => true,
  });

  Object.assign(repositories.users, {
    createUser: async () => ({ affectedRows: 1 }),
    findUserByEmailForLogin: async () => null,
    findUserByEmail: async () => null,
    findUserById: async () => null,
    findAuthUserById: async () => ({ id: 1, role: Roles.CLIENT, is_active: 1 }),
    updateUser: async () => ({ affectedRows: 1 }),
    deleteUser: async () => ({ affectedRows: 1 }),
    getAllUsers: async () => [],
  });

  Object.assign(repositories.barbershops, {
    getAllBarbershop: async () => [],
    createBarbershop: async () => ({ affectedRows: 1 }),
    findBarbershopByName: async () => null,
    findBarbershopById: async () => null,
    updateBarbershop: async () => ({ affectedRows: 1 }),
    deleteBarbershop: async () => ({ affectedRows: 1 }),
  });

  Object.assign(repositories.appointments, {
    createAppointments: async () => ({ affectedRows: 1 }),
    getAllAppointments: async () => [],
    findAppointmentById: async () => null,
    updateAppointment: async () => ({ affectedRows: 1 }),
    deleteAppointment: async () => ({ affectedRows: 1 }),
  });
};

const createApp = async () => {
  app = buildApp({ logger: false });
  await app.ready();
  return app;
};

const makeToken = (payload = {}) => jwt.sign({
  sub: 1,
  role: Roles.CLIENT,
  isActive: true,
  ...payload,
}, JWT_SECRET, { expiresIn: '1h' });

beforeEach(() => {
  setDefaults();
});

afterEach(async () => {
  if (app) {
    await app.close();
    app = undefined;
  }
});

test('login without credentials returns 400', async () => {
  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'POST',
    url: '/api/users/login',
    payload: {},
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().message, 'Validation failed');
});

test('login with unknown user returns 401', async () => {
  repositories.users.findUserByEmailForLogin = async () => null;
  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'POST',
    url: '/api/users/login',
    payload: { email: 'missing@example.com', password: 'secret123' },
  });

  assert.equal(response.statusCode, 401);
});

test('login with wrong password returns 401', async () => {
  repositories.users.findUserByEmailForLogin = async () => ({
    id: 7,
    email: 'user@example.com',
    password_hash: 'hashed',
    role: Roles.CLIENT,
    is_active: 1,
  });
  repositories.auth.comparePassword = async () => false;

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'POST',
    url: '/api/users/login',
    payload: { email: 'user@example.com', password: 'wrong' },
  });

  assert.equal(response.statusCode, 401);
});

test('protected route without token returns 401', async () => {
  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'GET',
    url: '/api/users/1',
  });

  assert.equal(response.statusCode, 401);
});

test('invalid token returns 401', async () => {
  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'GET',
    url: '/api/users/1',
    headers: {
      authorization: 'Bearer invalid-token',
    },
  });

  assert.equal(response.statusCode, 401);
});

test('inactive user returns 403', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 1, role: Roles.CLIENT, is_active: 0 });
  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'GET',
    url: '/api/users/1',
    headers: {
      authorization: `Bearer ${makeToken()}`,
    },
  });

  assert.equal(response.statusCode, 403);
});

test('user cannot update another user', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 2, role: Roles.CLIENT, is_active: 1 });
  repositories.users.findUserById = async () => ({
    id: 1,
    name: 'Other User',
    email: 'other@example.com',
    role: Roles.CLIENT,
    is_active: 1,
  });

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'PUT',
    url: '/api/users/1',
    headers: {
      authorization: `Bearer ${makeToken({ sub: 2 })}`,
    },
    payload: { name: 'Blocked' },
  });

  assert.equal(response.statusCode, 403);
});

test('user cannot delete another user', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 2, role: Roles.CLIENT, is_active: 1 });
  repositories.users.findUserById = async () => ({
    id: 1,
    name: 'Other User',
    email: 'other@example.com',
    role: Roles.CLIENT,
    is_active: 1,
  });

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'DELETE',
    url: '/api/users/1',
    headers: {
      authorization: `Bearer ${makeToken({ sub: 2 })}`,
    },
  });

  assert.equal(response.statusCode, 403);
});

test('nonexistent user returns 404', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 9, role: Roles.CLIENT, is_active: 1 });
  repositories.users.findUserById = async () => null;

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'GET',
    url: '/api/users/9',
    headers: {
      authorization: `Bearer ${makeToken({ sub: 9 })}`,
    },
  });

  assert.equal(response.statusCode, 404);
});

test('barbershop not found returns 404', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 1, role: Roles.CLIENT, is_active: 1 });
  repositories.barbershops.findBarbershopById = async () => null;

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'GET',
    url: '/api/barbershops/10',
    headers: {
      authorization: `Bearer ${makeToken()}`,
    },
  });

  assert.equal(response.statusCode, 404);
});

test('non-owner cannot update barbershop', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 2, role: Roles.CLIENT, is_active: 1 });
  repositories.barbershops.findBarbershopById = async () => ({
    id: 1,
    name: 'Central',
    address: 'Street 1',
    phone: '1111',
    owner_id: 1,
  });

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'PUT',
    url: '/api/barbershops/1',
    headers: {
      authorization: `Bearer ${makeToken({ sub: 2 })}`,
    },
    payload: { name: 'Blocked Shop' },
  });

  assert.equal(response.statusCode, 403);
});

test('invalid appointment creation returns 400', async () => {
  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'POST',
    url: '/api/appointments',
    headers: {
      authorization: `Bearer ${makeToken()}`,
    },
    payload: { barber_id: 1 },
  });

  assert.equal(response.statusCode, 400);
});

test('user cannot view third-party appointment', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 2, role: Roles.CLIENT, is_active: 1 });
  repositories.appointments.findAppointmentById = async () => ({
    id: 1,
    client_id: 1,
    barber_id: 3,
    service_id: 4,
    date_time: '2026-07-31T10:00:00Z',
    status: 'scheduled',
  });

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'GET',
    url: '/api/appointments/1',
    headers: {
      authorization: `Bearer ${makeToken({ sub: 2 })}`,
    },
  });

  assert.equal(response.statusCode, 403);
});

test('update appointment without fields returns 400', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 1, role: Roles.CLIENT, is_active: 1 });
  repositories.appointments.findAppointmentById = async () => ({
    id: 1,
    client_id: 1,
    barber_id: 3,
    service_id: 4,
    date_time: '2026-07-31T10:00:00Z',
    status: 'scheduled',
  });

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'PUT',
    url: '/api/appointments/1',
    headers: {
      authorization: `Bearer ${makeToken()}`,
    },
    payload: {},
  });

  assert.equal(response.statusCode, 400);
});

test('unauthorized user cannot update appointment', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 2, role: Roles.CLIENT, is_active: 1 });
  repositories.appointments.findAppointmentById = async () => ({
    id: 1,
    client_id: 1,
    barber_id: 3,
    service_id: 4,
    date_time: '2026-07-31T10:00:00Z',
    status: 'scheduled',
  });

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'PUT',
    url: '/api/appointments/1',
    headers: {
      authorization: `Bearer ${makeToken({ sub: 2 })}`,
    },
    payload: { status: 'confirmed' },
  });

  assert.equal(response.statusCode, 403);
});

test('unauthorized user cannot delete appointment', async () => {
  repositories.users.findAuthUserById = async () => ({ id: 2, role: Roles.CLIENT, is_active: 1 });
  repositories.appointments.findAppointmentById = async () => ({
    id: 1,
    client_id: 1,
    barber_id: 3,
    service_id: 4,
    date_time: '2026-07-31T10:00:00Z',
    status: 'scheduled',
  });

  const currentApp = await createApp();
  const response = await currentApp.inject({
    method: 'DELETE',
    url: '/api/appointments/1',
    headers: {
      authorization: `Bearer ${makeToken({ sub: 2 })}`,
    },
  });

  assert.equal(response.statusCode, 403);
});
