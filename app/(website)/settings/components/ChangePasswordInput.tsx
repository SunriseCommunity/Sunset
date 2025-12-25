"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { usePasswordChange } from "@/lib/hooks/api/user/usePasswordChange";
import { useT } from "@/lib/i18n/utils";

function createFormSchema(t: ReturnType<typeof useT>, passwordRef: { current: string }) {
  return z.object({
    currentPassword: z
      .string()
      .min(8, {
        message: t("validation.minLength", { min: 8 }),
      })
      .max(32, {
        message: t("validation.maxLength", { max: 32 }),
      }),
    password: z
      .string()
      .min(8, {
        message: t("validation.minLength", { min: 8 }),
      })
      .max(32, {
        message: t("validation.maxLength", { max: 32 }),
      })
      .refine((value) => {
        passwordRef.current = value;
        return true;
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: t("validation.minLength", { min: 8 }),
      })
      .max(32, {
        message: t("validation.maxLength", { max: 32 }),
      })
      .refine(
        value => value === passwordRef.current,
        t("validation.mismatch"),
      ),
  });
}

export default function ChangePasswordInput() {
  const t = useT("pages.settings.components.password");
  const tCommon = useT("pages.settings.common");
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<string>("");

  const { toast } = useToast();

  const { trigger } = usePasswordChange();

  const formSchema = useMemo(() => createFormSchema(t, passwordRef), [t]);

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

          toast({
            title: t("toast.success"),
            variant: "success",
          });
        },
        onError: (err) => {
          showError(err.message ?? tCommon("unknownError"));
          toast({
            title: t("toast.error"),
            description: err.message ?? tCommon("unknownError"),
            variant: "destructive",
          });
        },
      },
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
                <FormLabel>{t("labels.current")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("placeholder")}
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
                <FormLabel>{t("labels.new")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("placeholder")}
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
                <FormLabel>{t("labels.confirm")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit">{t("button")}</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
