"use client";

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
import { useUsernameChange } from "@/lib/hooks/api/user/useUsernameChange";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  newUsername: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(32, {
      message: "Username must be 32 characters or fewer.",
    }),
});

export default function ChangeUsernameInput() {
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const { trigger } = useUsernameChange();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newUsername: "",
    },
  });

  const showError = (message: string) => {
    setError(message);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    const { newUsername } = values;

    trigger(
      {
        new_username: newUsername,
      },
      {
        onSuccess: () => {
          form.reset();

          toast({ title: "Username changed successfully!" });
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
          toast({
            title: "Error occured while changing username!",
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="newUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Username</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit">Change username</Button>
          </DialogFooter>
        </form>
      </Form>
      <label className="text-xs mt-2">
        * Reminder: Please keep your username family friendly, or it will be
        changed for you. Abusing this feature will result in a ban.
      </label>
    </div>
  );
}
