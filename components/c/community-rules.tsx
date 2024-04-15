import { Rules } from "@/types/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const CommunityRules = ({ rules }: { rules: Rules[] }) => {
  return (
    <Accordion
      type="multiple"
      className="max-h-[80dvh] space-y-1 overflow-auto px-1"
    >
      {rules.map((rule, index) => (
        <AccordionItem
          key={`rule-${index}`}
          value={`rule-${index}`}
          className="border-b-0 text-gray-500"
        >
          <AccordionTrigger className="rounded-sm px-3 py-1.5 font-normal hover:bg-black/5 hover:no-underline">
            <p>
              <span className="inline-block w-7 text-left">{index + 1}</span>{" "}
              {rule.title}
            </p>
          </AccordionTrigger>
          <AccordionContent className="pl-8 lg:max-w-72">
            {rule.detail ? rule.detail : rule.title}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CommunityRules;
