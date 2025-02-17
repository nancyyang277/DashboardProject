import Server from './server.js';
import { initDB } from './sqlite.js';

(async () => {
  await initDB();
  const server = new Server();
  await server.init();

  try {
    await server.listen();
    console.log("Server started successfully");
  } catch (error) {
    console.error("Error starting server:", error);
    await server.close();
  }
})();