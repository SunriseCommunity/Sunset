"use client";
import { AlertCircle, DoorOpen } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import { useState, useMemo, useCallback, useRef } from "react";
import { useRegister } from "@/lib/hooks/api/auth/useRegister";
import Cookies from "js-cookie";
import useSelf from "@/lib/hooks/useSelf";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n/utils";

export default function Register() {
  const [isSuccessfulDialogOpen, setIsSuccessfulDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<string>("");

  const { trigger } = useRegister();
  const { self, revalidate } = useSelf();
  const { toast } = useToast();
  const t = useT("pages.register");

  const formSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(2, {
            message: t("form.validation.usernameMin", { min: 2 }),
          })
          .max(32, {
            message: t("form.validation.usernameMax", { max: 32 }),
          }),
        email: z.string(),
        password: z
          .string()
          .min(8, {
            message: t("form.validation.passwordMin", { min: 8 }),
          })
          .max(32, {
            message: t("form.validation.passwordMax", { max: 32 }),
          })
          .refine((value) => {
            passwordRef.current = value;
            return true;
          }),
        confirmPassword: z
          .string()
          .min(8, {
            message: t("form.validation.passwordMin", { min: 8 }),
          })
          .max(32, {
            message: t("form.validation.passwordMax", { max: 32 }),
          })
          .refine(
            (value) => value === passwordRef.current,
            t("form.validation.passwordsDoNotMatch")
          ),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setError(null);

      const { username, email, password } = values;

      trigger(
        {
          email,
          username,
          password,
        },
        {
          onSuccess: (data) => {
            Cookies.set("session_token", data.token, {
              expires: new Date(Date.now() + data.expires_in),
            });

            Cookies.set("refresh_token", data.refresh_token, {
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

            form.reset();

            revalidate();

            toast({ title: t("success.toast") });

            setIsSuccessfulDialogOpen(true);
          },
          onError(err) {
            setError(err.message ?? t("form.error.unknown"));
          },
        }
      );
    },
    [trigger, form, revalidate, toast, t]
  );

  const welcomeDescription = useMemo(
    () =>
      t.rich("welcome.description", {
        a: (chunks) => (
          <Link href="/wiki" className="text-primary hover:underline">
            {chunks}
          </Link>
        ),
      }),
    [t]
  );

  const termsText = useMemo(
    () =>
      t.rich("form.terms", {
        a: (chunks) => (
          <Link href="/rules" className="text-primary hover:underline">
            {chunks}
          </Link>
        ),
      }),
    [t]
  );

  const successMessage = useMemo(
    () =>
      t.rich("success.dialog.message", {
        a: (chunks) => (
          <Link
            href="/wiki#How%20to%20connect"
            className="text-primary hover:underline"
          >
            {chunks}
          </Link>
        ),
      }),
    [t]
  );

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader text={t("header")} icon={<DoorOpen />} roundBottom={true} />
      <RoundedContent className="bg-card mb-4 rounded-lg">
        <div className="flex w-11/12 mx-auto">
          <div className="flex flex-col w-11/12 mx-auto space-y-6">
            <h1 className="text-xl">{t("welcome.title")}</h1>
            <p>{welcomeDescription}</p>

            <div className="flex flex-col space-y-2">
              <h1 className="text-xl">{t("form.title")}</h1>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.labels.username")}</FormLabel>
                        <FormControl>
                          <Input
                            pattern="^[a-zA-Z0-9_\- ]{1,32}$"
                            placeholder={t("form.placeholders.username")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.labels.email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            pattern="^.+@.+\.[a-zA-Z]{2,63}$"
                            placeholder={t("form.placeholders.email")}
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
                        <FormLabel>{t("form.labels.password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("form.placeholders.password")}
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
                        <FormLabel>
                          {t("form.labels.confirmPassword")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("form.placeholders.password")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t("form.error.title")}</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full">
                    {t("form.submit")}
                  </Button>
                  <span className="text-xs text-secondary-foreground">
                    {termsText}
                  </span>
                </form>
              </Form>
            </div>
          </div>

          <Image
            src="/images/register.png"
            alt="register image"
            width={400}
            height={800}
            className="rounded-lg mt-4 hidden lg:block"
          />
        </div>
      </RoundedContent>

      <Dialog
        open={isSuccessfulDialogOpen}
        onOpenChange={setIsSuccessfulDialogOpen}
      >
        <DialogContent className="sm:min-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("success.dialog.title")}</DialogTitle>

            <DialogDescription>
              {t("success.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <p>{successMessage}</p>

          <DialogFooter>
            <Button asChild variant="secondary" className="my-2 md:my-0">
              <Link href={`/wiki#How%20to%20connect`}>
                {t("success.dialog.buttons.viewWiki")}
              </Link>
            </Button>

            {self && (
              <Button asChild className="my-2 md:my-0">
                <Link href={`/user/${self?.user_id}`}>
                  {t("success.dialog.buttons.goToProfile")}
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
