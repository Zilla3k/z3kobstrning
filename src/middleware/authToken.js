import jwt from "jsonwebtoken";
import { repositories } from '../services/repositories.js';

export const authenticateAndVerify = async (request, reply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ message: 'Access token is required!' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const authUser = await repositories.users.findAuthUserById(decoded.sub);
    if (!authUser) {
      return reply.status(401).send({ message: 'Invalid token!' });
    }

    if (!authUser.is_active || !decoded.isActive) {
      return reply.status(403).send({ message: 'User not verified!' });
    }

    request.user = {
      sub: authUser.id,
      role: authUser.role,
      isActive: Boolean(authUser.is_active),
    };
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return reply.status(401).send({ message: 'Token expired!' });
    }

    return reply.status(401).send({ message: 'Invalid token!' });
  }
};

export const authorizeRoles = (allowedRoles) => {
  return async (request, reply) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({ message: 'Access denied!' });
    }
  };
};
