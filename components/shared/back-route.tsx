"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const BackRoute = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="ghost"
      className={cn(
        "block h-8 w-6 overflow-hidden p-1 pr-2 transition hover:mr-2 hover:w-fit",
        className,
      )}
    >
      <ChevronLeft className="inline-block h-5 w-5" />
      <span>Back</span>
    </Button>
  );
};

export default BackRoute;
