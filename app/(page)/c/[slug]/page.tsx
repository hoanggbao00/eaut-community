import CommunityInfo from "@/components/c/community-info";
import PostFeed from "@/components/post-feed";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import CommunityHeader from "@/components/c/community-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import CommunityModerators from "@/components/c/community-moderator";
import AddModerator from "@/components/c/add-moderator";

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
      moderators: {
        select: {
          createdDate: true,
          User: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              _count: {
                select: {
                  Post: true,
                  Vote: true,
                  Comment: true,
                  CommentVote: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!community) return notFound();

  const memberCount = await prisma.follow.count({
    where: {
      community: {
        name: slug,
      },
    },
  });

  const moderators = community.moderators.map((s) => s.User);

  const isModerator = Boolean(
    moderators.find((m) => m.id === session?.user.id),
  );

  return (
    <>
      <CommunityHeader
        memberCount={memberCount}
        session={session!}
        categoryTitle={community.category!.title}
        community={community}
        isModerator={isModerator}
      />
      <div className="lg:flex lg:gap-3">
        <Tabs
          defaultValue={tab === "about" ? "about" : "feed"}
          className="lg:flex-1"
        >
          <TabsList>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="about" className="lg:hidden">
              About
            </TabsTrigger>
            <TabsTrigger value="moderators">Moderators</TabsTrigger>
          </TabsList>
          <Separator className="my-1" />
          <TabsContent value="feed">
            {/* post feed */}
            <PostFeed
              isModerator={isModerator}
              session={session}
              initialPosts={community.posts}
              communityName={community.name}
            />
          </TabsContent>
          <TabsContent value="about" className="lg:hidden">
            <CommunityInfo community={community} memberCount={memberCount} />
          </TabsContent>
          <TabsContent value="moderators">
            {(session?.user.id !== community.creatorId ||
              session?.user.role === "ADMIN") && (
              <AddModerator
                moderators={moderators}
                communityId={community.id}
                sessionId={session?.user.id}
              />
            )}
            {community.moderators.length > 0 && (
              <CommunityModerators moderators={community.moderators} />
            )}
          </TabsContent>
        </Tabs>
        <div className="hidden lg:block">
          <CommunityInfo community={community} memberCount={memberCount} />
        </div>
      </div>
    </>
  );
};

export default page;
