import { 
  registerAppointments,
  allAppointments,
  userAppointments,
  barberAppointments,
  userUpdateAppointments,
  barberUpdateAppointments,
  removeAppointments
} from "../controllers/appointmentsController.js";

const appointmentsRoutes = async (fastify, options) => {
  fastify.get('/allAppointments', allAppointments)

  fastify.post('/registerAppointments', registerAppointments );

  fastify.get('/user/:id', userAppointments);

  fastify.put('/userUpdate/:id', userUpdateAppointments);
  
  fastify.get('/barber/:id', barberAppointments);

  fastify.put('/barberUpdate/:id', barberUpdateAppointments);

  fastify.delete('/deleteAppointments/:id', removeAppointments);
};

export default appointmentsRoutes;
