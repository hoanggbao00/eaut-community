import { getAuthSession } from "@/lib/auth";
import { Community } from "@prisma/client";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import CommunityRules from "./community-rules";
import { cn } from "@/lib/utils";
import { Rules } from "@/types/db";

interface CommunityInfoProps {
  community: Community;
  memberCount: number;
  isSinglePost?: boolean;
}

const CommunityInfo: React.FC<CommunityInfoProps> = async ({
  community,
  memberCount,
  isSinglePost = false,
}) => {
  const session = await getAuthSession();

  return (
    <Card
      className={cn("mb-2 lg:w-[300px]", {
        "w-72": isSinglePost,
      })}
    >
      <CardHeader className="py-0">
        <p className="-ml-4 pb-0 pt-3 text-xs font-semibold text-gray-500">
          ABOUT
        </p>
        <CardTitle className="text-xl">c/{community.name}</CardTitle>
        <CardDescription>{community.description}</CardDescription>
        <dl className="divide-y divide-gray-100 bg-white text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-700">
              <time dateTime={community.createdAt.toDateString()}>
                {format(community.createdAt, "MMMM d, yyyy")}
              </time>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">Members</dt>
            <dd className="flex items-start gap-x-2">
              <div className="text-gray-900">{memberCount}</div>
            </dd>
          </div>
          {community.creatorId === session?.user.id && (
            <dt className="pt-3 text-gray-500">You created this community</dt>
          )}
        </dl>
      </CardHeader>
      <Separator className="mt-3" />
      <CardContent className="px-2">
        <p className="-ml-1 pb-1 pt-3 text-xs font-semibold text-gray-500">
          RULES
        </p>
        {community.rules ? (
          <CommunityRules rules={community.rules as Rules[]} />
        ) : (
          <p>This community has no rule</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityInfo;
