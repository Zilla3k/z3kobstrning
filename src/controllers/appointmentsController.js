import {
  createAppointments,
  getAllAppointments,
  getUserAppointments,
  putUserAppointments,
  deleteAppointments,
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
  let isClient;
  const user = await findUserById(id);
  if(!user){
    return res.status(404).send({message: 'User not found!'});
  }
  if(user[0].role !== 'client'){
    isClient = false
    return await getUserAppointments(id, isClient)
  }
  isClient = true
  const result = await getUserAppointments(id, isClient)

  res.status(200).send(result);
}

export const userUpdateAppointments = async (req, res) => {
  const { id } = req.params;
  const { client_id, barber_id, service_id, update_time, date_time } = req.body;
  let isClient;

  const user = await findUserById(id);
  if (!user) {
    return res.status(404).send({ message: 'User not found!' });
  };

  if(user[0].role !== 'client'){
    isClient = false
    await putUserAppointments(id, isClient, { client_id, service_id, update_time ,date_time });
    res.status(200).send({ message: 'User appointments updated successfully' });
  }
  isClient = true
  const result = await putUserAppointments(id, isClient, { barber_id, service_id, update_time, date_time })

  console.log(result)

  res.status(200).send({ message: 'User appointments updated successfully' });
}

export const removeAppointments = async (req, res) =>{
  const { id } = req.params;
  const { date_time } = req.body;
  let isClient;

  const user = await findUserById(id);
  if (!user) {
    return res.status(404).send({ message: 'User not found!' });
  };

  if(user[0].role !== 'client'){
    isClient = false
    await deleteAppointments(id, isClient, { date_time });
    res.status(200).send({message: 'Appointments delete successfully!'})
  }
  isClient = true
  await deleteAppointments(id, isClient, { date_time });

  res.status(200).send({message: 'Appointments delete successfully!'})
}