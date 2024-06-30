"use client";

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
  const [searchData, setSearchData] = useState<any>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query) return;
    try {
      if (!query) return [];
      const { data } = await axios.get(`/api/search?q=${query}`);
      if (data) {
        setSearchData(data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedHandleSearch = useCallback(
    useDebouncedCallback(handleSearch, 1000),
    [input],
  );

  return (
    <div className="relative z-50 w-3/4 overflow-visible rounded-lg border md:w-2/3 lg:w-1/2">
      <Input
        onChange={(e) => {
          setInput(e.target.value);
          debouncedHandleSearch(e.target.value);
          if (!e.target.value) {
            setIsLoading(false);
            setSearchData([]);
            return;
          }
          setIsLoading(true);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={input}
        className="border-none outline-none focus:!border-none focus:!outline-none"
        placeholder="Tìm kiếm..."
      />

      {input && (
        <Button
          onClick={() => setInput("")}
          className="absolute right-1.5 top-0 text-xl"
          variant="ghost"
          size="icon"
        >
          &times;
        </Button>
      )}
      {isLoading && (
        <Loader2 className="absolute right-3 top-[22%] h-6 w-6 animate-spin" />
      )}

      {input && isFocused && (
        <div className="fixed left-0 top-12 h-fit w-full rounded-b-md bg-muted p-2 shadow sm:absolute sm:top-[120%] sm:w-full">
          {isLoading && <div>Đang tìm kiếm...</div>}
          {searchData[0]?.length > 0 && !isLoading && (
            <SearchResult
              key={"communities"}
              heading="Cộng đồng"
              data={searchData[0]}
            />
          )}
          {searchData[1]?.length > 0 && !isLoading && (
            <SearchResult
              key={"posts"}
              heading="Bài đăng"
              data={searchData[1]}
            />
          )}
          {searchData[2]?.length > 0 && !isLoading && (
            <>
              <SearchResult key={"user"} heading="User" data={searchData[2]} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
