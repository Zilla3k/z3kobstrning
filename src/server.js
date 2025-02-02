import fastify from "fastify";

const server = fastify({logger: true});

server.get('/', (req,res)=>{
  res.status(200).send({msg: "Hello World"});
})

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