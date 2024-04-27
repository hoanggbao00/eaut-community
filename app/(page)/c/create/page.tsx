import { Separator } from "@/components/ui/separator";
import CreateForm from "@/components/c/create/community-create-form";
import BackRoute from "@/components/shared/back-route";
import prisma from "@/lib/db/prisma";

const Page = async () => {
  const categories = await prisma.category.findMany();

  return (
    <div className="mx-auto flex h-full max-w-3xl items-center">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a Community</h1>
          <div>
            <BackRoute className="mr-2 inline-block w-fit" />
          </div>
        </div>
        <Separator className="my-4" />
        {/* Inputs form */}
        <CreateForm categories={categories} />
      </div>
    </div>
  );
};

export default Page;
