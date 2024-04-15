import RequestItem from "@/components/admin/request/request-item";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

const page = async () => {
  const session = await getAuthSession();
  if (!session) return redirect("/");
  if (session.user.role !== UserRole.ADMIN) return notFound();

  const request = await prisma.requestCommunity.findMany({
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          status: true
        },
      },
      updateBy: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {request.length !== 0
          ? request.map((r) => <RequestItem request={r} user={r.user} />)
          : <p>Nothing to show</p>}
      </div>
    </TooltipProvider>
  );
};

export default page;
