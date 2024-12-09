// HomePage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Barcode,
  CheckCircle,
  Globe2,
  ShoppingCart,
  Star,
  Shield,
  Zap,
  Award,
} from "lucide-react";
import Layout from "../../../layout/WebsiteLayouts/Layout";
import Services from "../../../components/Website/HomePage/Services";
import { useNavigate } from "react-router-dom";
import OrderFeatures from "../../../components/Website/HomePage/OrderFeatures";
import RetailersSection from "../../../components/Website/HomePage/RetailersSection";

export default function HomePage() {
  const [codeCount, setCodeCount] = useState("");
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary max-h-[80vh] flex items-center ">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Global Standard for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Digital Identity
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              Empower your business with globally recognized barcodes and
              digital solutions
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search a barcode by name or code"
                  className="w-full px-6 py-3 text-gray-900 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/30 shadow-lg"
                />
                <button
                  onClick={() => navigate("/search")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
                >
                  <Barcode className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <OrderFeatures />
      <RetailersSection />
      <Services />

      {/* Calculator Section with Glass Effect */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Calculate Your Barcode Needs
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="number"
                value={codeCount}
                onChange={(e) => setCodeCount(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Enter quantity of barcodes needed"
              />
              <button className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Calculate Price
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Buy Barcodes?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using GST for their digital identity
              needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Buy Barcodes Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
