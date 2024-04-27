"use client";
import { Comment, CommentVote, Post } from "@prisma/client";
import Link from "next/link";
import { ShowAvatar } from "../shared/show-avatar";
import { useSession } from "next-auth/react";
import PostVoteClient from "@/components/post/vote/post-vote-client";
import { formatTimeToNow } from "@/lib/utils";

type _Post = Post & { community: { name: string; image: string | null } };

interface Props {
  userName: string;
  comments:
    | (Comment & {
        post: _Post;
        votes: CommentVote[];
      })[]
    | null;
}

const UserCommentFeed: React.FC<Props> = ({ comments, userName }) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-1 flex-col divide-y">
      {comments &&
        comments.map((comment) => {
          const countVote = comment.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0); //count the vote of comment

          const currentVote = comment.votes.find((vote) => {
            return vote.userId === session?.user.id;
          }); // check if current user vote this comment

          return (
            <Link
              href={`/c/${comment.post.community.name}/post/${comment.postId}`}
              className="flex flex-col gap-3 rounded-md border p-1 py-3 text-sm hover:bg-foreground/10"
              key={comment.postId}
            >
              <div className="flex items-center gap-2">
                <ShowAvatar
                  className="size-6"
                  data={{
                    name: comment.post.community.name,
                    image: comment.post.community.image,
                  }}
                />
                <p className="font-medium">r/{comment.post.community.name}</p>
                <span>•</span>
                <p className="font-semibold">{comment.post.title}</p>
              </div>
              <div className="space-y-3">
                <p className="space-x-2">
                  <b>{userName}</b>
                  <span className="text-xs text-muted-foreground">
                    {comment.replyToId ? "replied" : "commented"}
                    {formatTimeToNow(new Date(comment.createdAt))}
                  </span>
                </p>
                <p>{`"${comment.content}"`}</p>
              </div>
              <div className="w-fit">
                <PostVoteClient
                  postId={comment.postId}
                  initialVote={currentVote?.type}
                  initialVoteCount={countVote}
                />
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default UserCommentFeed;
