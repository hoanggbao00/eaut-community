import { CollapsibleContent } from "@/components/ui/collapsible";
import { Category, Community } from "@prisma/client";
import MenuItem from "./menu-item";
import { Play } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icons } from "@/components/icons";

const ItemGroup = ({
  category,
}: {
  category: Category & { Community?: Community[] };
}) => {
  return category.Community ? (
    <CollapsibleContent className="">
      <Accordion type="single" collapsible>
        <AccordionItem value={category.title}>
          <AccordionTrigger className="w-full gap-2 rounded-sm p-2 px-3 hover:bg-foreground/10">
            <span className="flex items-center gap-2 text-gray-700">
              {Icons.getIcon(slugify(category.title), "h-5 w-5")}
              {category.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {category.Community.map((c) => (
              <MenuItem
                key={c.id}
                iconHref={c.picture}
                text={c.name}
                href={`/c/${c.name}`}
                className="ml-6 rounded-none rounded-r-md border-l-2 px-0 pl-1 hover:border-gray-500"
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CollapsibleContent>
  ) : (
    <CollapsibleContent>
      <MenuItem icon={<Play />} text={category.title} href="" />
    </CollapsibleContent>
  );
};

function slugify(s: string) {
  if (!s) return "";

  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
}

export default ItemGroup;
