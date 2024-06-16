"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const CommunityDelete = ({ communityName }: { communityName: string }) => {
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/community/${communityName}`);
      if (data) {
        toast({
          title: "Deleted!",
          description: "Your community has been deleted.",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog key={'confirm-delete'}>
      <AlertDialogTrigger className="text-left w-full rounded-md p-1 text-destructive transition-colors hover:bg-foreground/10">
      Xoá
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
          Xoá cộng đồng
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
        Bạn có chắc chắn muốn xoá cộng đồng này không?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={buttonVariants({ variant: "destructive" })}
          >
            Xoá
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommunityDelete;
