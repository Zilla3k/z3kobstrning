import { 
  registerAppointments,
  allAppointments,
  userAppointments,
  userUpdateAppointments,
  removeAppointments
} from "../controllers/appointmentsController.js";

const appointmentsRoutes = async (fastify, options) => {
  fastify.get('/', allAppointments)

  fastify.post('/', registerAppointments );

  fastify.get('/:id', userAppointments);
  
  fastify.put('/:id', userUpdateAppointments);

  fastify.delete('/:id', removeAppointments);
};

export default appointmentsRoutes;
