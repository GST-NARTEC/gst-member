"use client";

import { BsCheckLg, BsImage, BsShop } from "react-icons/bs";
import { SiGooglelens } from "react-icons/si";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

export default function OrderFeatures() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center mb-8 md:mb-12 text-gray-800">
        What&apos;s Included with Your Order
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6 lg:gap-4">
        {/* Instant Digital Delivery */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <BsCheckLg className="w-10 h-10" />
          </div>
          <p className="text-gray-700 font-medium">
            Instant Digital Delivery, Ready to Use Immediately
          </p>
        </div>

        {/* GS1 Barcodes */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-blue-600">
            <img src="https://upcs.com/wp-content/uploads/2023/07/Logo_GS1.svg" alt="GS1 Logo" className="" />
          </div>
          <p className="text-gray-700 font-medium">
            100% Authentic GS1 Barcodes
          </p>
        </div>

        {/* High Resolution Formats */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <BsImage className="w-10 h-10" />
          </div>
          <p className="text-gray-700 font-medium">
            High Resolution PNG, JPG, TIFF, and PDF Included (with Any Other
            Format Available)
          </p>
        </div>

        {/* Retail & Online Stores */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <BsShop className="w-10 h-10" />
          </div>
          <p className="text-gray-700 font-medium">
            Perfect for Retail & Online Stores
          </p>
        </div>

        {/* No Hidden Fees */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <RiMoneyDollarCircleLine className="w-10 h-10" />
          </div>
          <p className="text-gray-700 font-medium">
            No Renewal Fees or Hidden Charges
          </p>
        </div>
      </div>
    </div>
  );
}
