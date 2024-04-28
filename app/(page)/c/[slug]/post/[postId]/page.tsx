import BackToCommunity from "@/components/shared/back-to-community";
import CommunityInfo from "@/components/c/info/community-info";
import CommentsSection from "@/components/comments/comments-section";
import EditorOutput from "@/components/editor/editor-output";
import PostEdit from "@/components/post-edit";
import PostVoteServer from "@/components/post/vote/post-vote-server";
import PostMore from "@/components/post/post-more";
import VoteSkeleton from "@/components/skeleton/vote-skeleton";
import { ShowAvatar } from "@/components/shared/show-avatar";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { checkYoutubeUrl, formatTimeToNow } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import YoutubeEmbed from "@/components/youtube-embed";
import ReceiveNotification from "@/components/post/receive-notification";

interface CommunityPostPageProps {
  params: {
    postId: string;
    slug: string;
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
              followers: true,
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
    <div className="flex h-full items-start justify-between gap-2">
      <div className="w-full flex-1 bg-background">
        <div className="rounded-md p-2 dark:border dark:border-muted-foreground">
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
                {session?.user && (
                  <ReceiveNotification
                    notifierIds={post.notifierIds}
                    userId={session.user.id}
                    postId={post.id}
                  />
                )}
                <ShowAvatar
                  data={{
                    name: post.author.name,
                    image: post.author.image,
                  }}
                  className="h-7 w-7"
                />
                <div>
                  <h3 className="text-sm font-medium hover:underline">
                    <a href={`/c/${post.community.name}`}>
                      c/{post.community.name}
                    </a>
                  </h3>
                  <p className="text-xs text-gray-500">
                    <Link
                      href={`/user/${post.author.username}`}
                      className="hover:underline"
                    >
                      Posted by <b>{post.author!.username}</b>
                    </Link>
                    {" • "}
                    {formatTimeToNow(new Date(post?.createdAt))}
                  </p>
                </div>
              </div>
              <h1 className="py-2 text-2xl font-semibold leading-6 text-primary">
                {post?.title}
              </h1>
              {post.attachment &&
                (checkYoutubeUrl(post.attachment) ? (
                  <div className="py-1">
                    <YoutubeEmbed src={post.attachment} />
                  </div>
                ) : (
                  <div className="relative my-1 aspect-video w-full">
                    <Image
                      src={post.attachment}
                      alt="post attachment"
                      fill
                      className="rounded-md object-contain"
                    />
                  </div>
                ))}
              <EditorOutput content={post?.content} />
            </>
          ) : (
            <PostEdit
              postId={post.id}
              postContent={post.content}
              postTitle={post.title}
              communityName={post.community.name}
              attachmentUrl={post.attachment}
            />
          )}
        </div>
        {!isEdit && (
          <div>
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
                <span>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
                  Loading comment...
                </span>
              }
            >
              <CommentsSection postId={post?.id} communityName={params.slug} />
            </Suspense>
          </div>
        )}
      </div>

      {/* Community info */}
      <div className="hidden lg:block">
        <CommunityInfo
          communityName={post.community.name}
          isSinglePost={true}
        />
      </div>
    </div>
  );
};

export default CommunityPostPage;
