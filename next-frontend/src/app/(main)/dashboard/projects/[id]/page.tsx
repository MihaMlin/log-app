"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, RefreshCcw, Edit } from "lucide-react";
import { format } from "date-fns";
import useProject from "@/hooks/use-project";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import EditProjectDialog from "../_components/edit-project-dialog";
import { useState } from "react";

const ProjectDetailPage = () => {
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);

  const { id } = useParams();
  const { project, isLoading, isError, refetch } = useProject(id as string);

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Failed to load project. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px] md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p>Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={
                project.status === "active"
                  ? "default"
                  : project.status === "completed"
                  ? "secondary"
                  : "outline"
              }
            >
              {project.status}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(project.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <Button onClick={() => setIsEditProjectDialogOpen(true)}>
          Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Details Card */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Project Details</h2>
            <div className="space-y-4 p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{format(new Date(project.createdAt), "PPP")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCcw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p>{format(new Date(project.updatedAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2 p-4 rounded-lg border">
              {project.tags?.length > 0 ? (
                project.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="mr-2 h-3 w-3" />
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Description</h2>
            <div className="p-4 rounded-lg border">
              <p className="whitespace-pre-line">
                {project.description || "No description provided"}
              </p>
            </div>
          </div>

          {/* Additional sections can be added here */}

          {/* Tasks, Team Members, Timeline, etc. */}
        </div>
      </div>
      <EditProjectDialog
        open={isEditProjectDialogOpen}
        onOpenChange={setIsEditProjectDialogOpen}
        project={project}
        onProjectEdited={refetch}
      />
    </div>
  );
};

export default ProjectDetailPage;
