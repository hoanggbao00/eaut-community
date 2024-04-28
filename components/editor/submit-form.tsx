"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutoSize from "react-textarea-autosize";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { CreatePostPayload, PostValidator } from "@/lib/validators/post";
import axios from "axios";
import { Community, Follow } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import NovelEditor from "./novel-editor";
import CommunityInfo from "../c/info/community-info";
import Image from "next/image";
import { uploadImage } from "@/lib/utils";
import YoutubeEmbed from "../youtube-embed";
import CommunitySelect from "./submit-form/community-select";
import AttachmentButton from "./submit-form/attachment-button";

type FormData = z.infer<typeof PostValidator>;

interface SubmitFormProps {
  communities: ({ community: Community } & Follow)[];
}

export const SubmitForm: React.FC<SubmitFormProps> = ({ communities }) => {
  const [isLoading, setLoading] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [attachment, setAttachment] = useState<File>();
  const [preview, setPreview] = useState("");
  const [youtubeUrl, setYouTubeUrl] = useState("");
  const [isYoutubeValid, setYoutubeValid] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      communityId: "",
      content: null,
    },
  });

  const createPost = async (payload: CreatePostPayload) => {
    try {
      const data = await axios.post("/api/community/post/create", payload);
      if (data) {
        toast({
          description: "Your post has been published.",
        });
        const communityName = communities.find(
          (c) => c.community.id === payload.communityId,
        )?.community.name;
        router.push(`/c/${communityName}`);

        return window.localStorage.removeItem("novel-content");
      }
    } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle form submit
  async function onSubmit({ title, content, communityId }: FormData) {
    setLoading(true);

    const attachmentUrl = attachment && (await uploadImage(attachment));
    if (attachment && !attachmentUrl) {
      toast({
        title: "Failed to upload image",
        variant: "warning",
      });
    }

    const payload = {
      title: title,
      content: content,
      communityId: communityId,
      ...(attachment && { attachment: attachmentUrl }),
      ...(isYoutubeValid && { attachment: youtubeUrl }),
    };

    createPost(payload);
    setLoading(false);
  }

  return (
    <div className="size-full lg:flex lg:gap-2">
      <Form {...form}>
        <form
          id="community-post-form"
          className="w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <AttachmentButton
            youtubeUrl={youtubeUrl}
            setYouTubeUrl={setYouTubeUrl}
            setYoutubeValid={setYoutubeValid}
            isYoutubeValid={isYoutubeValid}
            setAttachment={setAttachment}
            setPreview={setPreview}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <TextareaAutoSize
                    {...field}
                    placeholder="Title"
                    className="w-full resize-none rounded-md border border-input px-2 py-2 text-2xl font-bold focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {preview && (
            <div className="relative my-2 aspect-video w-full">
              <Image
                src={preview}
                fill
                alt="preview"
                className="rounded-md object-cover"
              />
              <div className="absolute -right-1.5 -top-2 grid cursor-pointer place-items-center rounded-full bg-background shadow-lg hover:bg-foreground/50 hover:text-background">
                <X
                  size="24"
                  className=""
                  onClick={() => {
                    setPreview("");
                    setAttachment(undefined);
                  }}
                />
              </div>
            </div>
          )}

          {/* content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <NovelEditor onChange={(event) => field.onChange(event)} />
              </FormItem>
            )}
          />

          <div className="mt-2 flex items-center justify-end md:justify-between">
            <p className="mt-2 hidden text-sm text-gray-500 md:block">
              Use
              <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                /
              </kbd>
              to open the command menu.
            </p>

            {/* Select community */}
            <CommunitySelect
              form={form.control}
              communities={communities}
              setCommunityName={setCommunityName}
            />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="mt-3 w-full !bg-primary hover:!bg-primary/70"
            form="community-post-form"
            variant="default"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
          </Button>
          {isYoutubeValid && (
            <div className="my-2">
              <YoutubeEmbed src={youtubeUrl} />
            </div>
          )}
        </form>
      </Form>
      {communityName && (
        <div className="hidden lg:block">
          <CommunityInfo communityName={communityName} />
        </div>
      )}
    </div>
  );
};
