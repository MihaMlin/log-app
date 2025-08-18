import { AppSidebar } from "@/app/(main)/dashboard/_sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthGate } from "./_components/auth-gate";
import { AuthProvider } from "@/context/auth-provider";
import Breadcrumbs from "./_components/breadcrumbs";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AuthGate>
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumbs />
              </div>
            </header>

            <main className="flex-1 p-4 flex flex-col gap-4 overflow-auto">
              {children}
            </main>

            <footer className="border-t p-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Miha Mlinarič, All rights reserved.
              </div>
            </footer>
          </SidebarInset>
        </SidebarProvider>
      </AuthGate>
    </AuthProvider>
  );
}
