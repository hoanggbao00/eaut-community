"use client";

import TextareaAutoSize from "react-textarea-autosize";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Label } from "@/components/ui/label";
import { CommentRequest } from "@/lib/validators/comment";
import { Loader2 } from "lucide-react";
import { Session, User } from "next-auth";
import { Button } from "@/components/ui/button";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
  user?: User;
  mutate: () => void;
}

const CreateComment: FC<CreateCommentProps> = ({
  postId,
  replyToId,
  user,
  mutate,
}) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleCtrlEnter = (e: any) => {
    if (!(e.key === "Enter" && (e.metaKey || e.ctrlKey))) return;
    handleComment();
  };

  const handleComment = async () => {
    if(!input) return;
    setLoading(true);
    try {
      const text = input.replace(/\r?\n/g, '<br />');
      console.log(text);
      const payload: CommentRequest = { postId, content: text, replyToId };

      const { data } = await axios.post(
        `/api/community/post/comment/`,
        payload,
      );
      if (data) {
        setInput("");
        mutate();
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
      <Label htmlFor="comment">Bình luận của bạn</Label>
      <div className="mt-2">
        <div className="relative">
          <div className="relative w-full">
            <TextareaAutoSize
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                user ? "Bạn nghĩ gì về chủ đề này?" : "Đăng nhập để tham gia thảo luận về chủ đề này"
              }
              className="w-full resize-none rounded-md border p-2"
              onKeyDown={handleCtrlEnter}
            />
            {isLoading && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            )}
          </div>

          <div className="flex items-center justify-end sm:justify-between">
            <p className="mt-2 hidden text-xs leading-[0.5rem] text-gray-500 sm:block">
              Nhấn
              <kbd className="ml-1 rounded-md border bg-muted px-1 uppercase">
                Ctrl
              </kbd>
              +
              <kbd className="mr-1 rounded-md border bg-muted px-1 uppercase">
                Enter
              </kbd>
              để gửi bình luận của bạn.
            </p>
            <Button onClick={handleComment} size="sm" disabled={!input}>
            Gửi
            </Button>
          </div>
          {!user && (
            <button
              onClick={() => router.push("/sign-in")}
              className="absolute inset-0 bottom-1 flex w-full items-center justify-center bg-black/10"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
