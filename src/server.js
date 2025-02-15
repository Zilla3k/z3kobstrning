import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { buildApp } from './app.js';

const app = buildApp();
const port = Number(process.env.PORT || 3000);

const start = async () => {
  try {
    await app.listen({ port });
    app.log.info(`Servidor rodando em http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  start();
}

export { app, start };
