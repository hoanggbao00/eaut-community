import { EarthIcon, FilePen } from "lucide-react";
import Link from "next/link";

interface SearchResultProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  data: any[] | undefined;
}

const SearchResult: React.FC<SearchResultProps> = ({ heading, data }) => {
  const type = data && data[0]?.name ? "community" : "post";

  return (
    data && (
      <div className="">
        <p className="text-sm font-medium text-gray-500">
          {heading} — <span className="text-xs">{data.length} results</span>
        </p>
        <div className="mt-1 space-y-2">
          {data.map((item) => (
            <Link
              href={`/c/${item.name || item.community?.name}${
                type === "post" ? "/post/" + item.id : ''
              }`}
              key={item.id}
              className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-foreground/20"
            >
              {type === "community" ? <EarthIcon /> : <FilePen />}
              <p>{type === "community" ? `c/${item.name}` : `${item.title}`}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default SearchResult;
