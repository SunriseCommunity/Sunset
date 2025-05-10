"use client";

import { socialIcons } from "@/app/user/[id]/components/UserSocials";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEditUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import { useUsernameChange } from "@/lib/hooks/api/user/useUsernameChange";
import { UserMetadataResponse, UserPlaystyle } from "@/lib/types/api";
import { zEditUserMetadataRequest } from "@/lib/types/api/zod.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = zEditUserMetadataRequest;

export default function ChangeSocialsForm({
  metadata,
}: {
  metadata: UserMetadataResponse;
}) {
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const { trigger } = useEditUserMetadata();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...metadata,
    },
  });

  const showError = (message: string) => {
    setError(message);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    trigger(
      {
        ...values,
        playstyle: undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: "Socials updated successfully!",
            variant: "success",
          });
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
          toast({
            title: "Error occured while updating socials!",
            description: err.message ?? "Unknown error.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="flex flex-col lg:w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-xl font-medium">General</h3>

          {Object.keys(formSchema.shape)
            .filter((v) => ["location", "interest", "occupation"].includes(v))
            .map((v) => {
              return (
                <FormField
                  control={form.control}
                  name={v as any}
                  key={v}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize flex gap-2">
                        {socialIcons[v as keyof UserMetadataResponse]}
                        <p>{v}</p>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}

          <div>
            <hr className="my-6" />
          </div>

          <h3 className="text-xl font-medium">Socials</h3>

          {Object.keys(formSchema.shape)
            .filter(
              (v) =>
                !["location", "interest", "occupation", "playstyle"].includes(v)
            )
            .map((v) => {
              return (
                <FormField
                  control={form.control}
                  name={v as any}
                  key={v}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize flex gap-2">
                        {socialIcons[v as keyof UserMetadataResponse]}
                        <p>{v}</p>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}

          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit">Update socials</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
