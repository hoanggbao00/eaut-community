import { z } from "zod";

export const CommunityValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Title must contain at least 3 character(s)" })
    .max(21)
    .regex(/^[a-zA-Z0-9_]+$/),
  description: z.string().nullable(),
  cover: z.string().nullable(),
  image: z.string().nullable(),
  categoryId: z.string().min(3, { message: "You must choose a category" }),
  rules: z.array(
    z
      .object({
        title: z.string().min(3, {
          message: "Rule title must contain at least 3 character(s}",
        }),
        detail: z.string().nullable(),
      })
      .optional(),
  ),
});

export const CommunityFollowValidator = z.object({
  communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type FollowToCommunityPayload = z.infer<typeof CommunityFollowValidator>;
