// server/utils/auth.ts
import { H3Event } from "h3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function verifyAuth(event: H3Event) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const authHeader = getHeader(event, "authorization");

  if (!JWT_SECRET) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server misconfiguration: JWT_SECRET is missing",
    });
  }

  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  const token = authHeader.split(" ")[1]; // Assuming Bearer token format

  if (!token) {
    throw new Error("Token is missing");
  }

  try {
    // Replace with your token verification logic
    const user = await verifyToken(token, JWT_SECRET); // Use a library like jsonwebtoken
    event.context.user = user; // Attach user info to the context for later use
    return {
      user,
      token,
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify a password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT
export function generateToken(
  payload: object,
  secret: string,
  expiresIn: string = "1h"
): string {
  return jwt.sign(payload, secret, { expiresIn });
}

// Verify JWT
export async function verifyToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
