"use client";

import { Edit, Megaphone, Send, Trash, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const AlertItem = ({
  text,
  index,
  handleEdit,
  isPermission,
  communityId,
}: {
  text: string;
  index: number;
  handleEdit: (index: number, text: string) => void;
  isPermission: boolean;
  communityId: string;
}) => {
  const [showMore, setShowMore] = useState(false);
  const [content, setContent] = useState(text);
  const [isEdit, setEdit] = useState(false);

  const handleEnter = (e: any) => {
    if (e.key !== "Enter") return;
    handleEdit(index, content);
    setEdit(false);
  };

  const handleDelete = async () => {
    const payload = {
      communityId: communityId,
      content: content,
    };
    try {
      const deleted = await axios.delete("/api/community/alert", {
        data: payload,
      });

      if (deleted) {
        toast({
          title: "Alert deleted!",
          variant: "success",
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <div className="flex items-center gap-2 rounded-md border border-destructive/50 p-2">
        {!isEdit ? (
          <h6 className="w-full text-wrap">
            <Megaphone
              size="16"
              strokeWidth="2.5"
              className="mr-1 inline-block"
            />
            {showMore ? content : `${content.substring(0, 180)}`}
            {text.length >= 180 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="ml-1 inline-block text-xs text-muted-foreground"
              >
                {showMore ? "Thu gọn" : "...Xem thêm"}
              </button>
            )}
          </h6>
        ) : (
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
          />
        )}
        {isEdit && (
          <button
            onClick={() => {
              setEdit(false);
              setContent(text);
            }}
            className="rounded-md border p-1 hover:bg-foreground/20"
          >
            <X size="16" />
          </button>
        )}
        {isPermission && (
          <>
            <AlertDialogTrigger asChild>
              <button className="rounded-md border p-1 outline-none hover:bg-foreground/20">
                <Trash size="16" color="#ff0000" />
              </button>
            </AlertDialogTrigger>
            <button
              onClick={() => {
                if (isEdit === false) return setEdit(true);
                else handleEdit(index, content);
                setEdit(false);
              }}
              className={cn(
                "rounded-md border p-1 outline-none hover:bg-foreground/20",
                {
                  "bg-primary text-primary-foreground hover:bg-primary/50":
                    isEdit,
                },
              )}
            >
              {!isEdit ? <Edit size="16" /> : <Send size="16" />}
            </button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành đồng này sẽ không được khôi phục. Hãy để ý!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </>
        )}
      </div>
    </AlertDialog>
  );
};

export default AlertItem;
