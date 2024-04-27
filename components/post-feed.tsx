"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/constants";
import { ExtendedPost } from "@/types/db";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import Post from "./post/post";
import { Session } from "next-auth";
import useIntersection from "@/hooks/use-intersection";

interface PostFeedProps {
  session: Session | null;
  initialPosts: ExtendedPost[];
  communityName?: string;
  showCommunityName?: boolean;
  userId?: string;
  isModerator?: boolean;
}

const PostFeed: FC<PostFeedProps> = ({
  session,
  initialPosts,
  communityName,
  showCommunityName = false,
  userId,
  isModerator,
}) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const entry = useIntersection(lastPostRef, { threshold: 1 });
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(2);
  const [posts, setPosts] = useState<ExtendedPost[]>(initialPosts);

  const loadMorePost = async () => {
    setIsFetching(true);
    const query =
      `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${page}` +
      (!!communityName
        ? `&communityName=${communityName}`
        : userId
          ? `&userId=${userId}`
          : "");

    const { data } = await axios.get(query);
    if (data) setPosts([...posts, ...data]);

    setIsFetching(false);
  };

  useEffect(() => {
    if (entry) {
      loadMorePost(); // Load more posts when the last post comes into view
      setPage((prev) => prev + 1);
    }
  }, [entry]);

  return (
    <div className="flex flex-1 flex-col space-y-6 pb-3">
      {posts &&
        posts.map((post, index) => {
          const voteCount = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);

          const currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id,
          );

          if (index === posts.length - 1) {
            // Add a ref to the last post in the list
            return (
              //@ts-ignore
              <div key={post.id} ref={lastPostRef}>
                <Post
                  isModerator={isModerator}
                  session={session}
                  post={post}
                  voteCount={voteCount}
                  currentVote={currentVote}
                  commentCount={post.comments.length}
                  communityName={communityName || post.community.name}
                  showCommunityName={showCommunityName}
                />
              </div>
            );
          } else {
            return (
              <Post
                isModerator={isModerator}
                session={session}
                key={post.id}
                post={post}
                voteCount={voteCount}
                currentVote={currentVote}
                commentCount={post.comments.length}
                communityName={communityName || post.community.name}
                showCommunityName={showCommunityName}
              />
            );
          }
        })}

      {isFetching ? (
        <li className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </li>
      ): <p className="mx-auto py-2 text-xl uppercase text-muted-foreground">End of content</p>}
    </div>
  );
};

export default PostFeed;
