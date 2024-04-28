"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatTimeToNow } from "@/lib/utils";
import { NotificationProps } from "@/types/db";
import { UserRole } from "@prisma/client";
import axios from "axios";
import { Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) throw new Error("Error fetching");
  return data;
};

const UserNotifications = ({ role }: { role: UserRole }) => {
  const [isRead, setRead] = useState(true);
  const router = useRouter();

  const { data, mutate, isLoading } = useSWR<NotificationProps[]>(
    `/api/notification`,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    const findUnRead = data.filter((n) => n.status === false);

    if (findUnRead.length > 0) setRead(false);
  }, [data]);

  const handleRead = async (id?: string, url?: string) => {
    const payload = {
      id: id,
    };
    try {
      await axios.put("/api/notification/read", payload);

      mutate();
      setRead(true);
      if (url) startTransition(() => router.push(url));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative" size="icon" variant="outline">
          <Bell className="h-5 w-5" />
          {!isRead && (
            <span className="absolute -right-1 -top-1 size-3 animate-ping rounded-full border border-border bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        key={"user-notification"}
        align="end"
        className="w-screen sm:w-[400px]"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => handleRead()}>
              Mask as Read
            </Button>
            <Button
              disabled={isLoading}
              variant="outline"
              size="sm"
              onClick={() => {
                mutate();
              }}
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Refresh
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2 h-1" />
        <div className="flex max-h-[500px] flex-col gap-1 overflow-auto">
          {data && data.length === 0 && (
            <DropdownMenuItem>Nothing to show.</DropdownMenuItem>
          )}
          {data &&
            data.map((item) => {
              const sender = `u/${item.sender.username}`;
              let href = "",
                detail = "";

              switch (item.type) {
                case "COMMUNITY":
                  href = `/c/${item.communityName}`;
                  break;
                case "POST":
                  href = `/c/${item.communityName}/post/${item.post?.id}`;
                  detail = item.post?.title || "";
                  break;
                case "COMMENT":
                  href = `/c/${item.communityName}/post/${item.comment?.postId}#${item.comment?.id}`;
                  detail = item.comment?.content || "";
                  break;
                case "REQUEST": {
                  if (role === "ADMIN") href = "/admin/request";
                  else href = `c/${item.communityName}`;
                }
                default:
                  "";
              }

              return (
                <DropdownMenuItem asChild key={item.id}>
                  <a
                    className={cn(
                      "w-full cursor-pointer flex-col rounded-lg bg-background p-2 text-secondary-foreground shadow-md transition-colors hover:!bg-secondary-foreground/30 ",
                      { "bg-secondary/90": item.status === false },
                    )}
                    onClick={() => handleRead(item.id, href)}
                  >
                    <time className="w-full text-end text-xs text-muted-foreground">
                      {formatTimeToNow(new Date(item.createdAt))}
                    </time>
                    <p className="line-clamp-2 w-full space-x-1 truncate text-wrap">
                      <span className="font-medium">{sender}</span>
                      <span>{item.message}</span>
                      <span className="font-medium">
                        c/{item.communityName}
                      </span>
                    </p>
                    <p className="line-clamp-2 w-full truncate text-muted-foreground">
                      {item.type === "COMMENT" ? `"${detail}"` : detail}
                    </p>
                  </a>
                </DropdownMenuItem>
              );
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNotifications;
