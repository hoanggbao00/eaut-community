"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import usePrevious from "@/hooks/use-previous";
import { CommentVote, VoteType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useState } from "react";

interface CommentVotesProps {
  commentId: string;
  votesCount: number;
  currentVote?: PartialVote;
}

type PartialVote = Pick<CommentVote, "type">;

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  votesCount: _votesCount,
  currentVote: _currentVote,
}) => {
  const [votesCount, setVotesCount] = useState<number>(_votesCount);
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
    _currentVote,
  );
  const prevVote = usePrevious(currentVote);

  const handleVote = async (type: VoteType) => {
    try {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId,
      };

      const data = await axios.put("/api/community/post/comment/vote", payload);

      if (!data) return;
      if (currentVote?.type === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === "UP") setVotesCount((prev) => prev - 1);
        else if (type === "DOWN") setVotesCount((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote({ type });
        if (type === "UP")
          setVotesCount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesCount((prev) => prev - (currentVote ? 2 : 1));
      }
    } catch (error) {
      if (type === "UP") setVotesCount((prev) => prev - 1);
      else setVotesCount((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Something went wrong.",
            description: "You need sign in to vote this comment",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-1 flex items-center gap-1 overflow-hidden rounded-full bg-secondary">
      {/* upvote */}
      <Button
        onClick={() => handleVote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
				className={cn("p-0 px-1 hover:text-sky-500", {
          "text-sky-500": currentVote?.type === "UP",
        })}
      >
        <ArrowBigUp
          className={cn("h-5 w-5", {
            "fill-emerald-500 hover:fill-none": currentVote?.type === "UP",
          })}
        />
      </Button>

      {/* score */}
      <p className="px-1 py-2 text-center text-xs font-medium text-muted-foreground">
        {votesCount}
      </p>

      {/* downvote */}
      <Button
        onClick={() => handleVote("DOWN")}
        size="sm"
        className={cn("p-0 px-1 hover:text-red-500", {
          "text-red-500": currentVote?.type === "DOWN",
        })}
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 hover:fill-none", {
            "fill-red-500 text-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
