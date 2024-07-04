"use client";

import { Facebook, Forward } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ShareDropdown = ({
  facebook = true,
  className,
}: {
  facebook?: boolean;
  className?: string;
}) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-gray flex items-center justify-center gap-2 rounded-full border bg-muted p-2 font-medium hover:bg-muted-foreground/20 hover:text-sky-500 dark:border dark:border-muted-foreground">
        <Forward size="18" /> Chia sẻ
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Chia sẻ</DropdownMenuLabel>
        <DropdownMenuItem>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}//&src=sdkpreparse`}
            target="_blank"
            className={twMerge(
              "flex items-center justify-center gap-2",
              className,
            )}
          >
            <Facebook className="text-sky-500" size="20" /> Facebook
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareDropdown;
