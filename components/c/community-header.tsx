import { Community, RequestStatus } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import CommunityAction from "./community-action";
import { Badge } from "../ui/badge";
import { ShowAvatar } from "../show-avatar";

interface CommunityHeaderProps {
  memberCount: number;
  session: Session;
  categoryTitle: string;
  community: Pick<
    Community,
    "name" | "image" | "cover" | "id" | "creatorId" | "status"
  >;
  isModerator: boolean;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  memberCount,
  session,
  community,
  categoryTitle,
  isModerator,
}) => {
  return (
    <div className="h-80 md:relative md:h-52">
      <div className="relative h-1/2">
        <Image
          alt="cover"
          fill
          src={
            community.cover ||
            "https://styles.redditmedia.com/t5_2ubgg/styles/bannerBackgroundImage_qhj1ts036d811.jpg?format=pjpg&s=9f3ecce6a0cf7923edaeca4a3f31389f15b8db63"
          }
          className="rounded-lg object-cover"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="rounded-full bg-background p-2 shadow-lg md:absolute md:left-3 md:top-[35%]">
          <ShowAvatar
            className="h-12 w-12 md:h-20 md:w-20"
            data={{
              name: community.name,
              image: community.image,
            }}
          />
        </div>
        <div className="w-1/2 md:flex-[2] md:pl-32">
          <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            {community.name}
            {community.status === RequestStatus.PENDING ? (
              <Badge className="bg-yellow-200 text-yellow-900 hover:bg-yellow-300/80">
                Pending Reviews
              </Badge>
            ) : (
              <Badge className="bg-green-200 text-green-900 hover:bg-green-300 hover:text-green-900">
                {categoryTitle}
              </Badge>
            )}
          </h1>
          <span className="text-sm text-neutral-500 md:hidden">
            {memberCount} follower
          </span>
        </div>
        {community.status !== RequestStatus.PENDING && (
          <CommunityAction
            isModerator={isModerator}
            session={session}
            community={{
              id: community.id,
              name: community.name,
              creatorId: community.creatorId,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;
