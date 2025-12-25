"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
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
import { useUsernameChange } from "@/lib/hooks/api/user/useUsernameChange";
import { useT } from "@/lib/i18n/utils";

function createFormSchema(t: ReturnType<typeof useT>) {
  return z.object({
    newUsername: z
      .string()
      .min(2, {
        message: t("validation.minLength", { min: 2 }),
      })
      .max(32, {
        message: t("validation.maxLength", { max: 32 }),
      }),
  });
}

export default function ChangeUsernameInput() {
  const t = useT("pages.settings.components.username");
  const tCommon = useT("pages.settings.common");
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const { trigger } = useUsernameChange();

  const formSchema = useMemo(() => createFormSchema(t), [t]);

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
            name="newUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholder")} {...field} />
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
      <label className="mt-2 text-xs">{t("reminder")}</label>
    </div>
  );
}
