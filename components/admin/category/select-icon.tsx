import { Button, buttonVariants } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IconList } from "@/lib/icons";
import Image from "next/image";

const SelectIcon = ({
  icon,
  setIcon,
}: {
  icon: string;
  setIcon: (value: string) => void;
}) => {
  return (
    <>
      <PopoverTrigger
        className={buttonVariants({
          variant: "outline",
          size: "icon",
          className: "aspect-square",
        })}
      >
        <Image src={`/${icon}.svg`} height="24" width="24" alt="icon" />
      </PopoverTrigger>
      <PopoverContent className="grid w-[250px] grid-cols-5 gap-2">
        {Object.keys(IconList).map((key) => {
          return (
            <Button
              key={key}
              onClick={() => setIcon(key)}
              className="aspect-square"
              variant="outline"
              size="icon"
            >
              <Image
                //@ts-ignore
                src={`/${key}.svg`}
                height="24"
                width="24"
                alt="icon"
              />
            </Button>
          );
        })}
      </PopoverContent>
    </>
  );
};

export default SelectIcon;
