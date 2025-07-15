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
import { useCountryChange } from "@/lib/hooks/api/user/useCountryChange";
import { useUsernameChange } from "@/lib/hooks/api/user/useUsernameChange";
import { CountryCode, GameMode, UserResponse } from "@/lib/types/api";
import { zCountryChangeRequest } from "@/lib/types/api/zod.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = zCountryChangeRequest;

export default function ChangeCountryInput({ user }: { user: UserResponse }) {
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const { trigger, isMutating } = useCountryChange();

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

    trigger(
      {
        new_country: new_country as CountryCode,
      },
      {
        onSuccess: () => {
          form.reset();

          toast({
            title: "Country flag changed successfully!",
            variant: "success",
          });
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
          toast({
            title: "Error occured while changing country flag!",
            description: err.message ?? "Unknown error.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  return (
    <div className="flex flex-col lg:w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="new_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Country Flag</FormLabel>
                <FormControl>
                  <Select>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new country flag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CountryCode)
                          .filter((v) => v != CountryCode.XX)
                          .map((v) => (
                            <SelectItem value={v}>
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
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isMutating}>
              Change country flag
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
