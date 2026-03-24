import jwt from "jsonwebtoken";
import type { Role, User } from "@aimih/types";
import { env } from "../config/env.js";

export function createAuthToken(user: User) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function decodeAuthToken(token: string): { sub: string; role: Role } {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string; role: Role };
}
