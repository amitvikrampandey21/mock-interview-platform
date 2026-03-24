import type { User } from "@aimih/types";
import mongoose from "mongoose";
import { users } from "../data/mockDb.js";
import { serializeUser } from "../lib/serializers.js";
import { UserModel } from "../models/userModel.js";

export async function findUserByEmail(email: string): Promise<User | null> {
  if (mongoose.connection.readyState === 1) {
    const user = await UserModel.findOne({ email });
    return user ? serializeUser(user) : null;
  }

  return users.find((user) => user.email === email) ?? null;
}

export async function createUser(input: Omit<User, "id">): Promise<User> {
  if (mongoose.connection.readyState === 1) {
    const user = await UserModel.create(input);
    return serializeUser(user);
  }

  const user = {
    id: `u${users.length + 1}`,
    ...input
  };

  users.push(user);
  return user;
}

export async function findUserById(id: string): Promise<User | null> {
  if (mongoose.connection.readyState === 1) {
    const user = await UserModel.findById(id);
    return user ? serializeUser(user) : null;
  }

  return users.find((user) => user.id === id) ?? null;
}
