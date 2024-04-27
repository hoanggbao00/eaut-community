import { z } from "zod";

export const CommunityValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Title must contain at least 3 character(s)" })
    .max(21)
    .regex(/^[a-zA-Z0-9_]+$/, {message: 'Title must not be contain specials characters'}),
  description: z.string(),
  cover: z.string().nullish(),
  image: z.string().nullish(),
  categoryId: z.string().min(3, { message: "You must choose a category" }),
  rules: z
    .array(
      z.object({
        title: z.string().min(2, {
          message: "Rule title must contain at least 2 character(s}",
        }),
        detail: z.string(),
      }),
    ).min(1),
});

export const CommunityFollowValidator = z.object({
  communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type FollowToCommunityPayload = z.infer<typeof CommunityFollowValidator>;
