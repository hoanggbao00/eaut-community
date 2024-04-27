import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Link2 } from "lucide-react";
import { FC } from "react";
import type { Session } from "next-auth";
import { ShowAvatar } from "./shared/show-avatar";
import Link from "next/link";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  return (
    <div className="mb-5 rounded-md bg-background shadow border">
      <Link
        href="/submit"
				scroll={false}
        className="flex items-center justify-between gap-6 px-6 py-4"
      >
        <div className="relative">
          <ShowAvatar
            data={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
        </div>
        <Input readOnly placeholder="Create post" className="cursor-pointer"/>
        <ImageIcon className="text-zinc-600" size='26'/>
        <Link2 className="text-zinc-600" size='26'/>
      </Link>
    </div>
  );
};

export default MiniCreatePost;
