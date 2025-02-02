import {
  registerUser, 
  // loginUser, // Pending task: login user
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  allUsers
} from '../controllers/userController.js';

const userRoutes = async (fastify, options) => {
  // Busca todos os usuarios `/api/users/allUsers`
  fastify.get('/allUsers', allUsers);
  
  // Registrar usuário `/api/users/register`
  fastify.post('/createUser', registerUser);

  // Login do usuário `/api/users/login`
  // fastify.post('/login', loginUser); // Pending task: login user

  // Obter perfil do usuário `/api/users/:id`
  fastify.get('/:id', getUserProfile);

  // Atualizar perfil do usuário `/api/users/:id`
  fastify.put('/:id', updateUserProfile);

  // Deletar usuário `/api/users/:id`
  fastify.delete('/:id', deleteUserProfile);
};

export default userRoutes;