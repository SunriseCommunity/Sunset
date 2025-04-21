"use client";
import { AlertCircle, DoorOpen } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import { useState } from "react";
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

let password = "";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(32, {
      message: "Username must be 32 characters or fewer.",
    }),
  email: z.string(),
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

export default function Register() {
  const [isSuccessfulDialogOpen, setIsSuccessfulDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { trigger } = useRegister();

  const { self, revalidate } = useSelf();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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

          toast({ title: "Account successfully created!" });

          setIsSuccessfulDialogOpen(true);
        },
        onError(err) {
          setError(err.message ?? "Unknown error.");
        },
      }
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader text="Register" icon={<DoorOpen />} roundBottom={true} />
      <RoundedContent className="mb-4 rounded-lg">
        <div className="flex w-11/12 mx-auto">
          <div className="flex flex-col w-11/12 mx-auto space-y-6">
            <h1 className="text-xl">Welcome to the registration page!</h1>
            <p>
              Hello! Please enter your details to create an account. If you
              don't sure how to connect to the server, or if you have any other
              questions, please visit our{" "}
              <Link href="/wiki" className="text-primary hover:underline">
                Wiki page
              </Link>
              .
            </p>

            <div className="flex flex-col space-y-2">
              <h1 className="text-xl">Enter your details</h1>

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
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            pattern="^[a-zA-Z0-9_\- ]{1,32}$"
                            placeholder="e.g. username"
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            pattern="^.+@.+\.[a-zA-Z]{2,63}$"
                            placeholder="e.g. username@mail.com"
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                  <span className="text-xs text-secondary-foreground">
                    By signing up, you agree to the server{" "}
                    <Link
                      href="/rules"
                      className="text-primary hover:underline"
                    >
                      rules
                    </Link>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>You’re all set!</DialogTitle>

            <DialogDescription>
              Your account has been successfully created.
            </DialogDescription>
          </DialogHeader>
          <p>
            You can now connect to the server by following the guide on our{" "}
            <Link href="/wiki" className="text-primary hover:underline">
              Wiki page
            </Link>{" "}
            , or customize your profile by updating your avatar and banner
            before you start playing!
          </p>

          <DialogFooter>
            <Button type="submit" asChild variant="secondary">
              <Link href={`/wiki`}>View Wiki Guide</Link>
            </Button>

            {self && (
              <Button type="submit" asChild>
                <Link href={`/user/${self?.user_id}`}>Go to Profile</Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
