import express from "express";
import cors from "cors";
import helmet from "helmet";

import apiRoutes from "./routes/index.js";

import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

import {
  apiRateLimiter,
} from "./middleware/rate-limit.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(helmet());

app.use(express.json());

app.use(
  "/api",
  apiRateLimiter,
  apiRoutes
);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;