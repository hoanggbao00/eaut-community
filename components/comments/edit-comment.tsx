"use client";
import TextareaAutoSize from "react-textarea-autosize";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface EditCommentProps {
  commentId: string;
  router: AppRouterInstance;
  editContent: string;
  oldComment: string;
  setEditContent: (value: string) => void;
  setEdit: (value: boolean) => void;
}

const EditComment: React.FC<EditCommentProps> = ({
  editContent,
  setEditContent,
  oldComment,
  router,
  commentId,
  setEdit,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { oldContent: oldComment, content: editContent };

    try {
      await axios.put(`/api/community/post/comment/${commentId}`, payload);

      toast({
        title: "Comment updated successfully",
        variant: "success",
      });
      setEdit(false);
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Comment wasn't updated successfully. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div>
      <TextareaAutoSize
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        placeholder={oldComment}
        className="w-full resize-none rounded-md border p-2"
      />
      <div className="mt-1 flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setEdit(false)}>
          Cancel
        </Button>
        <Button disabled={loading} size="sm" onClick={handleSubmit}>
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EditComment;
