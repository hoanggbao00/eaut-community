"use client";

import { PostVoteRequest } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "../../../hooks/use-toast";
import { Button } from "../../ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import usePrevious from "@/hooks/use-previous";

interface PostVoteClientProps {
  postId: string;
  initialVoteCount: number;
  initialVote?: VoteType | null;
}

const PostVoteClient = ({
  postId,
  initialVoteCount,
  initialVote,
}: PostVoteClientProps) => {
  const [votesCount, setVotesCount] = useState<number>(initialVoteCount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  // ensure sync with server
  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const handleVote = async (type: VoteType) => {
    try {
      const payload: PostVoteRequest = {
        voteType: type,
        postId: postId,
      };

      const res = await axios.put("/api/community/post/vote", payload);
      if (!res) return;

      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === "UP") setVotesCount((prev) => prev - 1);
        else if (type === "DOWN") setVotesCount((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(type);
        if (type === "UP")
          setVotesCount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesCount((prev) => prev - (currentVote ? 2 : 1));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "You need to sign in to vote this post.",
            description: "Your vote was not registered. Please try again.",
            variant: "destructive",
          });
        }
      }

      if (type === "UP") setVotesCount((prev) => prev - 1);
      else setVotesCount((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 overflow-hidden rounded-full bg-secondary">
      {/* upvote */}
      <Button
        onClick={() => handleVote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
        className={cn("hover:text-sky-500")}
      >
        <ArrowBigUp
          className={cn("h-5 w-5", {
            "fill-sky-500 text-sky-500 hover:fill-none": currentVote === "UP",
          })}
        />
      </Button>

      {/* score */}
      <p className="py-2 text-center text-sm font-medium ">{votesCount}</p>

      {/* downvote */}
      <Button
        onClick={() => handleVote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
        className="hover:text-red-500"
      >
        <ArrowBigDown
          className={cn("h-5 w-5", {
            "fill-red-500 text-red-500 hover:fill-none": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
