import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRoutes from "./routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(helmet());

app.use(express.json());

app.use("/api", apiRoutes);

export default app;