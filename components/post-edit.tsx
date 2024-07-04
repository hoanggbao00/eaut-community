"use client";
import { JsonValue } from "@prisma/client/runtime/library";
import { JSONContent } from "@tiptap/react";
import TextareaAutoSize from "react-textarea-autosize";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import NovelEditor from "./editor/novel-editor";
import Image from "next/image";
import { Input } from "./ui/input";
import { checkYoutubeUrl, compressImage, uploadImage } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import YoutubeEmbed from "./youtube-embed";

interface PostEditProps {
  postId: string;
  postContent: JsonValue;
  postTitle: string;
  communityName: string;
  attachmentUrl: string | null;
}

const PostEdit: React.FC<PostEditProps> = ({
  postId,
  postContent,
  postTitle,
  communityName,
  attachmentUrl,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(postTitle);
  const [content, setContent] = useState<JSONContent | undefined>(
    postContent as JSONContent,
  );
  const [attachment, setAttachment] = useState<File | undefined>();
  const [preview, setPreview] = useState(attachmentUrl);
  const [youtubeUrl, setYouTubeUrl] = useState("");
  const [isYoutubeValid, setYoutubeValid] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const pathname = usePathname()

  const handleYoutube = () => {
    const isValid = checkYoutubeUrl(youtubeUrl);

    if (!isValid)
      return toast({
        title: "Invalid YouTube URL",
        variant: "destructive",
      });

    setPreview(youtubeUrl);
    setYoutubeValid(true);
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      //check if user has upload new attachment
      let _attachment: string | undefined | null = "";
      if (preview !== attachmentUrl) {
        if (attachment) {
          _attachment = await uploadImage(attachment);
        } else {
          _attachment = "";
        }
      }

      const isContentEdited =
        JSON.stringify(postContent) !== JSON.stringify(content);

      const payload = {
        ...(title !== postTitle && { title: title }),
        ...(isContentEdited && { content: content }),
        ...(attachment && { attachment: _attachment }),
        ...(isYoutubeValid && { attachment: youtubeUrl }),
      };

      if (!title)
        return toast({
          title: "Title cannot be empty",
          variant: "destructive",
        });

      const res = await axios.put(`/api/community/post/${postId}`, payload);
      toast({
        title: "Post updated successfully",
        variant: "success",
      });
      if (res) {
        router.push(pathname);
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      return toast({
        title: "Something went wrong.",
        description: "Post wasn't updated successfully. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="rounded-md">
        <CardContent className="p-3 pt-4">
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
        <CardFooter className="justify-end p-3 pt-0 gap-2">
          <Button variant='outline' onClick={() => router.push(pathname)}>Close</Button>
          <Button onClick={handleEdit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-5 animate-spin" />}
            Update
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-4">
        {!preview && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="">
              <label htmlFor="attachment" className="font-medium">
                Attachment
              </label>
              <Input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={async (e) => {
                  const resizeImage = await compressImage(e.target.files![0], {
                    quality: 0.8,
                    type: "image/webp",
                  });
                  const previewUrl = URL.createObjectURL(resizeImage);
                  setPreview(previewUrl);
                  setAttachment(resizeImage);
                }}
              />
            </div>
            <div className="">
              <label htmlFor="youtube-url" className="block font-medium">
                Youtube Url
              </label>
              <div className="relative inline-block pr-14">
                <Input
                  value={youtubeUrl}
                  id="youtube-url"
                  type="url"
                  placeholder="Youtube url"
                  className="inline-block w-full pr-14"
                  onChange={(e) => setYouTubeUrl(e.target.value)}
                />
                <Button
                  disabled={!!!youtubeUrl}
                  size="sm"
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 p-1"
                  onClick={() => handleYoutube()}
                >
                  Check
                </Button>
              </div>
              {youtubeUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-1 p-1"
                  onClick={() => {
                    setPreview(null);
                    setAttachment(undefined);
                    setYouTubeUrl("");
                    setYoutubeValid(false);
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        )}
        {preview && (
          <div className="relative h-[300px] w-full">
            {checkYoutubeUrl(preview) ? (
              <YoutubeEmbed src={preview} />
            ) : (
              <Image
                src={preview}
                alt="post-attachment"
                className="rounded-md object-cover"
                fill
              />
            )}
            <button
              onClick={() => {
                setPreview(null);
                setAttachment(undefined);
              }}
              className="absolute -right-2 -top-2 grid cursor-pointer place-items-center rounded-full bg-background shadow-lg hover:bg-foreground/30 hover:text-background"
            >
              <X />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PostEdit;
