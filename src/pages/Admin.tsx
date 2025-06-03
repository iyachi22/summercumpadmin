
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { InscriptionsTable } from "@/components/admin/InscriptionsTable";
import { AdminStats } from "@/components/admin/AdminStats";
import { TestAteliers } from "@/components/admin/TestAteliers";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "inscriptions":
        return <InscriptionsTable />;
      case "stats":
        return <AdminStats />;
      case "test":
        return <TestAteliers />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          extraTabs={[
            { id: 'test', label: 'Test Ateliers' }
          ]}
        />
        <main className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
