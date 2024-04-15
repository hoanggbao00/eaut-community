"use client";
import { ShowAvatar } from "@/components/show-avatar";
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
import { RequestType, RequestStatus, RequestCommunity } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RequestItemProps {
  request: RequestCommunity & {
    community: { status: RequestStatus; name: string, id: string },
    updateBy: {name: string | null} | null;
  };
  user: { name: string | null; image: string | null; username: string | null };
}

const RequestItem: React.FC<RequestItemProps> = ({ request, user }) => {
  const router = useRouter();

  const handleAction = async (type: RequestStatus) => {
    const payload = {
      id: request.id,
      requestStatus: type,
      communityId: request.communityId,
    };

    try {
      await axios.put("/api/request", payload);

      toast({
        title: `Request ${type === RequestStatus.ACCEPTED ? "Approved!" : "Rejected!"}`,
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
                    request.community.status === RequestStatus.ACCEPTED,
                  "bg-yellow-300 text-yellow-900 hover:bg-yellow-300/70":
                    request.community.status === RequestStatus.PENDING,
                  "bg-red-300 text-red-900 hover:bg-red-300/70":
                    request.community.status === RequestStatus.REJECTED,
                })}
              >
                {request.community.status}
              </span>
              <span
                className={cn(badgeVariants(), "mr-2", {
                  "bg-green-300 text-green-900 hover:bg-green-300/70":
                    request.type === RequestType.CREATE,
                  "bg-yellow-300 text-yellow-900 hover:bg-yellow-300/70":
                    request.type === RequestType.UPDATE,
                })}
              >
                {request.type}
              </span>
              c/{request.community.name}
            </p>
            {request.updateBy && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Last update: {formatTimeToNow(new Date(request.updateAt))} by <b>{request.updateBy.name}</b>
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Requested by
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
        <Link href={`/c/${request.community.name.toLowerCase()}?tab=about`}>
          <CardContent className="p-3">
            <p>
              User <b>u/{user.username}</b> has request to create a community.
            </p>
            <p>{!request.updateById && " Let's review it"}</p>
          </CardContent>
        </Link>
        {!request.updateById && (
          <CardFooter className="flex items-center justify-end gap-2 pb-3">
            <Button onClick={() => handleAction(RequestStatus.ACCEPTED)}>
              Approve
            </Button>
            <Button
              onClick={() => handleAction(RequestStatus.REJECTED)}
              variant="destructive"
            >
              Reject
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
