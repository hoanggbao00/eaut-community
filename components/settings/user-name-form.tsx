"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn, uploadImage } from "@/lib/utils";
import { ProfileValidator } from "@/lib/validators/username";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import ChangeProfileImage from "./change-profile-image";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username" | "name" | "image">;
}

type FormData = z.infer<typeof ProfileValidator>;

export const UserNameForm = ({
  user,
  className,
  ...props
}: UserNameFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | undefined>();

  const form = useForm<FormData>({
    resolver: zodResolver(ProfileValidator),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      image: user?.image || "",
    },
  });

  const handleUpdate = async (data: FormData) => {
    setLoading(true);
    try {
      const imageUrl = image && (await uploadImage(image));
      const payload: FormData = {
        ...data,
        ...(imageUrl && { image: imageUrl }),
      };

      await axios.put(`/api/user/`, payload);

      toast({
        description: "Your info has been updated.",
      });
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose another username.",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <ChangeProfileImage
        initImage={user.image}
        image={{ file: image, setImage: setImage }}
        userName={user.username}
      />
      <form
        className={cn("space-y-3", className)}
        onSubmit={form.handleSubmit(handleUpdate)}
        {...props}
      >
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormDescription>Enter your name</FormDescription>

              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Username</FormLabel>
              <FormDescription>
                Please enter a display name you are comfortable with.
              </FormDescription>
              <div className="relative grid gap-1">
                <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
                  <span className="text-sm text-zinc-400">u/</span>
                </div>
                <FormControl>
                  <Input {...field} placeholder="username" className="pl-6" />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <Button disabled={loading} className="">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Change name
        </Button>
      </form>
    </Form>
  );
};
