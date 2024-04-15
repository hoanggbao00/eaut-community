import BackToCommunity from "@/components/back-to-community";
import CommunityInfo from "@/components/c/community-info";
import CommentsSection from "@/components/comments/comments-section";
import EditorOutput from "@/components/editor/editor-output";
import PostEdit from "@/components/post-edit";
import PostVoteServer from "@/components/post/vote/post-vote-server";
import PostMore from "@/components/post/post-more";
import VoteSkeleton from "@/components/skeleton/vote-skeleton";
import { ShowAvatar } from "@/components/show-avatar";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { formatTimeToNow } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface CommunityPostPageProps {
  params: {
    postId: string;
  };
  searchParams: {
    edit: string;
  };
}

export async function generateMetadata({
  params,
}: CommunityPostPageProps): Promise<Metadata> {
  // read route params
  const postId = params.postId;

  // fetch data
  const res = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!res) return notFound();

  return {
    title: res.title,
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CommunityPostPage = async ({
  params,
  searchParams,
}: CommunityPostPageProps) => {
  const session = await getAuthSession();
  const isEdit = Boolean(searchParams.edit);

  const post = await prisma.post.findFirst({
    where: {
      id: params.postId,
    },
    include: {
      votes: true,
      author: true,
      community: {
        include: {
          moderators: {
            where: {
              userId: session?.user.id,
            },
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              follows: true,
            },
          },
        },
      },
    },
  });

  if (!post) return notFound();

  const permission =
    session?.user.role === "ADMIN" ||
    session?.user.id === post.authorId ||
    post.community.moderators.length > 0;

  return (
    <div>
      <div className="flex h-full items-start justify-between">
        <div className="w-full flex-1 rounded-sm bg-white p-4">
          <BackToCommunity />
          {!isEdit ? (
            <>
              <div className="relative flex items-center gap-2">
                {permission && (
                  <PostMore
                    permission={permission}
                    session={session}
                    postId={post.id}
                    communityName={post.community.name}
                  />
                )}
                <ShowAvatar
                  data={{
                    name: post.author!.name,
                    image: post.author!.image,
                  }}
                  className="h-7 w-7"
                />
                <div>
                  <h3 className="text-sm font-medium">
                    c/{post?.community.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Posted by {post.author!.username}
                    {" • "}
                    {formatTimeToNow(new Date(post?.createdAt))}
                  </p>
                </div>
              </div>
              <h1 className="py-2 text-2xl font-semibold leading-6 text-gray-900">
                {post?.title}
              </h1>

              <EditorOutput content={post?.content} />
              <Suspense fallback={<VoteSkeleton />}>
                <div className="mt-2 w-fit">
                  <PostVoteServer
                    postId={post?.id}
                    getData={async () => {
                      return await prisma.post.findUnique({
                        where: {
                          id: params.postId,
                        },
                        include: {
                          votes: true,
                        },
                      });
                    }}
                  />
                </div>
              </Suspense>
              <Suspense
                fallback={
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                }
              >
                <CommentsSection postId={post?.id} />
              </Suspense>
            </>
          ) : (
            <PostEdit
              postId={post.id}
              postContent={post.content}
              postTitle={post.title}
              communityName={post.community.name}
            />
          )}
        </div>

        {/* Community info */}
        <div className="hidden lg:block">
          <CommunityInfo
            community={post.community}
            memberCount={post.community._count.follows}
            isSinglePost={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityPostPage;
