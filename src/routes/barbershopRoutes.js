import {
  allBarbershop,
  registerBarbershop,
  getBarbershopProfile,
  updateBarbershopProfile,
  deleteBarbershopProfile
} from '../controllers/barbershopController.js'

import { authenticateAndVerify } from '../middleware/authToken.js';
import { barbershopCreateSchema, barbershopUpdateSchema, userIdParamsSchema, okMessageSchema } from '../schemas/index.js';

const barbershopRoutes = async (fastify, options)=>{
  fastify.get('/', { preHandler: authenticateAndVerify }, allBarbershop);

  fastify.post('/', { preHandler: authenticateAndVerify, schema: barbershopCreateSchema }, registerBarbershop);

  fastify.get('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...userIdParamsSchema,
      response: {
        200: {
          type: 'object',
          additionalProperties: true,
        },
      },
    },
  }, getBarbershopProfile);

  fastify.put('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...barbershopUpdateSchema,
      response: {
        200: okMessageSchema,
      },
    },
  }, updateBarbershopProfile);

  fastify.delete('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...userIdParamsSchema,
      response: {
        200: okMessageSchema,
      },
    },
  }, deleteBarbershopProfile);
} 

export default barbershopRoutes;
