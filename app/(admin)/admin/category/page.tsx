import AddCategory from "@/components/admin/category/add-category";
import EditCategory from "@/components/admin/category/edit-category";
import { ShowAvatar } from "@/components/shared/show-avatar";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db/prisma";
import { File, User } from "lucide-react";
import Image from "next/image";

const page = async () => {
  const data = await prisma.category.findMany({
    include: {
      community: {
        select: {
          name: true,
          id: true,
          image: true,
          _count: {
            select: {
              followers: true,
              posts: true,
            },
          },
        },
      },
      _count: {
        select: {
          community: true,
        },
      },
    },
    orderBy: {
      title: "desc",
    },
  });

  return (
    <div className="w-full p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Category</h1>
        <AddCategory />
      </div>
      <Separator className="my-2" />
      <div className="space-y-2">
        {data.map((cat) => (
          <div key={cat.id}>
            <div
              key={cat.id}
              className="relative rounded-lg bg-background p-3 shadow-lg"
            >
              <Image
                src={`/${cat.icon}.svg`}
                alt={`${cat.icon}.svg`}
                height={24}
                width={24}
                className="mr-2 inline-block"
              />
              {cat.title}
              <EditCategory data={cat} />
            </div>
            <div className="max-h-[300px] w-full rounded-md bg-background shadow-md">
              {cat.community.map((community) => (
                <div key={community.id} className="flex items-center gap-2 p-2 ml-5 hover:bg-foreground/5 border-l-2">
                  <ShowAvatar
                    className="size-6"
                    data={{
                      image: community.image,
                      name: community.name,
                    }}
                  />
                  <a href={`c/${community.name}`} className="hover:underline">
                    c/{community.name}
                  </a>
                  •
                  <span className="flex items-center text-sm text-muted-foreground">
                    {community._count.followers}
                    <User size="14" className="inline-block" />
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    {community._count.posts}
                    <File size="14" className="inline-block" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
