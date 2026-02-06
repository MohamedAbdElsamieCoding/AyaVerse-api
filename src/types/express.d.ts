import { User } from "../generated/prisma/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "USER" | "ADMIN";
      };
    }
  }
}

export {};
