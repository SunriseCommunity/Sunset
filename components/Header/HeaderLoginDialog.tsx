"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MobileDrawerContext } from "@/components/Header/HeaderMobileDrawer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuthorize } from "@/lib/hooks/api/auth/useAuthorize";
import useRestriction from "@/lib/hooks/useRestriction";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";

export default function HeaderLoginDialog() {
  const t = useT("components.headerLoginDialog");
  const [error, setError] = useState("");

  const router = useRouter();

  const { revalidate } = useSelf();
  const { toast } = useToast();

  const { setSelfRestricted } = useRestriction();
  const { trigger: triggerAuthorize } = useAuthorize();

  const setMobileDrawerOpen = useContext(MobileDrawerContext);

  const formSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(2, {
            message: t("validation.usernameMinLength"),
          })
          .max(32, {
            message: t("validation.usernameMaxLength"),
          }),
        password: z
          .string()
          .min(8, {
            message: t("validation.passwordMinLength"),
          })
          .max(32, {
            message: t("validation.passwordMaxLength"),
          }),
      }),
    [t],
  );

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
            title: t("toast.success"),
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
      },
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("signIn")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("username.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("username.placeholder")} {...field} />
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
                  <FormLabel>{t("password.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("password.placeholder")}
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
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- TODO: I assume this was a typo?
                  MobileDrawerContext.Provider;
                }}
                type="submit"
              >
                {t("login")}
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
              {t("signUp")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
