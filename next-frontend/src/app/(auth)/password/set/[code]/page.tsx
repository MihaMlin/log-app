"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { setInitialPasswordMutationFn } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const { code } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: setInitialPasswordMutationFn,
    onSuccess: () => {
      toast.success("Password set successfully");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to set password", {
        description: error.message || "Please try again later",
      });
    },
  });

  const formSchema = z
    .object({
      password: z.string().min(6).max(255, {
        message: "Password must be at least 6 characters",
      }),
      confirmPassword: z.string().min(1, {
        message: "Confirm Password is required",
      }),
    })
    .refine((val) => val.password === val.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      password: values.password,
      confirmPassword: values.confirmPassword,
      verificationCode: Array.isArray(code) ? code[0] : code!,
    };
    mutate(data);
  };

  if (!code) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Initial Set Password Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The password initial set link is invalid or has expired.</p>
            <p>Contact admin for new link</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        autoComplete="new-password"
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
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Set Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
