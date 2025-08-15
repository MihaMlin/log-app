import { Plus, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import RegisterUserDialog from "../(admin)/_components/register-user-dialog";
import { useState } from "react";

export function NavAdmin({
  actions,
}: {
  actions: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const [isRegisterUserDialogOpen, setIsRegisterUserDialogOpen] =
    useState(false);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {actions.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        <SidebarMenuItem key="register-user">
          <SidebarMenuButton onClick={() => setIsRegisterUserDialogOpen(true)}>
            <Plus />
            <span>Add User</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <RegisterUserDialog
        open={isRegisterUserDialogOpen}
        onOpenChange={setIsRegisterUserDialogOpen}
      />
    </SidebarGroup>
  );
}
