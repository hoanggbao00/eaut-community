import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Session } from "next-auth";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import React from "react";
import { buttonVariants } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CommentMoreProps {
  setEdit: (value: boolean) => void;
  session: Session | null;
  commentAuthor: string | null;
  commentId: string;
  router: AppRouterInstance
  mutate: () => void;
}

const CommentMore: React.FC<CommentMoreProps> = ({
  setEdit,
  session,
  commentAuthor,
  commentId,
  router,
  mutate
}) => {
  const handleDelete = async () => {
    try {
      const deleted = await axios.delete(
        `/api/community/post/comment/${commentId}`,
      );
      mutate()
      router.refresh()
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
        description: "Comment wasn't deleted successfully. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    session && (
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute right-0 top-0">
            <Ellipsis className="h-5 w-6 text-gray-500 hover:text-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" align="end">
            {session.user.id === commentAuthor && (
              <>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem key="delete-action">
                    Xóa
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <DropdownMenuItem onClick={() => setEdit(true)}>
                  Chỉnh sửa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bình luận</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này không? Hành động này sẽ không được khôi phục sau này!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({
                variant: "destructive",
                className: "!bg-destructive hover:!bg-destructive/90",
              })}
              onClick={handleDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};

export default CommentMore;
