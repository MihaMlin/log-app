"use client";

import * as React from "react";
import { FolderOpenDot, Logs, Map, Users } from "lucide-react";

import { NavMain } from "@/app/(main)/dashboard/_sidebar/nav-main";
import { NavAdmin } from "@/app/(main)/dashboard/_sidebar/nav-admin";
import { NavUser } from "@/app/(main)/dashboard/_sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import { useAuthContext } from "@/context/auth-provider";

const data = {
  navMain: [
    {
      title: "MyProjects",
      url: "/dashboard/projects",
      icon: FolderOpenDot,
      isActive: true,
      items: [],
    },
    {
      title: "MyLogs",
      url: "#",
      icon: Logs,
      items: [
        {
          title: "1h",
          url: "#",
        },
        {
          title: "24h",
          url: "#",
        },
        {
          title: "Severity",
          url: "#",
        },
      ],
    },
  ],
  actions: [
    {
      name: "All Projects",
      url: "#",
      icon: Map,
    },
    {
      name: "Manage Users",
      url: "/dashboard/manage-users",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <NavMain items={data.navMain} />

        {/* Admin Navigation */}
        {user?.role === "admin" && <NavAdmin actions={data.actions} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
