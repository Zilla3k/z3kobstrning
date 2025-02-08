import {
  createScheduling,
  getAllScheduling,
  getBarberScheduling,
  getUserScheduling,
  putBarberScheduling,
  putUserScheduling,
  deleteScheduling,
  findSchedulingByDate
} from '../repositories/schedulingRepository.js'

import {
  findUserById
} from '../repositories/userRepository.js'

export const allScheduling = async (req,res) => {
  const schedulings = await getAllScheduling()
  res.status(200).send(schedulings)
}

export const registerScheduling = async (req, res) => {
  const { client_id, barber_id, service_id, date_time, status, created_by} = req.body;

  await createScheduling(client_id, barber_id, service_id, date_time, status, created_by);

  res.status(201).send({message: "Scheduled confirmed!"})
}

export const userScheduling = async (req, res) => {
  const { id } = req.params;
  const user = await getUserScheduling(id)
  res.status(200).send(user)
}

export const barberScheduling = async (req, res) => {
  const { id } = req.params;
  const barber = await getBarberScheduling(id)
  res.status(200).send(barber)
}

export const userUpdateScheduling = async (req, res) => {
  const { id } = req.params;
  const { barber_id, service_id, update_time, date_time } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };
  
  await putUserScheduling(id, { barber_id, service_id, update_time ,date_time });
  
  res.status(200).send({ message: 'User scheduling updated successfully' });
}

export const barberUpdateScheduling = async (req, res) => {
  const { id } = req.params;
  const { client_id, service_id, update_time, date_time } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };
  
  await putBarberScheduling(id, { client_id, service_id, update_time ,date_time });
  
  res.status(200).send({ message: 'Barber scheduling updated successfully' });
}

export const removeScheduling = async (req, res) =>{
  const { id } = req.params;
  const { date_time } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };

  const dateFound = await findSchedulingByDate(date_time)
  if(!dateFound){
    return res.status(404).send({message: 'Scheduling not found!'})
  }

  await deleteScheduling(id, { date_time });

  res.status(200).send({message: 'Scheduling delete successfully!'})
}