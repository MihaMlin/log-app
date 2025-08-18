"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader, MailCheck } from "lucide-react";
import Link from "next/link";
import { forgotPasswordMutationFn } from "@/lib/api/auth.api";

export default function Page() {
  const formSchema = z.object({
    email: z.email({
      message: "Please enter a valid email address",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: forgotPasswordMutationFn,
    onSuccess: () => {
      toast.success("Reset link sent", {
        description: "Check your email for password reset instructions",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to send reset link",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({ email: values.email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            {isSuccess
              ? "We've sent a new reset link"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center space-y-4">
              <MailCheck className="h-12 w-12 text-green-500" />
              <Button asChild className="w-full">
                <Link href="/sign-in">Continue to Sign In</Link>
              </Button>
            </div>
          ) : (
            <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send Reset Link
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center text-sm">
                Remember your password?{" "}
                <Link
                  href="/sign-in"
                  className="text-primary underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
