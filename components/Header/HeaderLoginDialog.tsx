"use client";

import React, { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useSelf from "@/lib/hooks/useSelf";
import useRestriction from "@/lib/hooks/useRestriction";
import { useAuthorize } from "@/lib/hooks/api/auth/useAuthorize";

import Cookies from "js-cookie";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { MobileDrawerContext } from "@/components/Header/HeaderMobileDrawer";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(32, {
      message: "Username must be 32 characters or fewer.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(32, {
      message: "Password must be 32 characters or fewer.",
    }),
});

export default function HeaderLoginDialog() {
  const [error, setError] = useState("");

  const router = useRouter();

  const { revalidate } = useSelf();
  const { toast } = useToast();

  const { setSelfRestricted } = useRestriction();
  const { trigger: triggerAuthorize } = useAuthorize();

  const setMobileDrawerOpen = useContext(MobileDrawerContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;

    triggerAuthorize(
      {
        username,
        password,
      },
      {
        onSuccess(data) {
          Cookies.set("session_token", data.token, {
            expires: new Date(Date.now() + data.expires_in * 1000),
          });

          Cookies.set("refresh_token", data.refresh_token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });

          revalidate();

          toast({
            title: "You succesfully logged in!",
            variant: "success",
          });
        },
        onError(err) {
          const errorMessage = err.message ?? "Unknown error";

          if (errorMessage?.includes("restrict")) {
            setSelfRestricted(true, errorMessage);
            return;
          }

          setError(errorMessage || "Unknown error");
        },
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">sign in</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In To Proceed</DialogTitle>
          <DialogDescription>Welcome back.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. username" {...field} />
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
                  <FormLabel>Password</FormLabel>
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
            {error && (
              <p className="mx-auto text-sm text-destructive">{error}</p>
            )}
            <DialogFooter>
              <Button
                onClick={() => {
                  MobileDrawerContext.Provider;
                }}
                type="submit"
              >
                Login
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <Separator className="my-2" />

        <div className="flex flex-row justify-between ">
          <DialogClose asChild>
            <Button
              variant="link"
              onClick={() => {
                router.push("/register");
                setMobileDrawerOpen?.(false);
              }}
              className="w-full"
            >
              Don't have an account? Sign up
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
