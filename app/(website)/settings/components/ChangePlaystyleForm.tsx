"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function ChangePlaystyleForm({
  metadata,
}: {
  metadata: UserMetadataResponse;
}) {
  const [error, setError] = useState<string | null>(null);

  const [playstyle, setPlaystyle] = useState<UserPlaystyle[]>(
    metadata.playstyle
  );

  const { toast } = useToast();

  const { trigger } = useEditUserMetadata();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...metadata,
    },
  });

  const handleCheckboxChange = (checked: boolean, value: UserPlaystyle) => {
    setPlaystyle((prev) =>
      checked ? [...prev, value] : prev.filter((p) => p !== value)
    );
  };
  const showError = (message: string) => {
    setError(message);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    trigger(
      {
        playstyle,
      },
      {
        onSuccess: () => {
          toast({
            title: "Playstyle updated successfully!",
            variant: "success",
          });
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
          toast({
            title: "Error occured while updating playstyle!",
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-2 flex sm:flex-row flex-col"
        >
          <FormField
            control={form.control}
            name={"playstyle"}
            render={({ field }) => (
              <>
                {Object.values(UserPlaystyle)
                  .filter((v) => v != UserPlaystyle.NONE)
                  .map((value) => {
                    return (
                      <CardContent
                        className="p-2 rounded-lg flex-grow"
                        key={value}
                      >
                        <FormItem key={value}>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={playstyle.includes(value)}
                                onCheckedChange={(v) =>
                                  handleCheckboxChange(!!v, value)
                                }
                                type="submit"
                              />
                              <label
                                htmlFor={field.name}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {value}
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </CardContent>
                    );
                  })}
              </>
            )}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </Form>
    </div>
  );
}
