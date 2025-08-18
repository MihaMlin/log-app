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
import { Loader, PlusCircle } from "lucide-react";
import { createProjectMutationFn } from "@/lib/api/project.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

const tagOptions = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "api", label: "API" },
  { value: "database", label: "Database" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "research", label: "Research" },
];

const CreateProjectDialog = ({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectDialogProps) => {
  const formSchema = z.object({
    name: z.string().min(1, "Required").max(100, "Too long"),
    description: z.string().max(500, "Too long").optional(),
    status: z.enum(["active", "archived", "completed"]),
    tags: z.array(z.string().min(1).max(20)).max(10).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      tags: [],
    },
  });

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: createProjectMutationFn,
    onSuccess: () => {
      toast.success("Project created", {
        description: "Your new project has been successfully created",
      });
      form.reset();
      onProjectCreated?.();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to create project",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            {isSuccess
              ? "Project created successfully"
              : "Fill in the details to create a new project"}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center space-y-4">
            <PlusCircle className="h-12 w-12 text-green-500" />
            <Button
              onClick={() => {
                reset();
                form.reset();
              }}
            >
              Create Another Project
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of your project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your project"
                        rows={3}
                        maxLength={500}
                        className="max-h-40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelect
                        values={field.value}
                        onValuesChange={field.onChange}
                      >
                        <MultiSelectTrigger>
                          <MultiSelectValue placeholder="Select tags" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                          {tagOptions.map((option) => (
                            <MultiSelectItem
                              key={option.label}
                              value={option.value}
                            >
                              {option.label}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectContent>
                      </MultiSelect>
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">Max 10 tags</p>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
