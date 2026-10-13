import app from "./app.js";
import { PORT } from "./config/env.js";
import { startOverdueSweeper } from "./services/overdue.service.js";
import prisma from "./lib/prisma.js";

const server = app.listen(PORT, () => {
  console.log(`BookLoop API running on port ${PORT}`);
});

startOverdueSweeper();

const shutdown = () => {
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
