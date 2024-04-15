"use client";

import TextareaAutoSize from "react-textarea-autosize";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Label } from "@/components/ui/label";
import { CommentRequest } from "@/lib/validators/comment";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
  session: Session | null;
}

const CreateComment: FC<CreateCommentProps> = ({
  postId,
  replyToId,
  session,
}) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleCtrlEnter = (e: any) => {
    if (!(e.key === "Enter" && (e.metaKey || e.ctrlKey))) return;
    handleComment();
  };

  const handleComment = async () => {
    setLoading(true);
    try {
      const payload: CommentRequest = { postId, text: input, replyToId };

      const { data } = await axios.put(`/api/community/post/comment/`, payload);
      if (data) {
        setInput("");
        router.refresh();
      }
    } catch (error) {
      console.log(error);

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
    <div className="w-full">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <div className="relative w-full">
          <TextareaAutoSize
            id="comment"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              session ? "What are your thoughts?" : "Sign in to comment"
            }
            className="w-full resize-none rounded-md border p-2"
            onKeyDown={handleCtrlEnter}
          />
          {!session && (
            <button
              onClick={() => router.push("/sign-in")}
              className="absolute inset-0 bottom-1 flex w-full items-center justify-center bg-black/10"
            />
          )}
          {isLoading && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
          )}
        </div>
        <p className="mt-2 text-xs leading-[0.5rem] text-gray-500">
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
      </div>
    </div>
  );
};

export default CreateComment;
