import Fastify from 'fastify';

import userRoutes from './routes/userRoutes.js';
import barbershopRoutes from './routes/barbershopRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';

const mapDatabaseError = (err) => {
  if (err?.code === 'ER_DUP_ENTRY') {
    return { statusCode: 409, message: 'Resource already exists!' };
  }

  if (err?.code === 'ER_NO_REFERENCED_ROW_2' || err?.code === 'ER_ROW_IS_REFERENCED_2') {
    return { statusCode: 409, message: 'Related record is invalid!' };
  }

  return null;
};

export function buildApp(options = {}) {
  const app = Fastify({
    logger: options.logger ?? true,
  });

  app.setErrorHandler((err, request, reply) => {
    request.log.error(err);

    if (err.validation) {
      return reply.status(400).send({ message: 'Validation failed', details: err.validation });
    }

    const mapped = mapDatabaseError(err);
    if (mapped) {
      return reply.status(mapped.statusCode).send({ message: mapped.message });
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode >= 500 ? 'Internal server error' : (err.message || 'Request failed');

    return reply.status(statusCode).send({ message });
  });

  app.register(userRoutes, { prefix: '/api/users' });
  app.register(barbershopRoutes, { prefix: '/api/barbershops' });
  app.register(appointmentsRoutes, { prefix: '/api/appointments' });

  return app;
}
