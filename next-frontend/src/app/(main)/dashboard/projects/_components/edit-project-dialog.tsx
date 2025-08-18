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
import { Loader, CheckCircle } from "lucide-react";
import { updateProjectMutationFn } from "@/lib/api/project.api";
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
import { ProjectType } from "@/types";
import { useEffect } from "react";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectType;
  onProjectEdited?: () => void;
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

const EditProjectDialog = ({
  open,
  onOpenChange,
  project,
  onProjectEdited,
}: EditProjectDialogProps) => {
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

  // Set form values when project changes
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description,
        status: project.status,
        tags: project.tags || [],
      });
    }
  }, [project, form]);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: updateProjectMutationFn,
    onSuccess: () => {
      toast.success("Project updated", {
        description: "Your project has been successfully updated",
      });
      onProjectEdited?.();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to update project",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!project?._id) return;

    const data: Partial<typeof values> = {};

    if (values.name !== project.name) {
      data.name = values.name;
    }
    if (values.description !== project.description) {
      data.description = values.description;
    }
    if (values.status !== project.status) {
      data.status = values.status;
    }
    if (JSON.stringify(values.tags) !== JSON.stringify(project.tags)) {
      data.tags = values.tags;
    }

    if (Object.keys(data).length === 0) return; // nothing changed

    mutate({ id: project?._id, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update the project details</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
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
                      placeholder="Project description"
                      rows={3}
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
                      values={field.value || []}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger>
                        <MultiSelectValue placeholder="Select tags" />
                      </MultiSelectTrigger>
                      <MultiSelectContent>
                        {tagOptions.map((option) => (
                          <MultiSelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectContent>
                    </MultiSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
