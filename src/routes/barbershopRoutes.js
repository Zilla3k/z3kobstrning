import {
  allBarbershop,
  registerBarbershop,
  getBarbershopProfile,
  updateBarbershopProfile,
  deleteBarbershopProfile
} from '../controllers/barbershopController.js'

const barbershopRoutes = async (fastify, options)=>{
  fastify.get('/allBarbershops', allBarbershop);

  fastify.post('/createBarbershop', registerBarbershop);

  fastify.get('/:owner_id', getBarbershopProfile);

  fastify.put('/:owner_id', updateBarbershopProfile);

  fastify.delete('/:owner_id', deleteBarbershopProfile);
} 

export default barbershopRoutes;