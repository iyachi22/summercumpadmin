
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BarChart3, Users, Calendar, Settings } from "lucide-react";

interface TabItem {
  id: string;
  label: string;
}

type MenuItem = {
  title: string;
  url: string;
  icon: any;
  key: string;
};

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  extraTabs?: TabItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "#",
    icon: BarChart3,
    key: "dashboard",
  },
  {
    title: "Inscriptions",
    url: "#",
    icon: Users,
    key: "inscriptions",
  },
  {
    title: "Statistiques",
    url: "#",
    icon: BarChart3,
    key: "stats",
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    key: "settings",
  },
];

export function AdminSidebar({ activeTab, setActiveTab, extraTabs = [] }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <button
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left ${
                      activeTab === item.key 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuItem>
              ))}
              
              {extraTabs.length > 0 && (
                <>
                  <SidebarGroupLabel>Debug</SidebarGroupLabel>
                  {extraTabs.map((tab) => (
                    <SidebarMenuItem key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left ${
                          activeTab === tab.id 
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
