"use client";

import { Ellipsis, Flag, Share, UserRoundX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const UserMore = () => {
  const handleClick = () => {
    toast({
      title: "Hehe",
      variant: "warning",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-0 top-0 z-10 rounded-full bg-background p-1 hover:bg-foreground/20">
        <Ellipsis className="h-4 w-4 text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-2 p-2">
        <DropdownMenuItem onClick={handleClick}>
          <Share className="mr-2" />
          Chia sẻ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClick}>
          <UserRoundX className="mr-2" />
          Chặn tài khoản
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={handleClick}>
          <Flag className="mr-2" />
          Báo cáo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMore;
