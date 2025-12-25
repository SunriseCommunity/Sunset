"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAdminEditUserMetadata } from "@/lib/hooks/api/user/useAdminUserEdit";
import { useEditUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type {
  UserMetadataResponse,
  UserResponse,
} from "@/lib/types/api";
import {
  UserPlaystyle,
} from "@/lib/types/api";
import { zEditUserMetadataRequest } from "@/lib/types/api/zod.gen";
import { cn } from "@/lib/utils";

const formSchema = zEditUserMetadataRequest;

export default function ChangePlaystyleForm({
  user,
  metadata,
  className,
}: {
  user: UserResponse;
  metadata: UserMetadataResponse;
  className?: string;
}) {
  const t = useT("pages.settings.components.playstyle");
  const tCommon = useT("pages.settings.common");
  const [error, setError] = useState<string | null>(null);

  const [playstyle, setPlaystyle] = useState<UserPlaystyle[]>(
    metadata.playstyle,
  );

  const self = useSelf();

  const isSelf = user.user_id === self?.self?.user_id;

  const { toast } = useToast();

  const { trigger: triggerSelf } = useEditUserMetadata();
  const { trigger: triggerUser } = useAdminEditUserMetadata(user.user_id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...metadata,
    },
  });

  const handleCheckboxChange = (checked: boolean, value: UserPlaystyle) => {
    setPlaystyle(prev =>
      checked ? [...prev, value] : prev.filter(p => p !== value),
    );
  };
  const showError = (message: string) => {
    setError(message);
  };

  function onSubmit(_values: z.infer<typeof formSchema>) {
    setError(null);

    const trigger = isSelf ? triggerSelf : triggerUser;

    trigger(
      {
        playstyle,
      },
      {
        onSuccess: () => {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col flex-wrap gap-2 sm:flex-row", className)}
      >
        <FormField
          control={form.control}
          name="playstyle"
          render={({ field }) => (
            <>
              {Object.values(UserPlaystyle)
                .filter(v => v !== UserPlaystyle.NONE)
                .map((value) => {
                  return (
                    <CardContent
                      className="flex-grow rounded-lg p-2"
                      key={value}
                    >
                      <FormItem key={value}>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={playstyle.includes(value)}
                              onCheckedChange={v =>
                                handleCheckboxChange(!!v, value)}
                              type="submit"
                            />
                            <label
                              htmlFor={field.name}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t(`options.${value}`)}
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
  );
}
