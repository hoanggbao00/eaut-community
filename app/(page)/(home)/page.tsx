import MiniCreatePost from "@/components/MiniCreatePost";
import GeneralFeed from "@/components/homepage/general-feed";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { EarthIcon, User } from "lucide-react";
import Link from "next/link";

const Homepage = async () => {
  const session = await getAuthSession();
  const community = await prisma.community.findMany({
    where: {
      AND: [
        { NOT: { status: "PENDING" } },
        { NOT: { status: "REJECTED" } },
      ],
    },
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
    take: 6,
    include: {
      _count: {
        select: {
          posts: true,
          follows: true,
        },
      },
    },
  });

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Homepage</h1>
      <div className="flex flex-col-reverse gap-y-4 py-6 md:flex-row md:gap-x-4">
        <div className="flex-1">
          {session && <MiniCreatePost session={session} />}
          <GeneralFeed session={session} />
        </div>

        {/* ranking */}
        <div className="hidden h-fit w-full rounded-lg border md:block md:w-64 lg:w-72">
          <div className="bg-emerald-100 px-6">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <EarthIcon className="h-4 w-4" />
              Popular Community
            </p>
          </div>
          <div className="space-y-2 p-2">
            {community
              .sort((a, b) => b._count.follows - a._count.follows)
              .map((c) => (
                <Link
                  href={`c/${c.name.toLowerCase()}`}
                  className="flex items-center justify-between rounded-sm p-2 hover:bg-black/10"
                >
                  <p>c/{c.name}</p>
                  <span className="flex items-center text-gray-500">
                    {c._count.follows} <User className="h-4 w-4" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
