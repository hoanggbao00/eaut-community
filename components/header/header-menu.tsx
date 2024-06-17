import { AreaChart, ChevronDown, HomeIcon, Menu } from "lucide-react";
import MenuItem from "./menu-item";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Category, Community, Follow } from "@prisma/client";
import ItemGroup from "./item-group";
interface Props {
  followedCommunities: (Follow & { community: Community })[] | undefined;
  categories: (Category & { community?: Community[] })[] | undefined;
}
const HeaderMenu: React.FC<Props> = async ({
  followedCommunities,
  categories,
}) => {
  return (
    <>
      <label
        htmlFor="header-menu"
        className="absolute left-0.5 z-[11] block cursor-pointer rounded-md p-1 hover:bg-foreground/10 xl:hidden"
      >
        <Menu />
      </label>
      <input type="checkbox" className="peer sr-only" id="header-menu" />
      <aside className="fixed inset-0 top-[3.45rem] flex h-full w-0 flex-col gap-2 overflow-y-auto rounded-r-md bg-background shadow-lg transition-all peer-checked:w-64 peer-checked:p-4 dark:border-r xl:w-64 xl:p-4 pb-7">
        <MenuItem
          icon={<HomeIcon color="dodgerblue" />}
          text="Trang chính"
          href="/feed"
        />
        <MenuItem
          icon={<AreaChart color="dodgerblue" />}
          text="Phổ biến"
          href="/"
        />
        <Separator className="my-1" />
        {followedCommunities && (
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 px-3 hover:bg-foreground/20">
              <p className="text-left text-sm text-gray-500">
                CỘNG ĐỒNG CỦA BẠN
              </p>
              <ChevronDown className="text-gray-500" />
            </CollapsibleTrigger>
            {followedCommunities &&
              followedCommunities.map((c) => (
                <CollapsibleContent key={c.id}>
                  <MenuItem
                    text={`c/${c.community.name}`}
                    href={`/c/${c.community.name.toLowerCase()}`}
                    iconHref={c.community.image}
                    className="px-0"
                    status={c.community.isAccessible}
                  />
                </CollapsibleContent>
              ))}
          </Collapsible>
        )}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 px-3 hover:bg-foreground/20">
            <p className="text-left text-sm text-gray-500">DANH MỤC</p>
            <ChevronDown className="text-gray-500" />
          </CollapsibleTrigger>
          {categories &&
            categories.map((c) => <ItemGroup key={c.id} category={c} />)}
        </Collapsible>
      </aside>
    </>
  );
};

export default HeaderMenu;
