import express from "express";
import "dotenv/config";

import recordsRouter from "./routers/recordsRouter";
import authRouter from "./routers/authRouter";
import { errorHandler } from "./middlewares/errorHandler";

const baseUrl = "/api/v1";

const app = express();
app.use(express.json());

// TODO improve health check
app.get(`${baseUrl}/health`, (_, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use(`${baseUrl}/records`, recordsRouter);
app.use(`${baseUrl}/auth`, authRouter);

app.use(errorHandler);

export default app;
