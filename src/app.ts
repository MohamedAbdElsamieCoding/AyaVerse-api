import express from "express";
import helmet from "helmet";
import cors from "cors";

import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";

import userRouter from "./routes/user.route.js";
import surahRouter from "./routes/surah.route.js";
import bookmarkRouter from "./routes/bookmark.route.js";

const app = express();
app.use(express.json());

// NPM Modules
app.use(helmet());
app.use(cors());

// Global Logger
app.use(requestLogger);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/surahs", surahRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);

// Error handler middleware
app.use(globalErrorHandler);

export default app;
