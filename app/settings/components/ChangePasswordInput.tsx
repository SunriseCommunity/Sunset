"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePasswordChange } from "@/lib/hooks/api/user/usePasswordChange";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

let password = "";

const formSchema = z.object({
  currentPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(32, {
      message: "Password must be 32 characters or fewer.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(32, {
      message: "Password must be 32 characters or fewer.",
    })
    .refine((value) => {
      password = value;
      return true;
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(32, {
      message: "Password must be 32 characters or fewer.",
    })
    .refine((value) => value === password, "Passwords do not match"),
});

export default function ChangePasswordInput() {
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const { trigger } = usePasswordChange();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const showError = (message: string) => {
    setError(message);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    const { currentPassword, password } = values;

    trigger(
      {
        current_password: currentPassword,
        new_password: password,
      },
      {
        onSuccess: () => {
          form.reset();

          toast({ title: "Password changed successfully!" });
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
          toast({
            title: "Error occured while changing password!",
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
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit">Change password</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
