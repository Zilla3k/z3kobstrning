import { 
  registerScheduling,
  allScheduling,
  userScheduling,
  barberScheduling,
  userUpdateScheduling,
  barberUpdateScheduling,
  removeScheduling
} from "../controllers/schedulingController.js";

const schedulingRoutes = async (fastify, options) => {
  fastify.get('/allScheduling', allScheduling)

  fastify.post('/registerScheduling', registerScheduling );

  fastify.get('/user/:id', userScheduling);

  fastify.put('/userUpdate/:id', userUpdateScheduling);
  
  fastify.get('/barber/:id', barberScheduling);

  fastify.put('/barberUpdate/:id', barberUpdateScheduling);

  fastify.delete('/deleteScheduling/:id', removeScheduling);
};

export default schedulingRoutes;
