"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useAdminPasswordChange } from "@/lib/hooks/api/user/useAdminUserEdit";
import type { UserSensitiveResponse } from "@/lib/types/api";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be 32 characters or fewer.",
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be 32 characters or fewer.",
      }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AdminUserResetPassword({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { trigger: changePassword, isMutating: isChangingPassword }
    = useAdminPasswordChange(user.user_id);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const showError = (message: string) => {
    setError(message);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    const { password } = values;

    changePassword(
      { new_password: password },
      {
        onSuccess: () => {
          form.reset();
          setShowPasswordDialog(false);

          toast({
            title: "Password reset successfully!",
            description: "The user can now log in with the new password.",
            variant: "success",
          });
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
          toast({
            title: "Failed to reset password",
            description: err.message ?? "Unknown error.",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
      <DialogTrigger asChild>
        <Button variant="accent" className="w-full">
          <KeyRound className="mr-2 size-4" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for
            {" "}
            <span className="font-semibold text-foreground">
              {user.username}
            </span>
            . The password must be at least 8 characters long.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      disabled={isChangingPassword}
                      className="flex-1"
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      disabled={isChangingPassword}
                      className="flex-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
                disabled={isChangingPassword}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
