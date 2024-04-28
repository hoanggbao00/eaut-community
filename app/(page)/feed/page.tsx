import CustomFeed from "@/components/homepage/custom-feed";
import MiniCreatePost from "@/components/MiniCreatePost";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Feedpage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/");

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your Feed</h1>
      <div className="flex flex-col-reverse gap-y-4 py-6 md:flex-row md:gap-x-4">
        <div className="flex-1">
          <MiniCreatePost session={session} />
          <CustomFeed />
        </div>
      </div>
    </>
  );
};

export default Feedpage;
