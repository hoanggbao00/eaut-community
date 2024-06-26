import BackRoute from "@/components/shared/back-route";
import { SubmitForm } from "@/components/editor/submit-form";
import { toast } from "@/hooks/use-toast";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getAuthSession();

  if (!session) return redirect("/sign-in");

  const followedCommunities = await prisma.follow.findMany({
    where: {
      ...(session && { userId: session.user.id }),
    },
    include: {
      community: true,
    },
  });

  if (!followedCommunities)
    return toast({
      title: "Something went wrong",
      description: "You not join any community",
      variant: "destructive",
    });

  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center">
          <BackRoute />
          <h3 className="text-lg font-semibold text-muted-foreground">Tạo bài viết</h3>
        </div>
      </div>

      {/* form */}
      <SubmitForm communities={followedCommunities} />
    </div>
  );
};

export default page;
