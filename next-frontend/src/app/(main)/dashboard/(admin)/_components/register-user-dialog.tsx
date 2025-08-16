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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader, MailCheck } from "lucide-react";
import { registerUserMutationFn } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterUserDialog = ({
  open,
  onOpenChange,
}: RegisterUserDialogProps) => {
  const formSchema = z.object({
    email: z.email({
      message: "Please enter a valid email address",
    }),
    role: z.enum(["user", "admin"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: registerUserMutationFn,
    onSuccess: () => {
      toast.success("Invitation sent", {
        description: "User will receive a password setup email",
      });
      form.reset();
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to register user",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
          <DialogDescription>
            {isSuccess
              ? "User invitation sent successfully"
              : "Enter user's email to send setup instructions"}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center space-y-4">
            <MailCheck className="h-12 w-12 text-green-500" />
            <Button onClick={() => reset()}>Add Another User</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitation
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterUserDialog;
