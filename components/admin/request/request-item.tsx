"use client";
import { ShowAvatar } from "@/components/shared/show-avatar";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn, formatTimeToNow } from "@/lib/utils";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ActionType,
  Community,
  Request,
  RequestStatus,
  User,
} from "@prisma/client";
interface RequestItemProps {
  request: Request;
  user: Pick<User, "name" | "username" | "image">;
  community: Pick<Community, "name" | "id"> | null;
}

type HistoryContent = {
  description?: string;
  categoryId?: string;
  categoryName?: string;
  rules: {
    title: string;
    detail?: string;
  }[];
};

const RequestItem: React.FC<RequestItemProps> = ({
  request,
  user,
  community,
}) => {
  const [isLoading, setLoading] = useState({ approve: false, reject: false });
  const router = useRouter();

  const newContent = request.newContent as HistoryContent;

  const handleAction = async (type: RequestStatus) => {
    if (type === "ACCEPTED") setLoading({ approve: true, reject: false });
    else setLoading({ approve: false, reject: true });

    const payload = {
      requestId: request.id,
      requestStatus: type,
    };

    try {
      if (type === RequestStatus.ACCEPTED)
        await axios.put("/api/request/approve", payload);
      else await axios.put("/api/request/reject", payload);

      toast({
        title: `Yêu cầu ${type === RequestStatus.ACCEPTED ? "Chấp thuận!" : "Từ chối!"}`,
      });
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      toast({
        title: "There was a problem.",
        description: "There was an error updating your request.",
        variant: "destructive",
      });
    } finally {
      setLoading({ approve: false, reject: false });
    }
  };

  return (
    <Tooltip>
      <Card>
        <CardHeader className="p-3 pb-0">
          <CardTitle className="flex items-center justify-between">
            <p>
              <span
                className={cn(badgeVariants(), "mr-2", {
                  "bg-green-300 text-green-900 hover:bg-green-300/70":
                    request.status === RequestStatus.ACCEPTED,
                  "bg-yellow-300 text-yellow-900 hover:bg-yellow-300/70":
                    request.status === RequestStatus.PENDING,
                  "bg-red-300 text-red-900 hover:bg-red-300/70":
                    request.status === RequestStatus.REJECTED,
                })}
              >
                {request.status}
              </span>
              <span
                className={cn(badgeVariants(), "mr-2", {
                  "bg-green-300 text-green-900 hover:bg-green-300/70":
                    request.requestType === ActionType.CREATE,
                  "bg-yellow-300 text-yellow-900 hover:bg-yellow-300/70":
                    request.requestType === ActionType.UPDATE,
                })}
              >
                {request.requestType}
              </span>
              c/{request.communityName}
            </p>
            {request.updateBy && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Last update: {formatTimeToNow(new Date(request.updateAt))} by{" "}
                <b>{request.updateBy}</b>
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Gửi bởi 
            <TooltipTrigger asChild>
              <a
                className="ml-1 font-medium text-foreground underline"
                href={`/user/${user.username}`}
              >
                u/{user.username}
              </a>
            </TooltipTrigger>
            <time className="ml-2 text-xs font-normal text-muted-foreground">
              {formatTimeToNow(new Date(request.createdAt))}
            </time>
            <TooltipContent asChild>
              <div className="flex items-center gap-2 !bg-background shadow-lg">
                <ShowAvatar
                  className="size-6"
                  data={{ name: user.name, image: user.image }}
                />
                <span className="text-lg font-medium text-foreground">
                  {user.name}
                </span>
              </div>
            </TooltipContent>
          </CardDescription>
        </CardHeader>
        <Link
          href={
            community ? `/c/${community.name?.toLowerCase()}?tab=about` : "#"
          }
        >
          <CardContent className="p-3">
            <p>
              <b>u/{user.username}</b> gửi yêu cầu {" "}
              {request.requestType.toUpperCase()} cộng đồng.
            </p>
            <p>{!request.updateBy && " Let's review it"}</p>
            {newContent && request.requestType === "UPDATE" && (
              <div className="divide-y-2 border-t-2 text-sm text-yellow-800">
                {newContent.categoryName && (
                  <p>Thay đổi danh mục: {newContent.categoryName}</p>
                )}
                {newContent.description && (
                  <p>Thay đổi giới thiệu: {newContent.description}</p>
                )}
                {newContent.rules && (
                  <div>
                    <p>Thay đổi điều luật: </p>
                    {newContent.rules.map((rule, index) => (
                      <div key={`${request.id}-rule${index}`}>
                        <p>
                          {index + 1}: {rule.title}
                        </p>
                        {rule.detail && <p>Chi tiết: {rule.detail}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Link>
        {!request.updateBy && (
          <CardFooter className="flex items-center justify-end gap-2 pb-3">
            <Button
              disabled={isLoading.approve}
              onClick={() => handleAction(RequestStatus.ACCEPTED)}
            >
              {isLoading.approve && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Chấp thuận
            </Button>
            <Button
              disabled={isLoading.reject}
              onClick={() => handleAction(RequestStatus.REJECTED)}
              variant="destructive"
            >
              {isLoading.reject && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Từ chối
            </Button>
          </CardFooter>
        )}
      </Card>
    </Tooltip>
  );
};

const capitalizeString = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default RequestItem;
