import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Topbar({ setSidebarOpen }) {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard/attendance":
        return "Attendance";
      case "/dashboard/employees":
        return "Employees";
      case "/dashboard/logsheet":
        return "Log Sheet";
      case "/dashboard/substations":
        return "Substations";
      case "/dashboard/overtime":
        return "Overtime Hours";
      default:
        return "System Overview";
    }
  };

  return (
    <div className="h-[60px] flex items-center justify-between px-5 border-b border-[#1A2B3C] bg-[#0D1422]">
      
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
          <Menu size={20} />
        </button>

        <p className="font-bold text-md text-white">
          {getTitle()}
        </p>
      </div>

      <div className="relative w-8 h-8 border border-[#1A2B3C] rounded-lg flex items-center justify-center cursor-pointer">
        <Bell size={14} className="text-[#4E6680]" />
      </div>
    </div>
  );
}