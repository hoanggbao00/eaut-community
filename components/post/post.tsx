"use client";

import { checkYoutubeUrl, formatTimeToNow } from "@/lib/utils";
import { PostVote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { FC, useRef } from "react";
import EditorOutput from "../editor/editor-output";
import PostVoteClient from "./vote/post-vote-client";
import { buttonVariants } from "../ui/button";
import { ShowAvatar } from "../shared/show-avatar";
import { ExtendedPost } from "@/types/db";
import PostMore from "./post-more";
import { Session } from "next-auth";
import Image from "next/image";
import YoutubeEmbed from "../youtube-embed";

type PartialVote = Pick<PostVote, "type">;

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
    <div className="overflow-hidden rounded-md border border-muted bg-background text-foreground">
      <div className="flex flex-col justify-between px-3 py-2">
        {/* post metadata */}
        <div className="relative flex max-h-20 items-center overflow-hidden text-xs text-gray-500">
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
                    className="text-sm text-foreground underline underline-offset-2"
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
        <article id={post.id}>
          <a href={`/c/${communityName.toLowerCase()}/post/${post.id}`}>
            <h1 className="py-2 text-2xl font-semibold leading-6 text-primary">
              {post.title}
            </h1>
          </a>

          {/* content */}
          {post.content && (
            <div
              className="relative max-h-40 w-full overflow-clip pb-2 text-sm"
              ref={pRef}
            >
              <EditorOutput content={post.content} />
              {pRef.current?.clientHeight === 160 ? (
                // blur bottom if content is too long
                <a href={`/c/${communityName.toLowerCase()}/post/${post.id}`} className="absolute bottom-0 left-0 grid h-24 w-full place-items-end bg-gradient-to-t from-background to-transparent">
                  <span className="display-block mx-auto font-light text-muted-foreground">
                    Read more
                  </span>
                </a>
              ) : null}
            </div>
          )}
          {post.attachment &&
            (checkYoutubeUrl(post.attachment) ? (
              <YoutubeEmbed src={post.attachment} />
            ) : (
              <div className="relative h-[300px] w-full">
                <Image
                  src={post.attachment}
                  alt="post attachment"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            ))}
        </article>
      </div>
      {/* post vote */}
      <div className="flex gap-2 bg-muted py-1 text-sm sm:px-6">
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
              "flex w-fit items-center gap-2 !rounded-full hover:text-sky-500 dark:border dark:border-muted-foreground",
          })}
        >
          <MessageSquare className="h-4 w-4" /> {commentCount} comments
        </Link>
      </div>
    </div>
  );
};
export default Post;
