"use client";

import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";
import { Comment, CommentVote, User } from "@prisma/client";
import axios from "axios";
import { Loader2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import CommentVotes from "./comment-votes";
import { ShowAvatar } from "../show-avatar";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import TextareaAutoSize from "react-textarea-autosize";
import CommentMore from "./comment-more";
import EditComment from "./edit-comment";

type ExtendedComment = Comment & {
  votes: CommentVote[] | null;
  author: User | null;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesCount: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesCount,
  currentVote,
  postId,
}) => {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>(
    `@${comment.author ? comment.author.username : "User has removed"} `,
  );
  const [isEdit, setEdit] = useState(false);
  const [editContent, setEditContent] = useState(comment.text);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSendComment = async ({
    postId,
    text,
    replyToId,
  }: CommentRequest) => {
    try {
      setLoading(true);
      const payload: CommentRequest = { postId, text, replyToId };

      const { data } = await axios.put(`/api/community/post/comment/`, payload);
      if (data) {
        router.refresh();
        setIsReplying(false);
      }
    } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
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
          <p className="text-sm font-medium text-gray-900">
            @{comment.author ? comment.author.username : "User removed"}
          </p>

          <span className="text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </span>
        </div>
      </div>

      {isEdit ? (
        <EditComment
          commentId={comment.id}
          editContent={editContent}
          oldComment={comment.text}
          setEditContent={setEditContent}
          router={router}
          setEdit={setEdit}
        />
      ) : (
        <p className="text-sm text-zinc-900">{comment.text}</p>
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
              placeholder="What are your thoughts?"
              className="min-h-0 w-full resize-none rounded-sm border p-2"
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                tabIndex={-1}
                variant="ghost"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                onClick={() => {
                  if (!input) return;
                  handleSendComment({
                    postId,
                    text: input,
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
      ) : null}
    </div>
  );
};

export default PostComment;
