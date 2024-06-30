"use client";

import { Prisma, Community, Post } from "@prisma/client";
import axios from "axios";
import { FC, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import SearchResult from "./search-result";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const debouncedHandleSearch = useCallback(useDebouncedCallback(handleSearch, 1000), [input]);

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
        placeholder="Tìm kiếm..."
      />

      {input && <Button onClick={() => setInput("")} className='absolute top-0 right-1.5 text-xl' variant="ghost" size="icon" >&times;</Button>}
      {isLoading && (
        <Loader2 className="absolute right-3 top-[22%] h-6 w-6 animate-spin" />
      )}

      {input && (
        <div className="sm:absolute sm:w-full sm:top-[120%] rounded-b-md bg-muted p-2 shadow fixed top-12 w-full left-0 h-fit">
          {isLoading && <div>Đang tìm kiếm...</div>}
          {communityData && !isLoading && (
            <SearchResult
              key={"communities"}
              heading="Cộng đồng"
              data={communityData}
            />
          )}
          {postData && !isLoading && (
            <SearchResult key={"posts"} heading="Bài đăng" data={postData} />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
