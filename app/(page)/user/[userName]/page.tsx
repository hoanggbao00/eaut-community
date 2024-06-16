import { ShowAvatar } from "@/components/shared/show-avatar";
import UserCard from "@/components/user/user-card";
import prisma from "@/lib/db/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import PostFeed from "@/components/post-feed";
import UserCommentFeed from "@/components/user/user-comment-feed";
import { getAuthSession } from "@/lib/auth";

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

  const session = await getAuthSession();

  const user = await prisma.user.findFirst({
    where: {
      username: params.userName,
    },
    include: {
      comment: {
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
      post: {
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
      follow: {
        include: {
          community: true,
        },
      }, // followedCommunity
      _count: {
        select: {
          post: true,
          comment: true,
          postVote: true,
          commentVote: true,
        },
      }, // Count
    }, // prisma
  });

  if (!user) return notFound();

  return (
    <main className="relative w-full pb-4 md:pr-80">
      <div className="space-y-3 pr-3">
        <div className="flex items-end gap-4">
          <ShowAvatar
            className="h-20 w-20"
            data={{ name: user.username, image: user.image }}
          />
          <div>
            <h3 className="text-xl font-semibold">
              {user.name}
            </h3>
            <p className="text-lg">u/{user.username}</p>
          </div>
        </div>
        {!user.isDeleted && (
          <Tabs defaultValue={tab ? tab : "posts"} className="!mt-12">
            <TabsList>
              <TabsTrigger value="posts">Bài đăng</TabsTrigger>
              <TabsTrigger value="comments">Bình luận</TabsTrigger>
              <TabsTrigger value="info" className="md:hidden">
              Thông tin
              </TabsTrigger>
            </TabsList>
            <Separator className="mt-2" />
            <TabsContent value="posts">
              <PostFeed
                initialPosts={user.post}
                showCommunityName={true}
                session={session}
                userId={user.id}
              />
            </TabsContent>
            <TabsContent value="comments">
              <UserCommentFeed
                comments={user.comment}
                userName={user.username!}
              />
            </TabsContent>
            <TabsContent value="info">
              <UserCard
                userId={session?.user.id}
                role={session?.user.role}
                className="block w-full"
                user={{
                  id: user.id,
                  name: user.name,
                  followed: user.follow,
                  created: user.createdCommunity,
                  postCount: user._count.post + user._count.postVote,
                  commentCount: user._count.comment + user._count.commentVote,
                }}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
      {!user.isDeleted && (
        <div className="hidden w-80 md:block">
          <UserCard
            role={session?.user.role}
            className="fixed right-4 top-[9%]"
            userId={session?.user.id}
            user={{
              id: user.id,
              name: user.name,
              followed: user.follow,
              created: user.createdCommunity,
              postCount: user._count.post + user._count.postVote,
              commentCount: user._count.comment + user._count.commentVote,
            }}
          />
        </div>
      )}
    </main>
  );
};

export default page;
