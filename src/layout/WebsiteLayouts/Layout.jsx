import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import WhatsAppWidget from "../../components/WhatsAppWidget";

function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

export default Layout;
