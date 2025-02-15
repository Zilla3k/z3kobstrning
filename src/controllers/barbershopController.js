import { repositories } from '../services/repositories.js';
import { isPrivilegedRole } from '../constants/roles.js';

export const allBarbershop = async (request, reply) => {
  const barbershops = await repositories.barbershops.getAllBarbershop();
  return reply.status(200).send(barbershops);
};

export const registerBarbershop = async (request, reply) => {
  const { name, address, phone } = request.body ?? {};
  if (!name || !address || !phone) {
    return reply.status(400).send({ message: 'Provide all mandatory data!' });
  }

  const existingBarbershop = await repositories.barbershops.findBarbershopByName(name);
  if (existingBarbershop) {
    return reply.status(409).send({ message: 'Barbershop already exists!' });
  }

  const owner_id = request.user.sub;
  await repositories.barbershops.createBarbershop({ name, address, phone, owner_id });
  return reply.status(201).send({ message: 'Barbershop created successfully' });
};

const canManageBarbershop = (requestUser, barbershop) => {
  if (!requestUser || !barbershop) {
    return false;
  }

  if (isPrivilegedRole(requestUser.role)) {
    return true;
  }

  return Number(barbershop.owner_id) === Number(requestUser.sub);
};

export const getBarbershopProfile = async (request, reply) => {
  const { id } = request.params;
  const barbershop = await repositories.barbershops.findBarbershopById(id);
  if (!barbershop) {
    return reply.status(404).send({ message: 'Barbershop not found!' });
  }

  return reply.status(200).send(barbershop);
};

export const updateBarbershopProfile = async (request, reply) => {
  const { id } = request.params;
  const existingBarbershop = await repositories.barbershops.findBarbershopById(id);

  if (!existingBarbershop) {
    return reply.status(404).send({ message: 'Barbershop not found!' });
  }

  if (!canManageBarbershop(request.user, existingBarbershop)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  const updateData = {};
  const { name, address, phone } = request.body ?? {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (address !== undefined) {
    updateData.address = address;
  }

  if (phone !== undefined) {
    updateData.phone = phone;
  }

  if (Object.keys(updateData).length === 0) {
    return reply.status(400).send({ message: 'No fields provided for update' });
  }

  const result = await repositories.barbershops.updateBarbershop(id, updateData);
  if (!result?.affectedRows) {
    return reply.status(400).send({ message: 'No changes applied' });
  }

  return reply.status(200).send({ message: 'Barbershop updated successfully' });
};

export const deleteBarbershopProfile = async (request, reply) => {
  const { id } = request.params;
  const existingBarbershop = await repositories.barbershops.findBarbershopById(id);

  if (!existingBarbershop) {
    return reply.status(404).send({ message: 'Barbershop not found!' });
  }

  if (!canManageBarbershop(request.user, existingBarbershop)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  const result = await repositories.barbershops.deleteBarbershop(id);
  if (!result?.affectedRows) {
    return reply.status(404).send({ message: 'Barbershop not found!' });
  }

  return reply.status(200).send({ message: 'Barbershop deleted successfully' });
};
