import { formatDate } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Community } from "@prisma/client";
import UserMore from "./user-more";

interface Props {
  name: string | null;
  followed: { community: Community }[];
  created: { name: string }[];
  postCount: number;
  commentCount: number;
  createdAt?: Date;
}

const UserCard = ({ user }: { user: Props }) => {
  return (
    <Card className="fixed right-0 top-[9%] hidden h-fit w-80 border-none bg-muted/50 md:block">
      <CardHeader className="p-3">
        <CardTitle className="relative pr-6">
          {user?.name}
          <UserMore />
        </CardTitle>
        <div className="flex gap-2 pt-4">
          <div className="text-sm">
            <p className="font-medium">{user.postCount}</p>
            <span className="text-xs text-muted-foreground">Post Interact</span>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium">{user.commentCount}</p>
            <span className="text-xs text-muted-foreground">
              Comment Action
            </span>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium">
              {formatDate(new Date().toISOString(), "PP")}
            </p>
            <span className="text-xs text-muted-foreground">Make day</span>
          </div>
        </div>
      </CardHeader>
      <Separator className="mb-1 mt-3 bg-foreground/50" />
      <CardContent className="space-y-6 p-3">
        <div>
          <h4 className="text-sm uppercase text-muted-foreground">
            Communities Followed
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
            Communities Created
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
  );
};

export default UserCard;
