import { User } from "@prisma/client";
import ModeratorItem from "./moderator-item";

interface props {
  moderators: {
    createdDate: Date;
    user: Pick<User, "name" | "image" | "username">;
  }[];
  isPermission: boolean
}

const CommunityModerators = ({ moderators, isPermission }: props) => {
  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {moderators.map((mod) => {
          return <ModeratorItem key={mod.user.username}  mod={mod} showTime={isPermission}/>;
        })}
      </div>
    </div>
  );
};

export default CommunityModerators;
