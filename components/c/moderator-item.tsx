import { User } from "@prisma/client";
import { ShowAvatar } from "../show-avatar";
import { formatDate } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { File, MessageSquare } from "lucide-react";

interface props {
  mod: {
    createdDate: Date;
    User: Pick<User, "name" | "image" | "username">;
  };
  postCount: number;
  commentCount: number;
}

const ModeratorItem = ({
  mod,
  postCount,
  commentCount,
}: props) => {
  return (
    <div className="rounded-md bg-muted p-3">
      <div className="flex items-center gap-2">
        <ShowAvatar
          data={{
            name: mod.User.name,
            image: mod.User.image,
          }}
        />
        <p className="text-sm ">
          <b className="line-clamp-2 truncate text-wrap">{mod.User.name}</b>
          <span className="text-muted-foreground">u/{mod.User.username}</span>
        </p>
      </div>
      <span className="text-xs">
        Authorized from:{" "}
        {formatDate(new Date(mod.createdDate).toISOString(), false)}
      </span>
      <Separator className="my-2 h-0.5" />
      <div className="flex items-center justify-around gap-2">
        <p>
          <File className="mx-auto" />
          <span className="text-xs">{postCount} Post</span>
        </p>
        <p>
          <MessageSquare className="mx-auto" />
          <span className="text-xs">{commentCount} Comments</span>
        </p>
      </div>
    </div>
  );
};

export default ModeratorItem;
