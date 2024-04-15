"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { FC, useRef } from "react";
import EditorOutput from "../editor/editor-output";
import PostVoteClient from "./vote/post-vote-client";
import { buttonVariants } from "../ui/button";
import { ShowAvatar } from "../show-avatar";
import { ExtendedPost } from "@/types/db";
import PostMore from "./post-more";
import { Session } from "next-auth";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  session: Session | null;
  post: ExtendedPost;
  voteCount: number;
  currentVote?: PartialVote;
  communityName: string;
  commentCount: number;
  showCommunityName?: boolean;
  isModerator?: boolean;
}

const Post: FC<PostProps> = ({
  session,
  post,
  voteCount: _voteCount,
  currentVote: _currentVote,
  communityName,
  commentCount,
  showCommunityName,
  isModerator,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  const author = post.author
    ? post.author
    : { username: "User removed", image: "" };

  const isPermission =
    session?.user.id === post.authorId ||
    isModerator === true ||
    session?.user.role === "ADMIN";

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex flex-col justify-between px-6 py-4">
        {/* post metadata */}
        <div className="relative mt-1 flex max-h-40 items-center text-xs text-gray-500">
          {isPermission && (
            <PostMore
              permission={isPermission}
              communityName={communityName}
              session={session}
              postId={post.id}
            />
          )}
          {showCommunityName ? (
            <>
              <ShowAvatar
                data={{ image: post.community.image, name: communityName }}
                className="mr-2 h-7 w-7"
              />
              <div>
                <div className="flex items-center gap-2">
                  <a
                    className="text-sm text-zinc-900 underline underline-offset-2"
                    href={`/c/${communityName.toLowerCase()}`}
                  >
                    c/{communityName}
                  </a>
                </div>
                <div>
                  <span>Posted by </span>
                  <Link
                    className="cursor-pointer text-foreground hover:underline"
                    href={`/user/${author.username}`}
                  >
                    {author.username}
                  </Link>
                  <span className="px-1">
                    • {formatTimeToNow(new Date(post.createdAt))}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <ShowAvatar
                data={{ image: author.image, name: communityName }}
                className="mr-2 h-7 w-7"
              />
              <span>Posted by </span>
              <Link
                className="ml-1 cursor-pointer text-foreground hover:underline"
                href={`/user/${author.username}`}
              >
                {author.username}
              </Link>
              <span className="px-1">
                • {formatTimeToNow(new Date(post.createdAt))}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <a href={`/c/${communityName.toLowerCase()}/post/${post.id}`}>
          <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
            {post.title}
          </h1>

          {/* content */}
          <div
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </a>
      </div>
      {/* post vote */}
      <div className="z-20 flex gap-2 bg-gray-50 px-4 py-4 text-sm sm:px-6">
        <PostVoteClient
          postId={post.id}
          initialVoteCount={_voteCount}
          initialVote={_currentVote?.type}
        />
        <Link
          href={`/c/${communityName}/post/${post.id}`}
          className={buttonVariants({
            variant: "secondary",
            className:
              "flex w-fit items-center gap-2 !rounded-full hover:text-sky-500",
          })}
        >
          <MessageSquare className="h-4 w-4" /> {commentCount} comments
        </Link>
      </div>
    </div>
  );
};
export default Post;
