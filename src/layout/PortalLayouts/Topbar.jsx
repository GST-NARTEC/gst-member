import { FaBars } from "react-icons/fa";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../store/slices/memberSlice";
import { useSelector } from "react-redux";
import {
  FaUserCircle,
  FaShoppingCart,
  FaQuestionCircle,
  FaSignOutAlt,
  FaHistory,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/memberSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { resetForm } from "../../store/slices/personalInfoSlice";

function Topbar({ toggleLargeScreenSidebar, isLargeScreenCollapsed }) {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(resetForm());
    navigate("/member-portal/login");
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <button
        onClick={toggleLargeScreenSidebar}
        className="hidden lg:flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
      >
        <FaBars
          className={`text-gray-600 transition-transform duration-300 
          ${isLargeScreenCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      <div className="flex items-center gap-4">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              size="sm"
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={currentUser.companyNameEn}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{currentUser.email}</p>
            </DropdownItem>
            <DropdownItem
              startContent={<FaUserCircle className="text-lg" />}
              key="my_profile"
              onClick={() => navigate("/member-portal/my-profile")}
            >
              Profile
            </DropdownItem>
            {/* buy barcodes */}
            <DropdownItem
              onClick={() => navigate("/member-portal/my-barcodes/buy")}
              startContent={<FaShoppingCart className="text-lg" />}
              key="buy_barcodes"
            >
              Buy Barcodes
            </DropdownItem>
            <DropdownItem
              onClick={() => navigate("/member-portal/my-orders")}
              startContent={<FaHistory className="text-lg" />}
              key="my_orders"
            >
              My Orders
            </DropdownItem>
            <DropdownItem
              startContent={<FaQuestionCircle className="text-lg" />}
              key="help_disk"
              onClick={() => navigate("/member-portal/help-support")}
            >
              Help Disk
            </DropdownItem>
            <DropdownItem
              className="text-red-500"
              startContent={<FaSignOutAlt className="text-red-500 text-lg" />}
              key="logout"
              color="danger"
              onClick={handleLogout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Topbar;
