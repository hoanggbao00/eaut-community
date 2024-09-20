import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface MenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  iconHref?: string | null;
  text: string;
  href?: string;
  className?: string;
  status?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconHref,
  text,
  href = "#",
  className,
  status,
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
        className={cn("mr-1", {
          "flex items-center": icon,
        })}
      >
        {iconHref && (
          <Image src={`${iconHref}.svg`} alt={"img"} width={28} height={28} className="rounded-full"/>
        )}
        {icon && icon}
      </div>

      <div>
        <p>{text}</p>
        {status === false && (
          <Badge className="bg-yellow-200 text-yellow-900 hover:bg-yellow-300/80">
            Chờ duyệt
          </Badge>
        )}
      </div>
    </Link>
  );
};

export default MenuItem;
