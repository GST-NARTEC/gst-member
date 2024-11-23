import { useState, useEffect } from "react";
import {
  FaTimes,
  FaBars,
  FaChartLine,
  FaUser,
  FaBarcode,
  FaMapMarkerAlt,
  FaTrademark,
  FaFileInvoiceDollar,
  FaReceipt,
  FaQuestionCircle,
  FaFileContract,
  FaFileAlt,
  FaHandshake,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { Images } from "../../assets/Index";
import { MdEmail } from "react-icons/md";

function Sidebar({ isOpen, toggleSidebar, isLargeScreenCollapsed }) {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    { path: "/dashboard", icon: <FaChartLine />, label: "Dashboard" },
    { path: "/profile", icon: <FaUser />, label: "My Profile" },
    { path: "/barcodes", icon: <FaBarcode />, label: "My Barcodes" },
    { path: "/gln", icon: <FaMapMarkerAlt />, label: "GLN (Location)" },
    { path: "/brands", icon: <FaTrademark />, label: "My Brands" },
    { path: "/billing", icon: <FaFileInvoiceDollar />, label: "My Billing" },
    { path: "/subscription", icon: <FaReceipt />, label: "My Subscription" },
    { path: "/help-desk", icon: <FaQuestionCircle />, label: "Help Desk" },
    {
      path: "/terms",
      icon: <FaFileContract />,
      label: "GST Terms & Conditions",
    },
    {
      path: "/data-policy",
      icon: <FaFileAlt />,
      label: "Data Declaration Policy",
    },
    { path: "/contract", icon: <FaHandshake />, label: "My GST Contract" },
    {
      path: "/logout",
      icon: <FaSignOutAlt />,
      label: "Log-out",
      className: "mt-auto text-red-400 hover:text-red-300",
    },
  ];

  // Helper to check if current path belongs to a dropdown's subitems
  const isDropdownPath = (subItems) => {
    return subItems?.some((item) => location.pathname.startsWith(item.path));
  };

  // Initialize dropdowns state
  useEffect(() => {
    const initialState = {};
    menuItems.forEach((item) => {
      if (item.isDropdown) {
        initialState[item.label] = isDropdownPath(item.subItems);
      }
    });
    setOpenDropdowns(initialState);
  }, [location.pathname]);

  const toggleDropdown = (dropdownLabel) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownLabel]: !prev[dropdownLabel],
    }));
  };

  return (
    <>
      {/* Mobile burger */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-white bg-navy-600"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-navy-600 text-white transition-all duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 
        ${isLargeScreenCollapsed ? "lg:w-16" : "lg:w-64"} 
        w-64 z-40`}
      >
        <div className="p-4 h-16 flex items-center justify-between border-b border-gray-600">
          {!isLargeScreenCollapsed ? (
            <div className="flex items-center gap-3">
              <img
                src={Images.Logo}
                alt="Logo"
                className="w-10 object-contain bg-white rounded-lg p-1"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold">GST</span>
                <span className="text-xs text-gray-300">
                  Global Standard for Technology
                </span>
              </div>
            </div>
          ) : (
            <img
              src={Images.Logo}
              alt="Logo"
              className="w-8 object-contain bg-white rounded-lg p-1"
            />
          )}
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-custom">
          <nav className="p-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg mb-2 transition-colors relative group
                  ${
                    location.pathname === item.path
                      ? "bg-navy-700 text-white"
                      : "hover:bg-navy-700"
                  }
                  ${isLargeScreenCollapsed ? "lg:justify-center" : "gap-3"}`}
                title={isLargeScreenCollapsed ? item.label : ""}
              >
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`transition-all duration-300 ${
                    isLargeScreenCollapsed ? "lg:hidden" : "block"
                  }`}
                >
                  {item.label}
                </span>

                {/* Tooltip for collapsed state */}
                {isLargeScreenCollapsed && (
                  <div className="hidden lg:group-hover:block absolute left-full ml-2 bg-navy-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
