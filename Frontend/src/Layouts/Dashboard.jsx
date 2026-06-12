
import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from '../Components/TopBar'
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0A0F1A] text-white">

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}