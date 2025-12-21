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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdminCountryChange } from "@/lib/hooks/api/user/useAdminUserEdit";
import { useCountryChange } from "@/lib/hooks/api/user/useCountryChange";
import { useUsernameChange } from "@/lib/hooks/api/user/useUsernameChange";
import useSelf from "@/lib/hooks/useSelf";
import {
  CountryCode,
  GameMode,
  UserBadge,
  UserResponse,
} from "@/lib/types/api";
import { zCountryChangeRequest } from "@/lib/types/api/zod.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { useT } from "@/lib/i18n/utils";
import Cookies from "js-cookie";

const formSchema = zCountryChangeRequest;

export default function ChangeCountryInput({
  user,
  className,
}: {
  user: UserResponse;
  className?: string;
}) {
  const t = useT("pages.settings.components.country");
  const tCommon = useT("pages.settings.common");
  const [error, setError] = useState<string | null>(null);

  const self = useSelf();

  const shouldUseAdminPrivileges = self?.self?.badges.includes(UserBadge.ADMIN);

  const isSelf =
    user.user_id === self?.self?.user_id && !shouldUseAdminPrivileges;

  const { toast } = useToast();

  const { trigger: triggerSelfChange, isMutating: isChangingSelf } =
    useCountryChange();

  const { trigger: triggerUserChange, isMutating: isChangingUser } =
    useAdminCountryChange(user.user_id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_country: user.country_code,
    },
  });

  const showError = (message: string) => {
    setError(message);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    const { new_country } = values;

    const payload = {
      new_country: new_country as CountryCode,
    };

    const options = {
      onSuccess: () => {
        form.reset();

        toast({
          title: t("toast.success"),
          variant: "success",
        });
      },
      onError: (err: any) => {
        showError(err.message ?? tCommon("unknownError"));
        toast({
          title: t("toast.error"),
          description: err.message ?? tCommon("unknownError"),
          variant: "destructive",
        });
      },
    };

    if (isSelf) {
      triggerSelfChange(payload, options);
    } else {
      triggerUserChange(payload, options);
    }
  }

  const regionNames = new Intl.DisplayNames([Cookies.get("locale") || "en"], {
    type: "region",
  });

  return (
    <div className={twMerge("flex flex-col lg:w-1/2", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="new_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CountryCode)
                        .filter((v) => v != CountryCode.XX)
                        .map((v) => (
                          <SelectItem value={v} key={v}>
                            <div className="flex flex-row items-center">
                              <img
                                src={`/images/flags/${v}.png`}
                                alt="Country Flag"
                                className="md:w-6 md:h-6 w-5 h-5 mr-2"
                              />
                              {regionNames.of(v)}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              disabled={isChangingSelf || isChangingUser}
              className="w-full"
            >
              {t("button")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
