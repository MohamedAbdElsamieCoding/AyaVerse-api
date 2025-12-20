import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "./appError.js";
import { httpStatusText } from "./httpStatusText.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

/**
 *
 * @param password
 * @returns
 */
export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 *
 * @param password
 * @param hashedPassword
 * @returns
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 *
 * @param userId
 * @returns
 */

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "30d" });
};

/**
 *
 * @param token
 * @returns
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (err) {
    return null;
  }
};
