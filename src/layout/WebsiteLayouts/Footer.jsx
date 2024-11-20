// Footer.jsx
import { motion } from "framer-motion";
import { Images } from "../../assets/Index";

export const Footer = () => {
  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "GS1 Barcodes", href: "#" },
        { name: "Amazon UPC Codes", href: "#" },
        { name: "EAN Codes", href: "#" },
        { name: "ISBN for Books", href: "#" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { name: "Retail Integration", href: "#" },
        { name: "E-commerce", href: "#" },
        { name: "Inventory Management", href: "#" },
        { name: "Global Trade", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About GST", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Partners", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Support Center", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Success Stories", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img
                src={Images.Logo}
                alt="GST Logo"
                className="h-16 bg-white rounded-md"
              />
              <span className="font-semibold text-white">
                Global Standard for Technology
              </span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white">
                Cookie Settings
              </a>
            </div>
          </div>
          <p className="text-center mt-8 text-sm">
            © {new Date().getFullYear()} Global Standard for Technology. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
