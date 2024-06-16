"use client";
import { formatDate } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Community, UserRole } from "@prisma/client";
import UserMore from "./user-more";
import { twMerge } from "tailwind-merge";
import { Loader2, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
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
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props {
  id: string;
  name: string | null;
  followed: { community: Community }[];
  created: { name: string }[];
  postCount: number;
  commentCount: number;
  createdAt?: Date;
}

const UserCard = ({
  user,
  className,
  role,
  userId,
}: {
  user: Props;
  className?: string;
  role?: UserRole;
  userId?: string;
}) => {
  const [isLoading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (user.id === userId) {
        return toast({
          title: "Bruh! You cannot delete yourself",
          variant: "destructive",
        });
      }
      await axios.delete(`/api/user/${user.id}`);
      toast({
        title: "Deleted!",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <TooltipProvider>
        <Card className={twMerge(" h-fit border-none bg-muted/50", className)}>
          <CardHeader className="p-3">
            <CardTitle className="relative pr-6">
              {user?.name}
              {role && role === UserRole.ADMIN && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger className="absolute right-7 top-0 rounded-full bg-background p-1 hover:bg-foreground/20">
                      <Trash className="size-4 text-red-500" />
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background font-semibold shadow-md text-red-500">
                  Xoá người dùng
                  </TooltipContent>
                </Tooltip>
              )}
              <UserMore />
            </CardTitle>
            <div className="flex gap-2 pt-4">
              <div className="text-sm">
                <p className="font-medium">{user.postCount}</p>
                <span className="text-xs text-muted-foreground">
                Điểm bài viết
                </span>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">{user.commentCount}</p>
                <span className="text-xs text-muted-foreground">
                Điểm bình luận
                </span>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">
                  {formatDate(new Date().toISOString(), "PP")}
                </p>
                <span className="text-xs text-muted-foreground">Ngày tạo</span>
              </div>
            </div>
          </CardHeader>
          <Separator className="mb-1 mt-3 bg-foreground/50" />
          <CardContent className="space-y-6 p-3">
            <div>
              <h4 className="text-sm uppercase text-muted-foreground">
              Cộng đồng đang theo dõi
              </h4>
              <div className="max-h-72 overflow-auto">
                {user.followed.map((c) => (
                  <a
                    href={`/c/${c.community.name.toLowerCase()}`}
                    className="block rounded-sm p-2 hover:bg-foreground/20"
                    key={c.community.name}
                  >
                    {c.community.name}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase text-muted-foreground">
              Cộng đồng đã tạo
              </h4>
              <div className="max-h-72 overflow-auto">
                {user.created.map((c) => (
                  <a
                    href={`/c/${c.name.toLowerCase()}`}
                    className="block rounded-sm p-2 hover:bg-foreground/20"
                    key={c.name}
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắc xoá không?</AlertDialogTitle>
          <AlertDialogDescription>
          Hành động này sẽ bị xoá vĩnh viễn và không được khôi phục.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              disabled={isLoading}
              variant="destructive"
              className="!bg-destructive hover:!bg-destructive/70 !text-destructive-foreground"
              onClick={() => handleDelete()}
            >
              {isLoading && <Loader2 className="mr-2 size-5 animate-spin" />}
              Xoá
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserCard;
