import { Routes, Route } from "react-router-dom";
import Stepper from "../pages/auth/registration/Stepper";
import MembershipForm from "../pages/auth/registration/MembershipForm";
import Barcodes from "../pages/auth/registration/Barcodes";
import Payment from "../pages/auth/registration/Payment";

import Login from "../pages/auth/login/Login";
import HomePage from "../pages/home/HomePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/member-portal/login" element={<Login />} />

      <Route path="/register" element={<Stepper />}>
        <Route path="membership-form" element={<MembershipForm />} />
        <Route path="barcodes" element={<Barcodes />} />
        <Route path="payment" element={<Payment />} />
      </Route>
    </Routes>
  );
}
