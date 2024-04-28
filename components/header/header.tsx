import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import ProfileHeader from "./profile-header";
import SearchBar from "./search-bar/search-bar";
import HeaderMenu from "./header-menu";
import HeaderLogo from "./header-logo";
import prisma from "@/lib/db/prisma";
import { ThemeToggle } from "./theme-toggle";
import UserNotifications from "./notifications/user-notifications";

const Header = async () => {
  const session = await getAuthSession();

  const followedCommunities =
    session?.user &&
    (await prisma.follow.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        community: true,
      },
      take: 5
    }));

  const categories = await prisma.category.findMany({
    where: {
      NOT: {
        title: "uncategorized",
      },
    },
    include: {
      community: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <header className="fixed inset-x-0 top-0 z-20 h-fit overflow-visible border-b border-foreground/50 bg-background py-2">
      <div className="flex h-full w-full items-center justify-between gap-2 px-7">
        <HeaderLogo />

        <SearchBar />

        <div className="flex gap-2">
          <ThemeToggle />
          {session ? (
            <>
              <UserNotifications role={session.user.role} />
              <ProfileHeader user={session.user} />
            </>
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign in
            </Link>
          )}
          <HeaderMenu
            categories={categories}
            followedCommunities={followedCommunities}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
