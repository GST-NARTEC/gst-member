// Header.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Images } from "../../assets/Index";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Products",
      href: "#",
      submenu: [
        { name: "GS1 Barcodes", href: "#" },
        { name: "Amazon UPC Codes", href: "#" },
        { name: "EAN Codes", href: "#" },
        { name: "ISBN for Books", href: "#" },
        { name: "Barcodes for Pallets", href: "#" },
        { name: "Barcodes for Boxes/Carton", href: "#" },
        { name: "QRCode for Retail Items", href: "#" },
      ],
    },
    {
      name: "Solutions",
      href: "#",
      submenu: [
        { name: "Retail Solutions", href: "#" },
        { name: "E-commerce Integration", href: "#" },
        { name: "Inventory Management", href: "#" },
      ],
    },
    { name: "Resources", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b border-gray-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Global Standard for Technology
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/member-portal/login"
              className="text-primary hover:text-primary/80"
            >
              Member Portal
            </Link>
            <a href="/support" className="text-gray-600 hover:text-gray-800">
              Support
            </a>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <img src={Images.Logo} alt="GST Logo" className="h-16" />
            <span className="font-bold text-xl text-gray-900">GST</span>
            <img src={Images.Upcs} alt="Upcs Logo" className="h-10 ml-4" />
          </motion.div>

          <nav className="hidden lg:flex items-center gap-8 z-50">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-gray-700 hover:text-primary py-2"
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="w-4 h-4" />}
                </a>
                {item.submenu && (
                  <div className="absolute top-full z-10 left-0 w-48 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.submenu.map((subitem) => (
                      <a
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {subitem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => navigate("/member-portal/login")}
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register/barcodes")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Buy Barcodes
            </button>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};
