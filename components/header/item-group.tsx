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
import Image from "next/image";

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
              <Image src={category.icon} width="24" height="24" alt="icon" />
              {category.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {category.Community.map((c) => (
              <MenuItem
                key={c.id}
                iconHref={c.image}
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
      <MenuItem iconHref={`/${category.icon}`} text={category.title} />
    </CollapsibleContent>
  );
};
export default ItemGroup;
