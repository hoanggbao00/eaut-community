import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface MenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  iconHref?: string | null;
  text: string;
  href: string;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconHref,
  text,
  href,
  className,
  ...props
}) => {
  return (
    <Link
      className={cn(
        "flex items-center gap-2 rounded-md p-2 px-3 hover:bg-foreground/20",
        className,
      )}
      href={href}
      {...props}
    >
      <div
        className={cn("relative mr-1 h-[30px] w-[30px]", {
          "flex items-center": icon,
        })}
      >
        {iconHref && (
          <Image
            src={iconHref}
            alt={'img'}
            fill
            className="rounded-full object-cover"
          />
        )}
        {icon && icon}
      </div>

      <span>{text}</span>
    </Link>
  );
};

export default MenuItem;
