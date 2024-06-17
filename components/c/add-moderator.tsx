"use client";
import { useDebouncedCallback } from "use-debounce";
import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ShowAvatar } from "../shared/show-avatar";
import { Loader2, X } from "lucide-react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { UserSearch } from "@/types/db";
import { User } from "@prisma/client";

type selectItem = Pick<User, "name" | "image" | "id" | "username">;

const AddModerator = ({
  communityId,
  sessionId,
  moderators,
}: {
  moderators: selectItem[];
  communityId: string;
  sessionId: string | undefined;
}) => {
  const [searchData, setSearchData] = useState<UserSearch[] | []>([]);
  const [selectItem, setSelectItem] = useState<selectItem[] | []>(moderators);
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const router = useRouter();

  //Debounce search user
  const handleSearch = useDebouncedCallback(async (q: string) => {
    if (q === "") return setSearchData([]);
    try {
      const { data }: { data: UserSearch[] } = await axios.get(
        `/api/user/search?q=${q}`,
      );

      const filterData = data.filter((user) => {
        //filter self
        if (user.id === sessionId) return false;

        // filter user is banned
        if (user.isBanned) return false;

        // filter user is follow this community
        if (user.follow.find((c) => c.communityId === communityId)) return true;

        return true;
      });

      setSearchData(filterData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
      });
    }

    setSearching(false);
  }, 1000);

  // handle Update button
  const handleSave = async () => {
    setLoading(true);
    const ids = selectItem.map((s) => s.id);
    const payload = {
      communityId: communityId,
      userIds: ids,
    };

    try {
      await axios.put("/api/community/moderator", payload);

      toast({
        title: "Moderators updated successfully",
        variant: "success",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description:
          "Moderators wasn't updated successfully. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete selected item
  const deleteSelected = (id: string) => {
    const deletedData = selectItem.filter((s) => s.id !== id);

    setSelectItem(deletedData);
  };

  const addSelected = (user: selectItem) => {
    const found = selectItem.find((s) => s.id === user.id);

    if (found) return;

    setSelectItem([...selectItem, user]);
  };

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Quản lý
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý kiểm duyệt</DialogTitle>
          <DialogDescription>
            Chắc chắn kiểm tra thật kỹ trước khi gửi!
          </DialogDescription>
        </DialogHeader>
        {selectItem && (
          <div className="flex max-h-56 flex-wrap gap-2 overflow-auto">
            {selectItem.map((s) => (
              <div key={s.id} className="flex size-fit items-center gap-2 rounded-full bg-green-300 px-3 py-1 text-black">
                <ShowAvatar
                  className="size-6"
                  data={{
                    name: s.name,
                    image: s.image,
                  }}
                />
                <p className="text-xs">
                  <span className="block max-w-32 truncate text-nowrap font-medium">
                    {s.name}
                  </span>
                  <span>u/{s.username}</span>
                </p>
                <button
                  className="rounded-full bg-red-300 p-1 hover:bg-red-300/80"
                  onClick={() => deleteSelected(s.id)}
                >
                  <X size="16" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-md border">
          <Input
            placeholder="Type a name or username to search"
            onChange={(e) => {
              setSearching(true);
              handleSearch(e.target.value);
              setQuery(e.target.value);
            }}
            value={query}
          />
          <div className="max-h-[45dvh] space-y-2 p-1 py-2">
            {searchData.map((user) => (
              <Button
                variant="ghost"
                key={user.id}
                className="flex w-full items-center justify-start gap-2 py-6"
                onClick={() => addSelected(user)}
              >
                <ShowAvatar
                  data={{ name: user.name, image: user.image }}
                  className="size-7"
                />
                <p className="text-left">
                  <span className="block">{user.name}</span>
                  u/{user.username}
                </p>
              </Button>
            ))}
            {!query && (
              <p className="py-2 text-center">Kết quả tìm kiếm sẽ hiển thị ở đây</p>
            )}
            {isSearching && query && (
              <p className="py-2 text-center">Đang tìm kiếm...</p>
            )}
            {!isSearching && query && searchData && (
              <p className="py-2 text-center">Không tim thấy kết quả.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddModerator;
