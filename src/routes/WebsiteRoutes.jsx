import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Website/home/HomePage";
import Stepper from "../pages/auth/registration/Stepper";
import MembershipForm from "../pages/auth/registration/MembershipForm";
import Barcodes from "../pages/auth/registration/Barcodes";
import Payment from "../pages/auth/registration/Payment";

export default function WebsiteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Stepper />}>
        <Route path="barcodes" element={<Barcodes />} />
        <Route path="membership-form" element={<MembershipForm />} />
        <Route path="payment" element={<Payment />} />
      </Route>
    </Routes>
  );
}
