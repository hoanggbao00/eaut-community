import BackRoute from "@/components/back-route";
import CreateForm from "@/components/c/create/community-create-form";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Community",
  description: "EAUT Community | Edit community information.",
};

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const session = await getAuthSession();

  const data = await prisma.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      moderators: {
        where: {
          userId: session?.user.id,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  if (!data) return redirect("./");

  const permission =
    session?.user.role === "ADMIN" ||
    session?.user.id === data.creatorId ||
    Boolean(data.moderators.length > 0);

  if (!permission) return redirect("./");

  const categories = await prisma.category.findMany({
    select: {
      title: true,
      id: true,
    },
  });

  return (
    <div className="sm:container">
      <BackRoute className="w-fit" />

      <h1 className="mb-2 text-xl">
        Edit <b className="text-2xl">c/{data.name}</b>
      </h1>

      <div>
        <CreateForm community={data} categories={categories} />
      </div>
    </div>
  );
};

export default page;
