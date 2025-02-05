import jwt from '@fastify/jwt';

export default async function (fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET, // Carregar o segredo da variável de ambiente
  });
  // Middleware de verificação do token
  fastify.decorate('authenticate', async (request) => {
    try {
      await request.jwtVerify(); // Verifica o token JWT enviado
    } catch (err) {
      throw new fastify.httpErrors.unauthorized('Token inválido');
    }
  });
}