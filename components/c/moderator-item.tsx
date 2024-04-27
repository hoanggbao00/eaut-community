import { User } from "@prisma/client";
import { ShowAvatar } from "../shared/show-avatar";
import { formatDate } from "@/lib/utils";

interface props {
  mod: {
    createdDate: Date;
    user: Pick<User, "name" | "image" | "username">;
  };
  showTime: boolean;
}

const ModeratorItem = ({ mod, showTime }: props) => {
  return (
    <div className="rounded-md bg-muted p-3 border">
      <div className="flex items-center gap-2">
        <ShowAvatar
          data={{
            name: mod.user.name,
            image: mod.user.image,
          }}
        />
        <p className="text-sm ">
          <b className="line-clamp-2 truncate text-wrap">{mod.user.name}</b>
          <span className="text-muted-foreground">u/{mod.user.username}</span>
        </p>
      </div>
      {showTime && (
        <span className="text-xs">
          Authorized from:{" "}
          {formatDate(new Date(mod.createdDate).toISOString(), false)}
        </span>
      )}
    </div>
  );
};

export default ModeratorItem;
