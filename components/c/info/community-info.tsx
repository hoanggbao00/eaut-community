"use client";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Separator } from "../../ui/separator";
import CommunityRules from "./community-rules";
import { cn } from "@/lib/utils";
import { Rules } from "@/types/db";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import CommunityHistory from "./community-history";
import CommunityDelete from "./community-delete";
import { UpdateHistory, UserRole } from "@prisma/client";

interface CommunityInfoProps {
  communityName: string;
  isSinglePost?: boolean;
  role?: UserRole;
  isModerator?: boolean;
  creator?: { id: string; username: string };
  userId?: string;
}

type communityInfo = {
  name: string;
  description: string;
  createdAt: Date;
  rules: {
    title: string;
    detail?: string;
  }[];
  _count: {
    posts: number;
    followers: number;
  };
  updateHistory: UpdateHistory[];
};

const CommunityInfo: React.FC<CommunityInfoProps> = ({
  communityName,
  isSinglePost = false,
  role,
  isModerator,
  creator,
  userId,
}) => {
  const [community, setData] = useState<communityInfo>();

  const getData = async () => {
    try {
      const { data } = await axios.get(`/api/community/${communityName}`);

      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [communityName]);

  return (
    community && (
      <DropdownMenu>
        <Card
          className={cn("mb-2 lg:w-[300px]", {
            "w-72": isSinglePost,
          })}
        >
          <CardHeader className="relative py-0">
            <p className="-ml-4 pb-0 pt-3 text-xs font-semibold text-muted-foreground">
              THÔNG TIN CỘNG ĐỒNG
            </p>
            <DropdownMenuTrigger className="absolute right-1 top-0">
              <Ellipsis className="h-5 w-6 text-gray-500 hover:text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="end">
              {((role && role === "ADMIN") || isModerator) && (
                <CommunityHistory history={community.updateHistory} />
              )}
              {role && role === "ADMIN" && (
                <CommunityDelete communityName={communityName} />
              )}
            </DropdownMenuContent>
            <CardTitle className="text-xl">c/{community.name}</CardTitle>
            <CardDescription>{community.description}</CardDescription>
            <dl className="divide-y divide-muted-foreground bg-background text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-muted-foreground">Ngày tạo</dt>
                <dd className="text-muted-foreground">
                  <time>{format(community.createdAt, "MMMM d, yyyy")}</time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-muted-foreground">Thành viên</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-muted-foreground">
                    {community._count.followers}
                  </div>
                </dd>
              </div>
              {role === "ADMIN" && (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-muted-foreground">Tạo bởi</dt>
                  <dd className="flex items-start gap-x-2">
                    <a
                      href={`/user/${creator?.username}`}
                      className="text-muted-foreground underline"
                    >
                      u/{creator?.username}
                    </a>
                  </dd>
                </div>
              )}
              {creator?.id === userId && (
                <p className="pt-1 text-center text-lg">
                  Bạn là người khởi tạo cộng đồng này
                </p>
              )}
            </dl>
          </CardHeader>
          <Separator className="mt-3" />
          <CardContent className="px-2">
            <p className="-ml-1 pb-1 pt-3 text-xs font-semibold text-muted-foreground">
              ĐIỀU LUẬT
            </p>
            {community.rules ? (
              <CommunityRules rules={community.rules as Rules[]} />
            ) : (
              <p>Cộng đồng này chưa có điều luật</p>
            )}
          </CardContent>
        </Card>
      </DropdownMenu>
    )
  );
};

export default CommunityInfo;
