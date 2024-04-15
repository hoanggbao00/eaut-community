"use client";
import { JsonValue } from "@prisma/client/runtime/library";
import { JSONContent } from "@tiptap/react";
import TextareaAutoSize from "react-textarea-autosize";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import NovelEditor from "./editor/novel-editor";

interface PostEditProps {
  postId: string;
  postContent: JsonValue;
  postTitle: string;
  communityName: string;
}

const PostEdit: React.FC<PostEditProps> = ({
  postId,
  postContent,
  postTitle,
  communityName,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(postTitle);
  const [content, setContent] = useState<JSONContent | undefined>(
    postContent as JSONContent,
  );

  const handleEdit = async () => {
    const payload = {
      title,
      content,
    };

    if (!title)
      return toast({
        title: "Title cannot be empty",
        variant: "destructive",
      });

    try {
      const res = await axios.put(`/api/community/post/${postId}`, payload);
      toast({
        title: "Post updated successfully",
        variant: "success",
      });
      if (res) {
        router.push(`/c/${communityName}`);
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      return toast({
        title: "Something went wrong.",
        description: "Post wasn't updated successfully. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gray-200">
      <CardContent className="pt-4">
        <TextareaAutoSize
          placeholder="Title"
          className="mb-2 w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <NovelEditor
          onChange={setContent}
          initContent={postContent as JSONContent}
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleEdit}>Update</Button>
      </CardFooter>
    </Card>
  );
};

export default PostEdit;
