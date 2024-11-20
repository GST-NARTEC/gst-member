import { useState, useEffect } from "react";
import {
  FaTimes,
  FaBars,
  FaChartLine,
  FaBox,
  FaList,
  FaCog,
  FaAngleLeft,
  FaUsers,
  FaLanguage,
  FaUserShield,
  FaDatabase,
  FaAngleDown,
  FaEnvelope,
  FaRuler,
  FaFile,
  FaBoxes,
  FaCloud,
  FaGlobe,
  FaBarcode,
  FaUncharted,
  FaCity,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { Images } from "../../assets";
import { MdEmail } from "react-icons/md";

function Sidebar({ isOpen, toggleSidebar, isLargeScreenCollapsed }) {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    { path: "/", icon: <FaChartLine />, label: "Dashboard" },
    { path: "/members", icon: <FaUsers />, label: "Members" },
    {
      label: "Master Data",
      icon: <FaDatabase />,
      isDropdown: true,
      subItems: [
        { path: "/master/users", icon: <FaUsers />, label: "Users" },
        {
          path: "/master/email-settings",
          icon: <MdEmail />,
          label: "Email Settings",
        },
        { path: "/master/roles", icon: <FaUserShield />, label: "Roles" },
        { path: "/master/units", icon: <FaRuler />, label: "Units" },
        { path: "/master/language", icon: <FaLanguage />, label: "Language" },
        { path: "/master/documents", icon: <FaFile />, label: "Documents" },
        {
          path: "/master/product-packaging",
          icon: <FaBox />,
          label: "Product Packaging",
        },
        {
          path: "/master/other-products",
          icon: <FaBoxes />,
          label: "Other Products",
        },
        { path: "/master/gcp-type", icon: <FaCloud />, label: "Gcp Type" },
        {
          path: "/master/country-of-sales",
          icon: <FaGlobe />,
          label: "Country Of Sales",
        },
        { path: "/master/hs-code", icon: <FaBarcode />, label: "Hs Code" },
        { path: "/master/unspcs", icon: <FaUncharted />, label: "UNSPCS" },
        { path: "/master/cities", icon: <FaCity />, label: "Cities" },
      ],
    },
    { path: "/categories", icon: <FaList />, label: "Categories" },
    { path: "/products", icon: <FaBox />, label: "Products" },
    { path: "/languages", icon: <FaLanguage />, label: "Languages" },
    { path: "/roles", icon: <FaUserShield />, label: "User Roles" },
    { path: "/settings", icon: <FaCog />, label: "Settings" },
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
            {menuItems.map((item) =>
              item.isDropdown ? (
                <div key={item.label}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`w-full flex items-center p-3 rounded-lg mb-2 transition-colors relative group
                      ${isLargeScreenCollapsed ? "lg:justify-center" : "gap-3"}
                      hover:bg-navy-700`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span
                      className={`transition-all duration-300 ${
                        isLargeScreenCollapsed ? "lg:hidden" : "block"
                      }`}
                    >
                      {item.label}
                    </span>
                    <FaAngleDown
                      className={`ml-auto transition-transform 
                      ${openDropdowns[item.label] ? "rotate-180" : ""} 
                      ${isLargeScreenCollapsed ? "lg:hidden" : "block"}`}
                    />

                    {/* Tooltip for collapsed state */}
                    {isLargeScreenCollapsed && (
                      <div className="hidden lg:group-hover:block absolute left-full ml-2 bg-navy-800 text-white px-2 py-1 rounded whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </button>

                  {openDropdowns[item.label] && (
                    <div
                      className={`${
                        isLargeScreenCollapsed
                          ? "lg:absolute lg:left-full lg:ml-2 lg:top-0 lg:mt-10 lg:bg-navy-800 lg:rounded-lg lg:p-2"
                          : "ml-4"
                      }`}
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center p-2 rounded-lg mb-1 transition-colors whitespace-nowrap
                            ${
                              location.pathname === subItem.path
                                ? "bg-navy-700 text-white"
                                : "hover:bg-navy-700"
                            }
                            ${isLargeScreenCollapsed ? "lg:px-4" : "gap-3"}`}
                        >
                          <span className="text-xl">{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
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
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
