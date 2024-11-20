import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreenCollapsed, setIsLargeScreenCollapsed] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleLargeScreenSidebar = () =>
    setIsLargeScreenCollapsed(!isLargeScreenCollapsed);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        isLargeScreenCollapsed={isLargeScreenCollapsed}
      />

      <div
        className={`transition-all duration-300 ${
          isLargeScreenCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <Topbar
          toggleLargeScreenSidebar={toggleLargeScreenSidebar}
          isLargeScreenCollapsed={isLargeScreenCollapsed}
        />
        <main className="p-3">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default MainLayout;
