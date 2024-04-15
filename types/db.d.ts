import { Comment, Community, Post, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  community: Community;
  votes: Vote[];
  author: User?;
  comments: Comment[];
};

type Rules = {
  title: string;
  detail?: string;
};

export type UserSearch = Pick<
  User,
  "id" | "image" | "username" | "isBanned" | "name"
> & {
  Follow: { communityId: string; createdDate: Date }[];
  communityModerator: { communityId: string }[];
  _count: {
    Post: number;
    Comment: number;
  };
};
