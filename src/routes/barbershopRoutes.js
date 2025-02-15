import {
  allBarbershop,
  registerBarbershop,
  getBarbershopProfile,
  updateBarbershopProfile,
  deleteBarbershopProfile
} from '../controllers/barbershopController.js'

import { authenticateAndVerify } from '../middleware/authToken.js';

const barbershopRoutes = async (fastify, options)=>{
  fastify.get('/', { preHandler: authenticateAndVerify}, allBarbershop);

  fastify.post('/', { preHandler: authenticateAndVerify}, registerBarbershop);

  fastify.get('/:id', { preHandler: authenticateAndVerify}, getBarbershopProfile);

  fastify.put('/:id', { preHandler: authenticateAndVerify}, updateBarbershopProfile);

  fastify.delete('/:id', { preHandler: authenticateAndVerify}, deleteBarbershopProfile);
} 

export default barbershopRoutes;