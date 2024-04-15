"use client";

import { useState } from "react";
import CoverAndPicture from "./cover-and-picture";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CommunityValidator,
  CreateCommunityPayload,
} from "@/lib/validators/community";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TextareaAutoSize from "react-textarea-autosize";
import { storage } from "@/lib/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "@/hooks/use-toast";
import { Loader2, MinusCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { Category, Community } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { STATUS_CODE } from "@/lib/constants";
import { Rules } from "@/types/db";
import { uploadImage } from "@/lib/utils";

const CreateForm = ({
  community,
  categories,
}: {
  community?: Community;
  categories: Category[] | null;
}) => {
  const [isLoading, setLoading] = useState(false);
  const [cover, setCover] = useState<File>();
  const [image, setImage] = useState<File>();

  const editValue = community && {
    name: community.name,
    description: community.description || "",
    categoryId: community.categoryId || "",
    cover: community.cover,
    picture: community.image,
    rules: (community.rules as Rules[]) || [],
  };

  const form = useForm<CreateCommunityPayload>({
    resolver: zodResolver(CommunityValidator),
    defaultValues: editValue
      ? editValue
      : {
          name: "",
          description: "",
          cover: null,
          image: null,
          rules: [],
        },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "rules",
    control: form.control,
  });

  const onSubmit = async ({
    name,
    description,
    categoryId,
    rules,
  }: CreateCommunityPayload) => {
    setLoading(true);
    try {
      const coverUrl = cover && (await uploadImage(cover));
      const imageUrl = image && (await uploadImage(image));

      const payload = {
        name,
        description,
        ...(cover && { cover: coverUrl }),
        ...(image && { image: imageUrl }),
        categoryId,
        rules,
      };

      await axios.post("/api/community", payload);

      toast({
        title: `Request to ${
          community ? "Update" : "Create"
        } ${name} has sent!`,
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === STATUS_CODE.DUPLICATE) {
          return toast({
            title: `Failed to create community !`,
            description: `Already exist community named ${name}`,
            variant: "destructive",
          });
        }

        if (error.response?.status === STATUS_CODE.UNAUTHORIZED) {
          return toast({
            title: `Failed to create community !`,
            description: `Please sign in to before continue.`,
            variant: "destructive",
          });
        }
      }

      return toast({
        title: `Something went wrong.`,
        description: `Please try again later!`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <CoverAndPicture
        cover={{ file: cover, setCover: setCover }}
        image={{ file: image, setImage: setImage }}
        initImage={
          community && { cover: community.cover, picture: community.image }
        }
      />

      {/* inputs form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          id="community-form"
        >
          {/* Community Name */}
          {!community ? (
            <FormField
              disabled={!!community}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormDescription>
                    Community names including capitalization cannot be changed.
                  </FormDescription>
                  <div className="relative">
                    <p className="absolute inset-y-0 left-0 z-[1] flex w-8 items-center justify-center text-sm text-zinc-400">
                      c/
                    </p>
                    <FormControl className="relative">
                      <Input
                        {...field}
                        placeholder="Community Name"
                        className="pl-6"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <Input value={`c/${community.name}`} disabled />
          )}
          {/* Community Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl className="relative">
                  {/* @ts-ignore for ignore field null value and onchange*/}
                  <Textarea
                    className="mt-2 resize-none"
                    placeholder="Community description. You can add or change this later"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Categories */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormDescription>Filter your community</FormDescription>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={community?.categoryId || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Community Rules */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium leading-none">
                Community Rules
              </h2>
              <p className="text-sm text-muted-foreground">
                Add rules to your community
              </p>
            </div>
            {fields.map((field, index) => (
              <div className="space-y-2" key={`rule-${field.id}`}>
                <FormField
                  control={form.control}
                  name={`rules.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <div>
                        <div className="flex items-center gap-2">
                          <MinusCircle
                            size={16}
                            onClick={() => remove(index)}
                            className={
                              index === 0
                                ? "sr-only"
                                : "cursor-pointer text-foreground hover:text-muted-foreground"
                            }
                          />
                          <FormLabel className="">Rule {index + 1}</FormLabel>
                        </div>
                        <FormMessage />
                      </div>
                      <FormControl>
                        {/* @ts-ignore for ignore field null value and onchange*/}
                        <Input {...field} placeholder={`Rule title`} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`rules.${index}.detail`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {/* @ts-ignore for ignore field null value and onchange*/}
                        <TextareaAutoSize
                          {...field}
                          placeholder="Detail about this rule"
                          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: "", detail: "" })}
            >
              Add Rule
            </Button>
          </div>
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateForm;
