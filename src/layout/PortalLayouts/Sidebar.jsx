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
  FaBook,
  FaHandshake,
  FaSignOutAlt,
  FaBoxes,
  FaShoppingCart,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { Images } from "../../assets/Index";
import { MdEmail } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/memberSlice";
import { clearCart } from "../../store/slices/cartSlice";

function Sidebar({ isOpen, toggleSidebar, isLargeScreenCollapsed }) {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  };

  const menuItems = [
    {
      path: "/member-portal/dashboard",
      icon: <FaChartLine />,
      label: "Products KPI",
    },
    {
      path: "/member-portal/my-profile",
      icon: <FaUser />,
      label: "My Account",
    },
    {
      path: "/member-portal/my-barcodes",
      icon: <FaBarcode />,
      label: "Purchased Barcodes",
    },
    {
      path: "/member-portal/my-products",
      icon: <FaBoxes />,
      label: "Products",
    },
    {
      path: "/member-portal/gln-location",
      icon: <FaMapMarkerAlt />,
      label: "Barcode for Location",
    },
    {
      path: "/member-portal/my-brands",
      icon: <FaTrademark />,
      label: "Brand Master",
    },
    {
      path: "/member-portal/billing",
      icon: <FaFileInvoiceDollar />,
      label: "Documents",
    },
    {
      path: "/member-portal/my-orders",
      icon: <FaShoppingCart />,
      label: "My Orders",
    },
    {
      path: "/member-portal/help-support",
      icon: <FaQuestionCircle />,
      label: "My Assistant",
    },
    {
      path: "/member-portal/gst-terms",
      icon: <FaFileContract />,
      label: "Terms and Conditions",
    },
    {
      path: "/member-portal/user-guides",
      icon: <FaBook />,
      label: "User Guides",
    },
    // {
    //   // path: "/member-portal/data-policy",
    //   icon: <FaFileAlt />,
    //   label: "Data Declaration Policy",
    // },
    // {
    //   // path: "/member-portal/contract",
    //   icon: <FaHandshake />,
    //   label: "My GST Contract",
    // },
    {
      // path: "/logout",
      icon: <FaSignOutAlt />,
      label: "Log-Out",
      onClick: handleLogout,
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
        <div className="p-2 h-20 flex items-center justify-center border-b border-gray-600">
          {!isLargeScreenCollapsed ? (
            <img
              src={Images.Logo}
              alt="Logo"
              className="h-16 max-w-[220px] w-full object-contain bg-white rounded-lg p-1"
            />
          ) : (
            <img
              src={Images.Logo}
              alt="Logo"
              className="h-12 w-12 object-contain bg-white rounded-lg p-1"
            />
          )}
        </div>

        <div className="h-[calc(100vh-5rem)] overflow-y-auto scrollbar-custom">
          <nav className="p-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.onClick}
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
