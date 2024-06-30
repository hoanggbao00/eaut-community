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
        Trang chính
      </TabsTrigger>
      <TabsTrigger
        value="about"
        onClick={() => handleTrigger("about")}
        className="lg:hidden"
      >
        Thông tin
      </TabsTrigger>
      {isPermission && (
        <TabsTrigger onClick={() => handleTrigger("followers")} value="followers">
          Thành viên
        </TabsTrigger>
      )}
      <TabsTrigger value="moderators" onClick={() => handleTrigger("moderators")}>
        Kiểm duyệt viên
      </TabsTrigger>
    </>
  );
};

export default TriggerList;
