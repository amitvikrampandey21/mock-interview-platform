import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      role: "candidate";
    };

    req.user = {
      id: payload.sub,
      role: payload.role
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
