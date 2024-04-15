import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import CreateComment from "./create-comment";
import PostComment from "./post-comment";
import { Separator } from "../ui/separator";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className="mt-2 flex flex-col gap-y-4">
      <Separator />
      <CreateComment postId={postId} session={session} />

      <div className="mt-4 flex flex-col gap-y-5">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((pComment) => {
            const pCommentCount = pComment.votes.reduce((acc, vote) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            }, 0); //count the vote of comment

            const pCommentVote = pComment.votes.find(
              (vote) => vote.userId === session?.user.id,
            ); // check if current user vote this comment

            return (
              <div key={pComment.id} className="flex flex-col">
                {/* render comment */}
                <div className="mb-2">
                  <PostComment
                    comment={pComment}
                    currentVote={pCommentVote}
                    votesCount={pCommentCount}
                    postId={postId}
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
                        (vote) => vote.userId === session?.user.id,
                      ); // check if current user vote this reply

                      return (
                        <div
                          key={reply.id}
                          className="ml-2 border-l-2 border-zinc-200 py-2 pl-4"
                        >
                          <PostComment
                            comment={reply}
                            currentVote={replyVote}
                            votesCount={replyVotesCount}
                            postId={postId}
                          />
                        </div>
                      );
                    })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
