import { formatDate } from "@/lib/utils";
import { ShowAvatar } from "../shared/show-avatar";
import { Separator } from "../ui/separator";

interface props {
  item: {
    createdDate: Date;
    user: {
      name: string | null;
      username: string | null;
      image: string | null;
      _count: {
        post: number;
        comment: number;
        postVote: number;
        commentVote: number;
      };
    };
  };
}

const FollowerCard = ({ item }: props) => {
  return (
    <div className="rounded-md border bg-background p-2 shadow-md">
      <a
        href={`/user/${item.user.username}`}
        className="flex items-center gap-2 hover:font-medium"
      >
        <ShowAvatar
          data={{
            name: item.user.name,
            image: item.user.image,
          }}
        />
        <div>
          <p>{item.user.name}</p>
          <span className="block text-sm text-muted-foreground">
            u/{item.user.username}
          </span>
        </div>
      </a>
      <time className="text-sm text-muted-foreground">
        Theo dõi ngày: {formatDate(item.createdDate.toISOString())}
      </time>
      <Separator className="my-2" />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <p className="font-medium">Điểm:</p>
        <span>{item.user._count.post} bài viết |</span>
        <span>{item.user._count.comment} bình luận |</span>
        <span>
          {item.user._count.postVote + item.user._count.commentVote} vote
        </span>
      </div>
    </div>
  );
};

export default FollowerCard;
