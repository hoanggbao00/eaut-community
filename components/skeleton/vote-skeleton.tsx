import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { buttonVariants } from "../ui/button";

const VoteSkeleton = () => {
  return (
    <div className="flex gap-2 overflow-hidden rounded-full bg-secondary">
      {/* UpVote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5" />
      </div>

      {/* score */}
      <Loader2 className="h-3 w-3 animate-spin py-2 text-center text-sm font-medium" />

      {/* DownVote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5" />
      </div>
    </div>
  );
};

export default VoteSkeleton;
