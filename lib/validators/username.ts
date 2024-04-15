import { z } from "zod";

export const ProfileValidator = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
  name: z.string().min(3).max(32),
  image: z.string().nullable()
});
