import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Database,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { t, language, dir } = useLanguage();
  const [location] = useLocation();
  const { state, toggleSidebar } = useSidebar();

  const menuItems = [
    { title: t("dashboard"), url: "/", icon: LayoutDashboard },
    { title: t("facilities"), url: "/facilities", icon: Building2 },
    { title: t("masterData"), url: "/master-data", icon: Database },
    { title: t("inventory"), url: "/inventory", icon: Package },
    { title: t("reports"), url: "/reports", icon: FileText },
    { title: t("settings"), url: "/settings", icon: Settings },
  ];

  const isActive = (url: string) => {
    if (url === "/") return location === "/";
    return location.startsWith(url);
  };

  return (
    <Sidebar side={dir === "rtl" ? "right" : "left"} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">
                {language === "ar" ? "إدارة المنشآت" : "Facilities"}
              </span>
              <span className="text-xs text-muted-foreground">
                {language === "ar" ? "النظام الذكي" : "Smart System"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url} data-testid={`nav-${item.url.replace("/", "") || "dashboard"}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full justify-center"
          data-testid="button-toggle-sidebar"
        >
          {state === "collapsed" ? (
            dir === "rtl" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            dir === "rtl" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
