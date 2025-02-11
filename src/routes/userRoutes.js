import {
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  allUsers
} from '../controllers/userController.js';

const userRoutes = async (fastify, options) => {
  fastify.get('/', allUsers);
  
  fastify.post('/', registerUser);

  fastify.post('/login', loginUser);

  fastify.get('/:id', getUserProfile);

  fastify.put('/:id', updateUserProfile);

  fastify.delete('/:id', deleteUserProfile);
};

export default userRoutes;