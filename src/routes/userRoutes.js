import {
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  allUsers
} from '../controllers/userController.js';

import {authenticateAndVerify, authorizeRoles} from '../middleware/authToken.js';
import { Roles } from '../constants/roles.js';
import { userCreateSchema, userLoginSchema, userUpdateSchema, userIdParamsSchema, okMessageSchema } from '../schemas/index.js';

const userRoutes = async (fastify, options) => {
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
  }, allUsers);
  
  fastify.post('/', { schema: userCreateSchema }, registerUser);

  fastify.post('/login', { schema: userLoginSchema }, loginUser);

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
  }, getUserProfile);

  fastify.put('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...userUpdateSchema,
      response: {
        200: okMessageSchema,
      },
    },
  }, updateUserProfile);

  fastify.delete('/:id', {
    preHandler: authenticateAndVerify,
    schema: {
      ...userIdParamsSchema,
      response: {
        200: okMessageSchema,
      },
    },
  }, deleteUserProfile);
};

export default userRoutes;
