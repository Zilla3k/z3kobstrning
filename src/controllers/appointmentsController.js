import { repositories } from '../services/repositories.js';
import { isPrivilegedRole } from '../constants/roles.js';

const canManageAppointment = (requestUser, appointment) => {
  if (!requestUser || !appointment) {
    return false;
  }

  if (isPrivilegedRole(requestUser.role)) {
    return true;
  }

  return Number(appointment.client_id) === Number(requestUser.sub) || Number(appointment.barber_id) === Number(requestUser.sub);
};

export const allAppointments = async (request, reply) => {
  const result = await repositories.appointments.getAllAppointments();
  return reply.status(200).send(result);
};

export const registerAppointments = async (request, reply) => {
  const { barber_id, service_id, date_time, status } = request.body ?? {};

  if (!barber_id || !service_id || !date_time || !status) {
    return reply.status(400).send({ message: 'Provide all mandatory data!' });
  }

  const client_id = request.user.sub;
  const created_by = request.user.sub;

  await repositories.appointments.createAppointments(client_id, barber_id, service_id, date_time, status, created_by);
  return reply.status(201).send({ message: 'Scheduled confirmed!' });
};

export const userAppointments = async (request, reply) => {
  const { id } = request.params;
  const appointment = await repositories.appointments.findAppointmentById(id);

  if (!appointment) {
    return reply.status(404).send({ message: 'Appointment not found!' });
  }

  if (!canManageAppointment(request.user, appointment)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  return reply.status(200).send(appointment);
};

export const userUpdateAppointments = async (request, reply) => {
  const { id } = request.params;
  const appointment = await repositories.appointments.findAppointmentById(id);

  if (!appointment) {
    return reply.status(404).send({ message: 'Appointment not found!' });
  }

  if (!canManageAppointment(request.user, appointment)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  const { barber_id, service_id, date_time, status } = request.body ?? {};
  const updateData = {};

  if (barber_id !== undefined) {
    updateData.barber_id = barber_id;
  }

  if (service_id !== undefined) {
    updateData.service_id = service_id;
  }

  if (date_time !== undefined) {
    updateData.date_time = date_time;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  if (Object.keys(updateData).length === 0) {
    return reply.status(400).send({ message: 'No fields provided for update' });
  }

  const result = await repositories.appointments.updateAppointment(id, updateData);
  if (!result?.affectedRows) {
    return reply.status(400).send({ message: 'No changes applied' });
  }

  return reply.status(200).send({ message: 'User appointments updated successfully' });
};

export const removeAppointments = async (request, reply) => {
  const { id } = request.params;
  const appointment = await repositories.appointments.findAppointmentById(id);

  if (!appointment) {
    return reply.status(404).send({ message: 'Appointment not found!' });
  }

  if (!canManageAppointment(request.user, appointment)) {
    return reply.status(403).send({ message: 'Operation forbidden!' });
  }

  const result = await repositories.appointments.deleteAppointment(id);
  if (!result?.affectedRows) {
    return reply.status(404).send({ message: 'Appointment not found!' });
  }

  return reply.status(200).send({ message: 'Appointments delete successfully!' });
}; 
