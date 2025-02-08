import fastify from "fastify";

// Routes
import userRoutes from "./routes/userRoutes.js";
import barbershopRoutes from "./routes/barbershopRoutes.js";
import schedulingRoutes from "./routes/schedulingRoutes.js";


const server = fastify({logger: true});

// https://localhost:3000 -> `/api/users`
server.register(userRoutes, { prefix: '/api/users' }); // Route to users
server.register(barbershopRoutes, { prefix: '/api/barbershop' }); // Route to barbershop
server.register(schedulingRoutes, { prefix: '/api/scheduling' }); // Route to scheduling

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