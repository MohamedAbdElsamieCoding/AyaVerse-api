import type { Request, Response, NextFunction } from "express";
import express from "express";

import helmet from "helmet";
import cors from "cors";

import { globalErrorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use(helmet());
app.use(cors());

app.use(globalErrorHandler);
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "AyaVerse is Cooking" });
});

export default app;
