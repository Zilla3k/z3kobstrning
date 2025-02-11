import {
  allBarbershop,
  registerBarbershop,
  getBarbershopProfile,
  updateBarbershopProfile,
  deleteBarbershopProfile
} from '../controllers/barbershopController.js'

const barbershopRoutes = async (fastify, options)=>{
  fastify.get('/', allBarbershop);

  fastify.post('/', registerBarbershop);

  fastify.get('/:id', getBarbershopProfile);

  fastify.put('/:id', updateBarbershopProfile);

  fastify.delete('/:id', deleteBarbershopProfile);
} 

export default barbershopRoutes;