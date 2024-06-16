import Image from "next/image";
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
        <p className="text-sm text-muted-foreground">
          {heading} — <span className="text-xs">{data.length} kết quả</span>
        </p>
        <div className="mt-1 space-y-2">
          {data.map((item) => (
            <Link
              href={`/c/${item.name || item.community?.name}${
                type === "post" ? "/post/" + item.id : ""
              }`}
              key={item.id}
              className="flex items-center gap-2 rounded-md p-2 py-1 transition-colors hover:bg-foreground/20"
            >
              {type === "community" && (
                <Image
                  src={item.image}
                  width={24}
                  height={24}
                  alt={item.name}
                />
              )}
              <p>
                {type === "community" ? (
                  `c/${item.name}`
                ) : (
                  <>
                    <b>{`c/${item.community.name} • `}</b>
                    {item.title}{" "}
                  </>
                )}
              </p>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default SearchResult;
