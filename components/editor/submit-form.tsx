"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutoSize from "react-textarea-autosize";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import NovelEditor from "./novel-editor";

type FormData = z.infer<typeof PostValidator>;

interface SubmitFormProps {
  communities: ({ community: Community } & Follow)[];
}

export const SubmitForm: React.FC<SubmitFormProps> = ({ communities }) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      communityId: "",
      content: null,
    },
  });

  const createPost = async (payload: PostCreationRequest) => {
    setLoading(true);
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        return window.localStorage.removeItem("novel-content");
      }
    } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  async function onSubmit({ title, content, communityId }: FormData) {
    if (
      JSON.stringify(content) ===
      JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] })
    )
      return toast({
        title: "Something went wrong.",
        description: "Content could not be empty",
        variant: "destructive",
      }); //Check if no content

    const payload: PostCreationRequest = {
      title: title,
      content: content,
      communityId: communityId,
    };

    createPost(payload);
  }

  return (
    <div className="size-full">
      <Form {...form}>
        <form
          id="community-post-form"
          className="w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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

          {/* content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <NovelEditor
                  onChange={(event) => {
                    field.onChange(event);
                  }}
                />
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
            <FormField
              control={form.control}
              name="communityId"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Community" />
                        </SelectTrigger>
                        <SelectGroup>
                          <SelectContent className="z-[100]" align="end">
                            <SelectLabel>Followed Community</SelectLabel>
                            <SelectSeparator />
                            {communities.map((c) => (
                              <SelectItem
                                key={c.community.id}
                                value={c.community.id}
                              >
                                c/{c.community.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectGroup>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
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
        </form>
      </Form>
    </div>
  );
};
