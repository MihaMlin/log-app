import { SquareTerminal } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/dashboard">
            <div className="h-12 flex items-center gap-3">
              <div className="h-6 w-6 bg-cyan-200 rounded-full animate-pulse" />
              <span className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">
                LOGAPP
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
