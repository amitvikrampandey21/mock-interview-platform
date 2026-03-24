import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase } from "./db/connect.js";

async function start() {
  await connectToDatabase();

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

void start();
