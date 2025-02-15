import { 
  registerAppointments,
  allAppointments,
  userAppointments,
  userUpdateAppointments,
  removeAppointments
} from "../controllers/appointmentsController.js";

import { authenticateAndVerify } from "../middleware/authToken.js";

const appointmentsRoutes = async (fastify, options) => {
  fastify.get('/', { preHandler: authenticateAndVerify}, allAppointments)

  fastify.post('/', { preHandler: authenticateAndVerify}, registerAppointments );

  fastify.get('/:id', { preHandler: authenticateAndVerify}, userAppointments);
  
  fastify.put('/:id', { preHandler: authenticateAndVerify}, userUpdateAppointments);

  fastify.delete('/:id', { preHandler: authenticateAndVerify}, removeAppointments);
};

export default appointmentsRoutes;
