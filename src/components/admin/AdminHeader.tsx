
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Download, Bell } from "lucide-react";

export function AdminHeader() {
  const handleExport = () => {
    // This would export all inscriptions data
    console.log("Exporting inscriptions data...");
    // In a real app, this would trigger a download of CSV/Excel file
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold text-gray-900">
            Administration Summer Camp 2025
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
