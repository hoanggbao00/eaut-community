import {
  Comment,
  CommentVote,
  Community,
  Entity,
  Post,
  PostVote,
  User,
} from "@prisma/client";

export type ExtendedPost = Post & {
  community: Community;
  votes: PostVote[];
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
  follow: { communityId: string; createdDate: Date }[];
  communityModerator: { communityId: string }[];
  _count: {
    post: number;
    comment: number;
  };
};

export interface NotificationProps {
  id: string;
  type: Entity;
  message: string;
  senderId: string;
  notifierId: string;
  entityId: string;
  communityName?: string;
  createdAt: Date;
  status: boolean;
  sender: { name: string; username: string };
  post?: {
    id: string;
    title: string;
  };
  comment?: {
    id: string;
    postId: string;
    content: string;
  };
}

export type ExtendedComment = Comment & {
  author: User & {
    createdCommunity?: {
      name: string;
    }[];
    communityModerator?: {
      community: {
        name: string;
      };
    }[];
  };
  votes: CommentVote[];
  replies: ExtendedComment[];
};
