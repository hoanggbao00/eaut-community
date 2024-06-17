import RequestItem from "@/components/admin/request/request-item";
import RefreshButton from "@/components/shared/refresh-button";
import { TooltipProvider } from "@/components/ui/tooltip";
import prisma from "@/lib/db/prisma";

const page = async () => {
  const request = await prisma.request.findMany({
    where: {
      sendTo: "ADMIN",
    },
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20
  });

  return (
    <TooltipProvider>
      <div className="mb-1 flex items-center justify-end">
        <RefreshButton />
      </div>
      <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2 md:grid-cols-3">
        {request.length !== 0 ? (
          request.map((r) => (
            <RequestItem
              key={r.id}
              request={r}
              user={r.user}
              community={r.community}
            />
          ))
        ) : (
          <p>Không có gì để hiển thị</p>
        )}
      </div>
    </TooltipProvider>
  );
};

export default page;
