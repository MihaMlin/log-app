"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import useProject from "@/hooks/use-project";
import { Skeleton } from "@/components/ui/skeleton";
import EditProjectDialog from "../_components/edit-project-dialog";
import { DataTable } from "./_componets/data-table";
import { columns } from "./_componets/columns";
import useLogs from "@/hooks/use-logs";
import { useState } from "react";

const ProjectDetailPage = () => {
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { id } = useParams();
  const {
    project,
    isLoading: isLoadingProject,
    isError: isProjectError,
    refetch: refetchProject,
  } = useProject(id as string);

  const {
    logs,
    pagination,
    isLoading: isLoadingLogs,
    isError: isLogsError,
    refetch: refetchLogs,
  } = useLogs({
    projectId: id as string,
    params: {
      currentPage,
      pageSize,
      search,
    },
  });

  const handleProjectEdited = () => {
    refetchProject();
    refetchLogs();
  };

  // TO-DO fix search
  const handleSearchChange = (searchValue: string) => {
    console.log("handleSearchChange called with searchValue:", searchValue);
    setSearch(searchValue);
    setCurrentPage(0);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    console.log(pageIndex, "pageIndex", pageSize);
    setCurrentPage(pageIndex);
  };

  if (isProjectError) {
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

  if (isLoadingProject) {
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
        </div>
      </div>

      {/* Logs Data Table Section */}
      <div className="py-10">
        <h2 className="text-2xl font-semibold mb-4">Logs</h2>
        {isLogsError ? (
          <div className="rounded-md border p-4 bg-destructive/10 text-destructive">
            <p>Error loading logs</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => refetchLogs()}
            >
              Retry
            </Button>
          </div>
        ) : isLoadingLogs ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={logs}
            pageSize={pageSize}
            currentPage={currentPage}
            pageCount={pagination.totalPages}
            total={pagination.total}
            onPaginationChange={handlePaginationChange}
            onSearchChange={handleSearchChange}
            searchColumn="message"
          />
        )}
      </div>

      {/* Edit Project Dialog */}
      <EditProjectDialog
        open={isEditProjectDialogOpen}
        onOpenChange={setIsEditProjectDialogOpen}
        project={project}
        onProjectEdited={handleProjectEdited}
      />
    </div>
  );
};

export default ProjectDetailPage;
