"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { ProjectType } from "@/types";
import CreateProjectDialog from "./_components/create-project-dialog";
import useProjects from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const ProjectsPage = () => {
  const router = useRouter();

  // State for dialog and filters
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch projects using custom hook
  const { projects, isLoading, isError, refetch } = useProjects();

  // Filter projects based on search term and status
  const filteredProjects = useMemo(() => {
    return projects.filter((project: ProjectType) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, filterStatus]);

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Failed to load projects. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your current projects
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() => setIsCreateProjectDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "completed" ? "default" : "outline"}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
          <Button
            variant={filterStatus === "archived" ? "default" : "outline"}
            onClick={() => setFilterStatus("archived")}
          >
            Archived
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Projects Grid Section */}
      {!isLoading && filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-muted-foreground">No projects found</p>
          <Button
            variant="outline"
            onClick={() => setIsCreateProjectDialogOpen(true)}
          >
            Create your first project
          </Button>
        </div>
      ) : (
        !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: ProjectType) => (
              <Card
                key={`${project._id}`}
                onClick={() =>
                  router.push(`/dashboard/projects/${project._id}`)
                }
                className="hover:shadow-lg hover:cursor-pointer transition-shadow flex flex-col h-full"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {project.name}
                    </h3>
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
                  </div>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, index) => (
                      <Badge
                        key={`${project._id}-${tag}-${index}`}
                        variant="outline"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground mt-auto">
                  Created: {format(new Date(project.createdAt), "MMM d, yyyy")}
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        onProjectCreated={refetch}
      />
    </div>
  );
};

export default ProjectsPage;
