"use client";

import { Prisma, Community, Post } from "@prisma/client";
import axios from "axios";
import { FC, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import SearchResult from "./search-result";
import { Input } from "@/components/ui/input";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [communityData, setCommunityData] = useState<
    (Community & {
      _count: Prisma.CommunityCountOutputType;
    })[]
  >();

  const [postData, setPostData] = useState<
    (Post & {
      _count: Prisma.PostCountOutputType;
    })[]
  >();

  const handleSearch = async (query: string) => {
    if (!query) return;
    try {
      if (!query) return [];
      const { data } = await axios.get(`/api/search?q=${query}`);
      if (data) {
        setCommunityData(data[0]);
        setPostData(data[1]);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedHandleSearch = useCallback(useDebouncedCallback(handleSearch, 1000), []);

  return (
    <div className="relative z-50 w-3/4 overflow-visible rounded-lg border md:w-2/3 lg:w-1/2">
      <Input
        onChange={(e) => {
          setInput(e.target.value);
          debouncedHandleSearch(e.target.value);
          if (!e.target.value) {
            setIsLoading(false);
            setCommunityData(undefined);
            setPostData(undefined);
            return;
          }
          setIsLoading(true);
        }}
        value={input}
        className="border-none outline-none focus:!border-none focus:!outline-none"
        placeholder="Search communities..."
      />
      {isLoading && (
        <Loader2 className="absolute right-3 top-[22%] h-6 w-6 animate-spin" />
      )}

      {input && (
        <div className="absolute inset-x-0 top-[120%] rounded-b-md bg-white p-2 shadow">
          {isLoading && <div>Searching...</div>}
          {communityData && !isLoading && (
            <SearchResult
              key={"communities"}
              heading="Communities"
              data={communityData}
            />
          )}
          {postData && !isLoading && (
            <SearchResult key={"posts"} heading="Post" data={postData} />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
