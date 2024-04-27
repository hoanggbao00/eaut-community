"use client";

import { cn, formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";
import { CommentVote } from "@prisma/client";
import axios from "axios";
import { Loader2, MessageSquare, ShieldPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import CommentVotes from "./comment-votes";
import { ShowAvatar } from "../shared/show-avatar";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import TextareaAutoSize from "react-textarea-autosize";
import CommentMore from "./comment-more";
import EditComment from "./edit-comment";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ExtendedComment } from "@/types/db";
import { mutate } from "swr";

interface PostCommentProps {
  comment: ExtendedComment;
  votesCount: number;
  currentVote: CommentVote | undefined;
  postId: string;
  moderatorBadge: boolean;
  mutate: () => void;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesCount,
  currentVote,
  postId,
  moderatorBadge,
  mutate,
}) => {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>(
    `@${comment.author ? comment.author.username : "User has removed"} `,
  );
  const [isEdit, setEdit] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSendComment = async ({
    postId,
    content,
    replyToId,
  }: CommentRequest) => {
    if (content.trim() === `@${comment.author?.username}`) {
      return toast({
        title: "Please enter your reply content",
        variant: "warning",
      });
    }
    try {
      setLoading(true);
      const payload: CommentRequest = { postId, content, replyToId };

      const { data } = await axios.post(
        `/api/community/post/comment/`,
        payload,
      );
      if (data) {
        mutate();
      }
    } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsReplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Tooltip>
        <div className="relative flex w-full items-center">
          <CommentMore
            router={router}
            commentId={comment.id}
            session={session}
            commentAuthor={comment.authorId}
            setEdit={setEdit}
          />
          <ShowAvatar
            data={{
              name: comment.author ? comment.author.name : "Removed",
              image: comment.author ? comment.author.image : null,
            }}
            className="h-6 w-6"
          />
          <div className="ml-2 flex items-center gap-x-2">
            <a
              href={`/user/${comment.author?.username}`}
              className={cn(
                "text-sm font-medium text-foreground hover:underline",
                {
                  "text-sky-500": moderatorBadge,
                },
              )}
            >
              @{comment.author ? comment.author.username : "User removed"}
            </a>
            {moderatorBadge && (
              <>
                <TooltipTrigger>
                  <ShieldPlus className="text-sky-500" size="16" />
                </TooltipTrigger>
                <TooltipContent className="bg-background font-semibold text-sky-500 shadow-md">
                  Moderator Badge
                </TooltipContent>
              </>
            )}

            <span className="text-xs text-muted-foreground">
              {formatTimeToNow(new Date(comment.createdAt))}
            </span>
          </div>
        </div>
      </Tooltip>

      {isEdit ? (
        <EditComment
          commentId={comment.id}
          editContent={editContent}
          oldComment={comment.content}
          setEditContent={setEditContent}
          router={router}
          setEdit={setEdit}
        />
      ) : (
        <p className="text-sm">{comment.content}</p>
      )}

      <div className="flex items-center gap-2">
        <CommentVotes
          commentId={comment.id}
          votesCount={votesCount}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(!isReplying);
          }}
          variant="secondary"
          size="sm"
        >
          <MessageSquare className="mr-1.5 h-4 w-4" />
          Reply
        </Button>
      </div>

      {isReplying ? (
        <div className="w-full">
          <div className="mt-2">
            <TextareaAutoSize
              onFocus={(e) => {
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                );
              }}
              autoFocus
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // handle Ctrl+Enter
                if (!(e.key === "Enter" && (e.metaKey || e.ctrlKey))) return;

                handleSendComment({
                  postId,
                  content: input,
                  replyToId: comment.replyToId ?? comment.id,
                });
              }}
              placeholder="What are your thoughts?"
              className="min-h-0 w-full resize-none rounded-sm border p-2"
            />

            <div className="mt-2 flex justify-between">
              <p className="mt-2 hidden text-xs leading-[0.5rem] text-gray-500 sm:block">
                Press
                <kbd className="ml-1 rounded-md border bg-muted px-1 uppercase">
                  Ctrl
                </kbd>
                +
                <kbd className="mr-1 rounded-md border bg-muted px-1 uppercase">
                  Enter
                </kbd>
                to submit your comment.
              </p>
              <div>
                <Button
                  tabIndex={-1}
                  variant="ghost"
                  onClick={() => setIsReplying(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  onClick={() => {
                    if (!input) return;
                    handleSendComment({
                      postId,
                      content: input,
                      replyToId: comment.replyToId ?? comment.id, // default to top-level comment
                    });
                  }}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostComment;
