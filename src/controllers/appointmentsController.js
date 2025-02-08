import {
  createAppointments,
  getAllAppointments,
  getBarberAppointments,
  getUserAppointments,
  putBarberAppointments,
  putUserAppointments,
  deleteAppointments,
  findAppointmentsByDate
} from '../repositories/appointmentsRepository.js'

import {
  findUserById
} from '../repositories/userRepository.js'

export const allAppointments = async (req,res) => {
  const appointments = await getAllAppointments()
  res.status(200).send(appointments)
}

export const registerAppointments = async (req, res) => {
  const { client_id, barber_id, service_id, date_time, status, created_by} = req.body;

  await createAppointments(client_id, barber_id, service_id, date_time, status, created_by);

  res.status(201).send({message: "Scheduled confirmed!"})
}

export const userAppointments = async (req, res) => {
  const { id } = req.params;
  const user = await getUserAppointments(id)
  res.status(200).send(user)
}

export const barberAppointments = async (req, res) => {
  const { id } = req.params;
  const barber = await getBarberAppointments(id)
  res.status(200).send(barber)
}

export const userUpdateAppointments = async (req, res) => {
  const { id } = req.params;
  const { barber_id, service_id, update_time, date_time } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };
  
  await putUserAppointments(id, { barber_id, service_id, update_time ,date_time });
  
  res.status(200).send({ message: 'User appointments updated successfully' });
}

export const barberUpdateAppointments = async (req, res) => {
  const { id } = req.params;
  const { client_id, service_id, update_time, date_time } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };
  
  await putBarberAppointments(id, { client_id, service_id, update_time ,date_time });
  
  res.status(200).send({ message: 'Barber appointments updated successfully' });
}

export const removeAppointments = async (req, res) =>{
  const { id } = req.params;
  const { date_time } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };

  const dateFound = await findAppointmentsByDate(date_time)
  if(!dateFound){
    return res.status(404).send({message: 'Appointments not found!'})
  }

  await deleteAppointments(id, { date_time });

  res.status(200).send({message: 'Appointments delete successfully!'})
}