"use client";
import CreateComment from "./create-comment";
import PostComment from "./post-comment";
import { Separator } from "../ui/separator";
import { TooltipProvider } from "../ui/tooltip";
import { useSession } from "next-auth/react";
import { ExtendedComment } from "@/types/db";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";

interface CommentsSectionProps {
  postId: string;
  communityName: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) throw new Error("Error fetching");
  return data;
};

const CommentsSection = ({ postId, communityName }: CommentsSectionProps) => {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<ExtendedComment[]>([]);
  const take = 6;
  const session = useSession();
  const user = session.data?.user;

  const { data, isLoading, mutate } = useSWR<{
    total: number;
    data: ExtendedComment[];
  }>(
    `/api/community/post/${postId}/comment?page=${page}&take=${take}`,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    if(page == 1) return setComments(data.data)
    setComments((prev) => [...prev, ...data.data]);
  }, [data?.data]);


  const totalPage = useMemo(() => {
    if (!data?.total) return 1;
    return Math.ceil(data?.total / take);
  }, [data?.total]);

  const handleShowMore = () => {
    if (totalPage === 1) return;
    if (totalPage === page) return;

    setPage((prev) => prev + 1);
  };

  return (
    <TooltipProvider>
      <div className="mt-2 flex flex-col gap-y-4 pb-10">
        <Separator />
        <CreateComment postId={postId} user={user} mutate={mutate} />

        <div className="mt-4 flex flex-col gap-y-5">
          {isLoading && <div>Loading comment...</div>}
          {comments
            .filter((comment) => !comment.replyToId)
            .map((pComment) => {
              const pCommentCount = pComment.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              }, 0); //count the vote of comment

              const pCommentVote = pComment.votes.find(
                (vote) => vote.userId === user?.id,
              ); // check if current user vote this comment

              // check if user is moderator or creator of community
              const isModerator = !!pComment.author.communityModerator?.find(
                (c) => c.community.name === communityName,
              );
              const isCreator = !!pComment.author.createdCommunity?.find(
                (c) => c.name === communityName,
              );

              return (
                <div key={pComment.id} className="flex flex-col">
                  {/* render comment */}
                  <div className="target:animate-highlight" id={pComment.id}>
                    <PostComment
                      comment={pComment}
                      currentVote={pCommentVote}
                      votesCount={pCommentCount}
                      postId={postId}
                      moderatorBadge={isModerator || isCreator}
                      mutate={mutate}
                    />
                  </div>

                  {/* Render replies */}
                  {pComment.replies &&
                    pComment.replies
                      .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most liked
                      .map((reply) => {
                        const replyVotesCount = reply.votes.reduce(
                          (acc, vote) => {
                            if (vote.type === "UP") return acc + 1;
                            if (vote.type === "DOWN") return acc - 1;
                            return acc;
                          },
                          0,
                        ); // Count votes of this replies

                        const replyVote = reply.votes.find(
                          (vote) => vote.userId === user?.id,
                        ); // check if current user vote this reply

                        // check if user is moderator or creator of community
                        const _isModerator =
                          !!reply.author.communityModerator?.find(
                            (c) => c.community.name === communityName,
                          );
                        const _isCreator =
                          !!reply.author.createdCommunity?.find(
                            (c) => c.name === communityName,
                          );

                        return (
                          <div
                            key={reply.id}
                            id={reply.id}
                            className="ml-2 border-l-2 border-muted py-2 pl-4 target:animate-highlight"
                          >
                            <PostComment
                              comment={reply}
                              currentVote={replyVote}
                              votesCount={replyVotesCount}
                              postId={postId}
                              moderatorBadge={_isModerator || _isCreator}
                              mutate={mutate}
                            />
                          </div>
                        );
                      })}
                </div>
              );
            })}
        </div>
        {page !== totalPage && data?.total && (
          <Button variant="ghost" onClick={handleShowMore}>
            Show more {data.total - take} comments
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CommentsSection;
