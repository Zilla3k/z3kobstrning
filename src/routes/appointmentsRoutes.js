import { 
  registerAppointments,
  allAppointments,
  userAppointments,
  userUpdateAppointments,
  removeAppointments
} from "../controllers/appointmentsController.js";

import { authenticateAndVerify } from "../middleware/authToken.js";
import { Roles } from '../constants/roles.js';
import { authorizeRoles } from '../middleware/authToken.js';
import { appointmentCreateSchema, appointmentUpdateSchema, appointmentIdParamsSchema, okMessageSchema } from '../schemas/index.js';

const appointmentsRoutes = async (fastify, options) => {
  fastify.get('/', {
    preHandler: [authenticateAndVerify, authorizeRoles([Roles.ADMIN, Roles.DEVELOPER])],
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    },
  }, allAppointments)

  fastify.post('/', {
    preHandler: authenticateAndVerify,
    schema: appointmentCreateSchema,
  }, registerAppointments );

  fastify.get('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...appointmentIdParamsSchema,
      response: {
        200: {
          type: 'object',
          additionalProperties: true,
        },
      },
    },
  }, userAppointments);
  
  fastify.put('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...appointmentUpdateSchema,
      response: {
        200: okMessageSchema,
      },
    },
  }, userUpdateAppointments);

  fastify.delete('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...appointmentIdParamsSchema,
      response: {
        200: okMessageSchema,
      },
    },
  }, removeAppointments);
};

export default appointmentsRoutes;
