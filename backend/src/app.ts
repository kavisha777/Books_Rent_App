import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(helmet());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BookLoop API is running"
  });
});

export default app;