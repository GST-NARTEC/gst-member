import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import ForgetPassword from "../pages/auth/Login/ForgetPassword";
import OtpVerify from "../pages/auth/Login/OtpVerify";
import ResetPassword from "../pages/auth/Login/ResetPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "../components/security/ProtectedRoute";
import MyProfile from "../pages/myProfile/MyProfile";
import MyBarcodes from "../pages/myBarcodes/MyBarcodes";
import MyProducts from "../pages/myProducts/MyProducts";
import MyBrands from "../pages/myBrands/MyBrands";
import GSTTermsAndCondition from "../pages/gstTermsAndCondition/GSTTermsAndCondition";
import Billing from "../pages/myBilling/Billing";
import AddMyProduct from "../pages/myProducts/AddMyProduct";
import EditMyProduct from "../pages/myProducts/EditMyProduct";
import DigitalLink from "../pages/myProducts/digitalLink/DigitalLink";
import Barcodes from "../pages/myBarcodes/BuyBarcodes/Barcodes";
import Payment from "../pages/myBarcodes/BuyBarcodes/Payment";
import HelpAndSupport from "../pages/helpDisk/HelpAndSupport";
import MyOrders from "../pages/myOrders/MyOrders";
import GLNLocation from "../pages/glnLocation/GLNLocation";
import AddGLNLocation from "../pages/glnLocation/AddGLNLocation";
import EditGLNLocation from "../pages/glnLocation/EditGLNLocation";
import PaymentResponse from "../pages/myBarcodes/BuyBarcodes/PayOnline/PaymentResponse";
import UserGuides from "../pages/userGuides/UserGuides";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/member-portal/login" element={<Login />} />
      <Route
        path="/member-portal/forget-password"
        element={<ForgetPassword />}
      />
      <Route path="/member-portal/verify-otp" element={<OtpVerify />} />
      <Route path="/member-portal/reset-password" element={<ResetPassword />} />

      {/* Protected Member Portal Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/member-portal/dashboard" element={<Dashboard />} />
        <Route path="/member-portal/my-profile" element={<MyProfile />} />
        <Route path="/member-portal/my-barcodes" element={<MyBarcodes />} />
        <Route path="/member-portal/my-barcodes/buy" element={<Barcodes />} />

        <Route
          path="/member-portal/my-barcodes/buy/payment"
          element={<Payment />}
        />

        {/* gln location */}
        <Route path="/member-portal/gln-location" element={<GLNLocation />} />
        <Route
          path="/member-portal/gln-location/add"
          element={<AddGLNLocation />}
        />
        <Route
          path="/member-portal/gln-location/edit/:id"
          element={<EditGLNLocation />}
        />

        {/* products */}
        <Route path="/member-portal/my-products" element={<MyProducts />} />
        <Route
          path="/member-portal/my-products/add"
          element={<AddMyProduct />}
        />
        <Route
          path="/member-portal/my-products/edit/:id"
          element={<EditMyProduct />}
        />

        <Route path="/member-portal/my-brands" element={<MyBrands />} />
        <Route
          path="/member-portal/gst-terms"
          element={<GSTTermsAndCondition />}
        />
        <Route
          path="/member-portal/user-guides"
          element={<UserGuides />}
        />
        <Route path="/member-portal/billing" element={<Billing />} />
        <Route
          path="/member-portal/my-products/digital-link/:id"
          element={<DigitalLink />}
        />
        <Route
          path="/member-portal/help-support"
          element={<HelpAndSupport />}
        />
        <Route path="/member-portal/my-orders" element={<MyOrders />} />

        {/* payment response */}
        <Route
          path="/member-portal/payment/success"
          element={<PaymentResponse />}
        />
      </Route>
    </Routes>
  );
}
