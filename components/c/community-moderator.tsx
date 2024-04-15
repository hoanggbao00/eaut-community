import { User } from "@prisma/client";
import ModeratorItem from "./moderator-item";

interface props {
  moderators: {
    createdDate: Date;
    User: Pick<User, "name" | "image" | "username"> & {
      _count: {
        Post: number;
        Vote: number;
        Comment: number;
        CommentVote: number;
      };
    };
  }[];
}

const CommunityModerators = ({ moderators }: props) => {
  return (
    <div className="space-y-3 mt-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {moderators.map((mod) => {
          const pInteract = mod.User._count.Post + mod.User._count.Vote;
          const cmInteract =
            mod.User._count.Comment + mod.User._count.CommentVote;

          return (
            <ModeratorItem
              mod={mod}
              postCount={pInteract}
              commentCount={cmInteract}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CommunityModerators;
