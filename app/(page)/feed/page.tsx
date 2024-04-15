import CustomFeed from "@/components/homepage/custom-feed";
import MiniCreatePost from "@/components/MiniCreatePost";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Feedpage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/");

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="flex flex-col-reverse gap-y-4 py-6 md:flex-row md:gap-x-4">
        <div className="flex-1">
          <MiniCreatePost session={session} />
          <CustomFeed />
        </div>

        {/* community info */}
        <div className="h-fit w-full rounded-lg border border-gray-200 md:w-64">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Community Homepage. Come here to check in with
                your favorite communities.
              </p>
            </div>
            <Link
              className={buttonVariants({
                className: "mb-6 mt-4 w-full",
              })}
              href={`/c/create`}
            >
              Create Community
            </Link>
          </dl>
        </div>
      </div>
    </>
  );
};

export default Feedpage;
