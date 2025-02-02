import fastify from "fastify";
import userRoutes from "./routes/userRoutes.js";

const server = fastify({logger: true});

// Define o prefixo na url de https://localhost:3000 -> `/api/users`
server.register(userRoutes, { prefix: '/api/users' }); // Rotas para os usuarios

const start = async () => {
  try {
    await server.listen({ port: 3000 })
    server.log.info(`Servidor rodando em http://localhost:3000`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start();