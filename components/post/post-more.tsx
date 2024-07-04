"use client";
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
import { buttonVariants } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PostMore = ({
  session,
  permission,
  postId,
  communityName,
}: {
  session: Session | null;
  postId: string;
  communityName: string;
  permission?: boolean;
}) => {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/community/post/${postId}`);
      toast({
        title: "Deleted!",
        description: "Your post has been deleted.",
      });
      startTransition(() => {
        router.push(`/c/${communityName}`);
        router.refresh();
      });
    } catch (error) {
      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
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
            {permission && (
              <>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem key="delete-action">
                    Xóa
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <DropdownMenuItem asChild>
                  <Link href={`/c/${communityName}/post/${postId}?edit=true`}>
                    Chỉnh sửa
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn 
              <span className="font-semibold text-red-500">Xóa</span> bài viết này không? Hành động này sẽ không được khôi phục.
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

export default PostMore;
