import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "../ui/button";

const BackToCommunity = () => {
  return (
    <a
      href="../"
      className={buttonVariants({
        variant: "ghost",
        className: "mb-2 !pl-0",
      })}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to Community Feed
    </a>
  );
};

export default BackToCommunity;
