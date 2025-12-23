import "dotenv/config";
import { Redis } from "ioredis";
import { logger } from "./logger.js";

// Initialize the client
export const redis = new Redis(
  process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  }
);

// Add connection listeners
redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (err) => {
  logger.error("Redis connection error", err);
});
