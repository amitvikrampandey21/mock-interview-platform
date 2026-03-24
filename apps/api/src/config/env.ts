import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/ai-mock-interview"),
  JWT_SECRET: z.string().default("replace-me")
});

export const env = envSchema.parse(process.env);
