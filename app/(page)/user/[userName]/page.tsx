import { ShowAvatar } from "@/components/show-avatar";
import UserCard from "@/components/user/user-card";
import prisma from "@/lib/db/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import PostFeed from "@/components/post-feed";
import { getServerSession } from "next-auth";
import UserCommentFeed from "@/components/user/user-comment-feed";

interface Props {
  params: { userName: string };
  searchParams: { tab: "posts" | "comments" };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const userName = params.userName;

  // fetch data
  const res = await prisma.user.findFirst({
    where: {
      username: userName,
    },
  });

  if (!res) return notFound();

  return {
    title: res.username,
  };
}

const page = async ({ params, searchParams }: Props) => {
  const { tab } = searchParams;

  const session = await getServerSession();

  const user = await prisma.user.findFirst({
    where: {
      username: params.userName,
    },
    include: {
      Comment: {
        include: {
          post: {
            include: {
              community: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          }, //comment include
          votes: true, // comment include
        }, // END comment include
        orderBy: {
          createdAt: "desc",
        },
      }, // comment
      Post: {
        include: {
          community: true,
          votes: true,
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }, // post
      createdCommunity: {
        select: {
          name: true,
        },
      }, // createdCommunity
      Follow: {
        include: {
          community: true,
        },
      }, // followedCommunity
      _count: {
        select: {
          Post: true,
          Comment: true,
          Vote: true,
          CommentVote: true,
        },
      }, // Count
    }, // prisma
  });

  if (!user) return notFound();

  return (
    <main className="relative w-full md:pr-80 pb-4">
      <div className="space-y-3 pr-3">
        <div className="flex items-end gap-4">
          <ShowAvatar
            className="h-20 w-20"
            data={{ name: user.username, image: user.image }}
          />
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-lg">u/{user.username}</p>
          </div>
        </div>
        <Tabs defaultValue={tab ? tab : "posts"} className="!mt-12">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <Separator className="my-3" />
          <TabsContent value="posts">
            <PostFeed
              initialPosts={user.Post}
              showCommunityName={true}
              session={session}
              userId={user.id}
            />
          </TabsContent>
          <TabsContent value="comments">
            <UserCommentFeed
              comments={user.Comment}
              userName={user.username!}
            />
          </TabsContent>
        </Tabs>
      </div>
      <UserCard
        user={{
          name: user.name,
          followed: user.Follow,
          created: user.createdCommunity,
          postCount: user._count.Post + user._count.Vote,
          commentCount: user._count.Comment + user._count.CommentVote,
        }}
      />
    </main>
  );
};

export default page;
