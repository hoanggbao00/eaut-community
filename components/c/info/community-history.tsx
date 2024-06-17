//@ts-nocheck
"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateHistory } from "@prisma/client";
import { formatDate } from "date-fns";
import { ArrowRight } from "lucide-react";

const CommunityHistory = ({ history }: { history: UpdateHistory[] }) => {
  return (
    <Dialog key={'history-dialog'}>
      <DialogTrigger className="w-full p-1 text-left hover:bg-foreground/10">
        Lịch sử chỉnh sửa
      </DialogTrigger>
      <DialogContent className="gap-2 bg-background p-2">
        <DialogHeader className="text-lg font-medium">
          Lịch sử chỉnh sửa
        </DialogHeader>
        <div className="max-h-[70dvh] space-y-3 overflow-auto">
          {history.map((h) => {
            const keys = Object.keys(h.newContent as Object);

            return (
              <div key={`history#${h.id}`} className="p-2 rounded-md border-2">
                <p className="text-xs text-muted-foreground">
                  <span className="text-sky-500/60">#{h.id}</span> •{" "}
                  {formatDate(h.createdAt, "MMM dd, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cập nhật: {h.updatedBy}
                </p>
                <p className="mt-1 border-t-2 text-xs">Thay đổi: </p>
                <div className="space-y-1">
                  {keys.map((key, index) => {
                    if (key === "rules") {
                      return (
                        <div className="text-sm" key={`${h.id}#${key}`}>
                          <p>Điều luật: </p>
                          {h.newContent.rules.map((rule, index) => (
                            <div key={"rule"+h.id + index} className="pl-3">
                              <p className="space-x-1">
                                <span>
                                  {!h.oldContent.rules[index] && "Thêm "}
                                  {index + 1}:
                                </span>
                                <span className="text-muted-foreground line-through">
                                  {h.oldContent.rules[index] &&
                                    h.oldContent.rules[index].title}
                                </span>
                                {h.oldContent.rules[index] && (
                                  <ArrowRight
                                    size="12"
                                    className="mx-1 inline-block"
                                  />
                                )}
                                <span className="">{rule.title}</span>
                              </p>
                              {rule.detail && (
                                <p className="space-x-1 pl-2">
                                  <span>Chi tiết:</span>
                                  <span className="text-muted-foreground line-through">
                                    {h.oldContent.rules[index] &&
                                      h.oldContent.rules[index].detail}
                                  </span>
                                  {h.oldContent.rules[index] && (
                                    <ArrowRight
                                      size="12"
                                      className="mx-1 inline-block"
                                    />
                                  )}
                                  <span>{rule.detail}</span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <p className="line-clamp-3 text-sm" key={h.id + index}>
                        <span className="first-letter::uppercase">{key}: </span>
                        <span className="text-muted-foreground line-through">
                          {h.oldContent[key]}
                        </span>
                        {h.oldContent[key] !== '' && <ArrowRight size="12" className="mx-1 inline-block" /> }
                        <span className="">{h.newContent[key]}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Đóng
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityHistory;
