import jwt from 'jsonwebtoken';
import { repositories } from '../services/repositories.js';
import { isPrivilegedRole } from '../constants/roles.js';

const canAccessUser = (requestUser, targetUserId) => {
  if (!requestUser) {
    return false;
  }

  if (isPrivilegedRole(requestUser.role)) {
    return true;
  }

  return Number(requestUser.sub) === Number(targetUserId);
};

export const allUsers = async (request, reply) => {
  const users = await repositories.users.getAllUsers();
  return reply.status(200).send(users);
};

export const loginUser = async (request, reply) => {
  const { email, password } = request.body ?? {};

  if (!email || !password) {
    return reply.status(400).send({ message: 'Provide all mandatory data!' });
  }

  const user = await repositories.users.findUserByEmailForLogin(email);
  if (!user) {
    return reply.status(401).send({ message: 'Email or password incorrect!' });
  }

  const verifyPassword = await repositories.auth.comparePassword(password, user.password_hash);
  if (!verifyPassword) {
    return reply.status(401).send({ message: 'Email or password incorrect!' });
  }

  if (!user.is_active) {
    return reply.status(403).send({ message: 'Account not verified!' });
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      isActive: Boolean(user.is_active),
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  return reply.header('Authorization', `Bearer ${accessToken}`).status(200).send({
    message: 'Login successful!',
    accessToken,
  });
};

export const registerUser = async (request, reply) => {
  const { name, email, password } = request.body ?? {};

  if (!name || !email || !password) {
    return reply.status(400).send({ message: 'Provide all mandatory data!' });
  };

  const existingUser = await repositories.users.findUserByEmail(email);
  if (existingUser) {
    return reply.status(409).send({ message: 'User already exists!' });
  };

  const hashedPassword = await repositories.auth.hashPassword(password);

  await repositories.users.createUser({ name, email, password: hashedPassword });

  return reply.status(201).send({ message: 'User created successfully' });
};

export const getUserProfile = async (request, reply) => {
  const { id } = request.params;
  const user = await repositories.users.findUserById(id);

  if (!user) {
    return reply.status(404).send({ message: 'User not found!' });
  }

  if (!canAccessUser(request.user, id)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  return reply.status(200).send(user);
};

export const updateUserProfile = async (request, reply) => {
  const { id } = request.params;
  const { name, email } = request.body ?? {};

  const existingUser = await repositories.users.findUserById(id);
  if (!existingUser) {
    return reply.status(404).send({ message: 'User not found!' });
  }

  if (!canAccessUser(request.user, id)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  const result = await repositories.users.updateUser(id, { name, email });
  if (!result?.affectedRows) {
    return reply.status(400).send({ message: 'No changes applied' });
  };

  return reply.status(200).send({ message: 'User updated successfully' });
};

export const deleteUserProfile = async (request, reply) => {
  const { id } = request.params;
  const existingUser = await repositories.users.findUserById(id);
  if (!existingUser) {
    return reply.status(404).send({ message: 'User not found!' });
  }

  if (!canAccessUser(request.user, id)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  const result = await repositories.users.deleteUser(id);
  if (!result?.affectedRows) {
    return reply.status(404).send({ message: 'User not found!' });
  };

  return reply.status(200).send({ message: 'User deleted successfully!' });
};
