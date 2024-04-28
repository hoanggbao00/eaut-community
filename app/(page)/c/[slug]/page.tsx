import CommunityInfo from "@/components/c/info/community-info";
import PostFeed from "@/components/post-feed";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import CommunityHeader from "@/components/c/community-header";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import CommunityModerators from "@/components/c/community-moderator";
import AddModerator from "@/components/c/add-moderator";
import FollowerCard from "@/components/c/follower-card";
import TriggerList from "@/components/c/trigger-list";
import CommunityAlerts from "@/components/c/community-alert";

interface CommunityPageProps {
  params: { slug: string };
  searchParams: { tab: string };
}

export async function generateMetadata({
  params,
}: CommunityPageProps): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const res = await prisma.community.findFirst({
    where: {
      name: {
        equals: slug,
        mode: "insensitive",
      },
    },
  });

  if (!res)
    return {
      title: "Not Found",
    };

  return {
    title: "c/" + res.name,
  };
}

const page = async ({ params, searchParams }: CommunityPageProps) => {
  const session = await getAuthSession();

  const { tab } = searchParams;
  const { slug } = params;

  const community = await prisma.community.findFirst({
    where: {
      name: {
        equals: slug,
        mode: "insensitive",
      },
    },
    include: {
      creator: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          followers: true,
        },
      },
      posts: {
        include: {
          community: true,
          author: true,
          votes: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      }, //post
      category: {
        select: {
          title: true,
        },
      }, //category

      followers: {
        select: {
          createdDate: true,
          user: {
            select: {
              name: true,
              username: true,
              image: true,
              _count: {
                select: {
                  post: true,
                  comment: true,
                  postVote: true,
                  commentVote: true,
                },
              },
            },
          },
        },
      }, //followers
      moderators: {
        select: {
          createdDate: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!community) return notFound();

  const moderators = community.moderators.map((s) => s.user);

  const isModerator = Boolean(
    moderators.find((m) => m.id === session?.user.id),
  );

  const isPermission =
    session?.user.role === "ADMIN" ||
    session?.user.id === community.creatorId ||
    !!isModerator;
    console.log(isPermission);

  return (
    <>
      <CommunityHeader
        memberCount={community._count.followers}
        session={session!}
        categoryTitle={community.category!.title}
        community={community}
        isModerator={isModerator}
      />
      <div className="lg:flex lg:gap-3">
        <Tabs defaultValue={!tab ? "feed" : tab} className="lg:flex-1">
          <TabsList>
            <TriggerList isPermission={isPermission} />
          </TabsList>
          <Separator className="my-1" />
          <TabsContent value="feed">
            <CommunityAlerts
              isPermission={isPermission}
              data={community.communityAlert}
              communityId={community.id}
            />
            <Separator className="my-2" />
            <PostFeed
              isModerator={isModerator}
              session={session}
              initialPosts={community.posts}
              communityName={community.name}
            />
          </TabsContent>
          <TabsContent value="about" className="lg:hidden">
            <CommunityInfo
              communityName={community.name}
              role={session?.user.role}
              isModerator={isModerator}
              creator={{
                id: community.creatorId,
                username: community.creator.username!,
              }}
              userId={session?.user.id}
            />
          </TabsContent>
          <TabsContent value="followers">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {community.followers.map((f, index) => (
                <FollowerCard item={f} key={`f-${index}`} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="moderators">
            {community.isAccessible &&
              (session?.user.id === community.creatorId ||
                session?.user.role === "ADMIN") && (
                <AddModerator
                  moderators={moderators}
                  communityId={community.id}
                  sessionId={session?.user.id}
                />
              )}
            {community.moderators.length > 0 && (
              <CommunityModerators
                moderators={community.moderators}
                isPermission={isPermission}
              />
            )}
          </TabsContent>
        </Tabs>
        <div className="hidden lg:block">
          <CommunityInfo
            communityName={community.name}
            role={session?.user.role}
            isModerator={isModerator}
            creator={{
              id: community.creatorId,
              username: community.creator.username!,
            }}
            userId={session?.user.id}
          />
        </div>
      </div>
    </>
  );
};

export default page;
