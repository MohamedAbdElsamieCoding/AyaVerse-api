import app from "./app.js";
import dotenv from "dotenv";
import { logger } from "./config/logger.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
