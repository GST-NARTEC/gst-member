import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login/Login";
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/member-portal/login" element={<Login />} />

      {/* Protected Member Portal Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/member-portal/dashboard" element={<Dashboard />} />
        <Route path="/member-portal/my-profile" element={<MyProfile />} />
        <Route path="/member-portal/my-barcodes" element={<MyBarcodes />} />

        <Route path="/member-portal/my-products" element={<MyProducts />} />
        <Route
          path="/member-portal/my-products/add"
          element={<AddMyProduct />}
        />
        <Route path="/member-portal/my-products/edit/:id" element={<EditMyProduct />} />

        <Route path="/member-portal/my-brands" element={<MyBrands />} />
        <Route
          path="/member-portal/gst-terms"
          element={<GSTTermsAndCondition />}
        />
        <Route path="/member-portal/billing" element={<Billing />} />
        {/* Add more protected routes here */}
        {/* <Route path="/member-portal/profile" element={<Profile />} /> */}
        {/* <Route path="/member-portal/settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}
