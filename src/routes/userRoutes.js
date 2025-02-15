import {
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  allUsers
} from '../controllers/userController.js';

import {authenticateAndVerify, authorizeRoles} from '../middleware/authToken.js';

const userRoutes = async (fastify, options) => {
  fastify.get('/', { preHandler: [authenticateAndVerify, authorizeRoles(['develp'])]}, allUsers);
  
  fastify.post('/', registerUser);

  fastify.post('/login', loginUser);

  fastify.get('/:id', { preHandler: authenticateAndVerify}, getUserProfile);

  fastify.put('/:id', { preHandler: authenticateAndVerify}, updateUserProfile);

  fastify.delete('/:id', { preHandler: authenticateAndVerify}, deleteUserProfile);
};

export default userRoutes;