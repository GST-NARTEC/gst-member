import { motion } from "framer-motion";
import { useState } from "react";
import { calculatePrice } from "../../../utils/priceCalculations";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

export default function BarcodeCalculator() {
  const [codeCount, setCodeCount] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const handleCalculatePrice = () => {
    const quantity = parseInt(codeCount);

    // Validation checks
    if (!codeCount || codeCount.trim() === "") {
      toast.error("Please enter a quantity");
      return;
    }

    if (isNaN(quantity) || quantity < 1) {
      toast.error("Please enter a valid quantity (minimum 1)");
      return;
    }

    try {
      const { totalPrice, unitPrice } = calculatePrice(quantity);
      setCalculatedPrice({ totalPrice, unitPrice, quantity });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="pt-10">
      <div className="container mx-auto  max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-5"
        >
          <h2 className="text-3xl font-bold text-center mb-8 ">
            Calculate Your Barcode Needs
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="number"
                value={codeCount}
                onChange={(e) => setCodeCount(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none text-black"
                min="1"
                placeholder="Enter quantity of barcodes needed"
              />
              <button
                onClick={handleCalculatePrice}
                className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Calculate Price
              </button>
            </div>

            {/* Price Display */}
            {calculatedPrice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 p-6 rounded-lg shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold text-primary">
                      {calculatedPrice.quantity} barcodes
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-3 text-primary">
                    <span>Total Price:</span>
                    <span className="text-primary">
                      SAR {calculatedPrice.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
