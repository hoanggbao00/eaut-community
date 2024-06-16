import prisma from "@/lib/db/prisma";
import { Session } from "next-auth";
import FollowToLeave from "./follow-to-leave";
import { Community } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Pencil, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CommunityActionProps {
  isModerator: boolean;
  session: Session | null;
  community: Pick<Community, "id" | "name" | "creatorId">;
}

const CommunityAction: React.FC<CommunityActionProps> = async ({
  session,
  community,
  isModerator,
}) => {
  const follow = !session?.user
    ? undefined
    : await prisma.follow.findFirst({
        where: {
          community: {
            name: community.name,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isFollowed = !!follow;

  return (
    <div className="mt-2 flex flex-1 items-center justify-end gap-3">
      {isFollowed && (
        <Link
          href={`/${session ? "submit" : "sign-in"}`}
          className={buttonVariants({
            variant: "outline",
            className: "!rounded-full",
          })}
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo bài viết
        </Link>
      )}
      {community.creatorId !== session?.user?.id && (
        <FollowToLeave
          isFollowed={isFollowed}
          communityId={community.id}
          communityName={community.name}
          session={session}
        />
      )}
      {(community.creatorId === session?.user?.id ||
        isModerator ||
        session?.user.role === "ADMIN") && (
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "!rounded-full ",
            })}
            href={`/c/${community.name}/edit`}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        )}
    </div>
  );
};

export default CommunityAction;
