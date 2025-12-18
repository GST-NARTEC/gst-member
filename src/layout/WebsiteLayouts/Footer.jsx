// Footer.jsx
import { motion } from "framer-motion";
import { Images } from "../../assets/Index";
import { MdLocationOn } from "react-icons/md";

export const Footer = () => {
  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "GS1 Barcodes", href: "https://gstsa1.org" },
        { name: "Amazon UPC Codes", href: "https://gstsa1.org" },
        { name: "EAN Codes", href: "https://gstsa1.org" },
        { name: "ISBN for Books", href: "https://gstsa1.org" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { name: "Retail Integration", href: "https://gstsa1.org" },
        { name: "E-commerce", href: "https://gstsa1.org" },
        { name: "Inventory Management", href: "https://gstsa1.org" },
        { name: "Global Trade", href: "https://gstsa1.org" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About GST", href: "https://gstsa1.org" },
        { name: "Contact Us", href: "https://gstsa1.org" },
        { name: "Careers", href: "https://gstsa1.org" },
        { name: "Partners", href: "https://gstsa1.org" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "https://gstsa1.org" },
        { name: "Support Center", href: "https://gstsa1.org" },
        { name: "API Reference", href: "https://gstsa1.org" },
        { name: "Success Stories", href: "https://gstsa1.org" },
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
                      target="_blank"
                      rel="noopener noreferrer"
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
            <div className="flex items-start gap-4 flex-col ">
              <div className="flex items-center gap-4  ">
                <img
                  src={Images.Logo}
                  alt="GST Logo"
                  className="h-16 bg-white rounded-md"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">
                    Global Standard for Technology
                  </span>

                  <a
                    href="tel:+966920051091"
                    className="hover:text-white text-sm"
                  >
                    Toll Free: +966 92 005 1091
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm  ">
                <MdLocationOn className="text-2xl" />
                <div className="flex flex-col">
                  شركة المعيار العالمي للتقنيات
                  <br />
                  Short Address: RFKA4234,
                  <br />
                  Building No: 4234, Al Mateea, 7650 Al Khaleej District,
                  <br />
                  13224, Riyadh, Kingdom of Saudi Arabia
                </div>
              </div>
            </div>
            <div className="flex gap-6">
              <a
                href="https://gstsa1.org/template1/privacy-policy"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="https://gstsa1.org/template1/terms-of-service"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-gray-400">
            Empowering Smart Manufacturing: Partner & Service Provider, Future
            Factories Program | Ministry of Industry
          </p>
          <p className="text-center mt-4 text-sm">
            © {new Date().getFullYear()} Global Standard for Technology. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
