import type { Request, Response } from "express";
import { z } from "zod";
import { createAuthToken, decodeAuthToken } from "../services/authService.js";
import { createUser, findUserByEmail, findUserById } from "../services/userStore.js";

const authSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.literal("candidate")
});

export async function register(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }

  const existing = await findUserByEmail(parsed.data.email);

  if (existing) {
    const token = createAuthToken(existing);
    return res.json({ user: existing, token });
  }

  const user = await createUser(parsed.data);

  const token = createAuthToken(user);

  return res.status(201).json({ user, token });
}

export async function getCurrentSession(req: Request, res: Response) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = decodeAuthToken(token);
    const user = await findUserById(payload.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user, token });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
