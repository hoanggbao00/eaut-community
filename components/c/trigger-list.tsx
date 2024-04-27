"use client";
import { usePathname, useRouter } from "next/navigation";
import { TabsTrigger } from "../ui/tabs";

const TriggerList = ({ isPermission }: { isPermission: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleTrigger = (value: string) => {
    router.replace(`${pathname}?tab=${value}`)
  };

  return (
    <>
      <TabsTrigger value="feed" onClick={() => handleTrigger("feed")}>
        Feed
      </TabsTrigger>
      <TabsTrigger
        value="about"
        onClick={() => handleTrigger("about")}
        className="lg:hidden"
      >
        About
      </TabsTrigger>
      {isPermission && (
        <TabsTrigger onClick={() => handleTrigger("followers")} value="followers">
          Followers
        </TabsTrigger>
      )}
      <TabsTrigger value="moderators" onClick={() => handleTrigger("moderators")}>
        Moderators
      </TabsTrigger>
    </>
  );
};

export default TriggerList;
