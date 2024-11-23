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

export default function HomePage() {
  const [codeCount, setCodeCount] = useState("");

  const features = [
    {
      icon: Shield,
      title: "GS1 Certified",
      desc: "Official member & authorized reseller of GS1 barcodes",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      desc: "Get your codes within minutes after purchase",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Globe2,
      title: "Global Acceptance",
      desc: "Valid worldwide across all major retailers",
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Award,
      title: "Lifetime Validity",
      desc: "One-time purchase, yours forever",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const stats = [
    { number: "20+", label: "Years Experience" },
    { number: "150K+", label: "Happy Customers" },
    { number: "99.9%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <Layout>
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary min-h-[90vh] flex items-center">
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
            <p className="text-xl md:text-2xl text-gray-300 mb-12">
              Empower your business with globally recognized barcodes and
              digital solutions
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose GST?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry-leading solutions backed by years of expertise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${feature.color} rounded-xl p-6 hover:shadow-lg transition-shadow`}
              >
                <feature.icon
                  className={`w-12 h-12 ${feature.iconColor} mb-4`}
                />
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using GST for their digital identity
              needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
