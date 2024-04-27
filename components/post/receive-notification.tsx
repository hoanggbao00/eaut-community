"use client";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Bell, BellOff } from "lucide-react";
import { useRouter } from "next/navigation";

const ReceiveNotification = ({
  notifierIds,
  userId,
  postId,
}: {
  notifierIds: string[];
  userId: string;
  postId: string;
}) => {
  const isReceiveNotification = Boolean(notifierIds.find((id) => userId));
  const router = useRouter()

  const handleClick = async () => {
    try {
      const payload = {
        notifierIds: isReceiveNotification
          ? notifierIds.filter((id) => id !== userId)
          : [...notifierIds, userId],
      };

      await axios.put(`/api/community/post/${postId}/notifier`, payload);
      toast({
        title: `You now will ${isReceiveNotification ? "not receive" : "receive"} notifications for this post`,
      });
      router.refresh()
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute right-7 top-0 size-fit">
      <button
        className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs hover:bg-foreground/20"
        onClick={handleClick}
      >
        {isReceiveNotification ? (
          <BellOff size="14" className="text-red-500" />
        ) : (
          <Bell size="14" />
        )}
        Turn {isReceiveNotification ? "off" : "on"} Notification
      </button>
    </div>
  );
};

export default ReceiveNotification;
