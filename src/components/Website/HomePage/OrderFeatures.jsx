import { BsCheckLg, BsImage, BsShop } from "react-icons/bs";
import { SiGooglelens } from "react-icons/si";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { Images } from "../../../assets/Index";

export default function OrderFeatures() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center mb-8 md:mb-12 text-gray-800">
        Benefits Included with Your Order
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6 lg:gap-4">
        {/* Instant Digital Delivery */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img src={Images.TransparentPricing} alt="Instant Created" />
          </div>
          <p className="text-gray-700 font-medium">
            Transparent Pricing with No Renewal Fees or Hidden Charges
          </p>
        </div>

        {/* GS1 Barcodes */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-blue-600">
            <img src={Images.PerfectForRetail} alt="GS1 Logo" className="" />
          </div>
          <p className="text-gray-700 font-medium">
            Perfect for Retail and Supply Chain Needs
          </p>
        </div>

        {/* High Resolution Formats */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img src={Images.HighQuality} alt="GS1 Logo" className="" />
          </div>
          <p className="text-gray-700 font-medium">
            Guaranteed quality of barcode
          </p>
        </div>

        {/* Retail & Online Stores */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img src={Images.GuaranteedAuthentic} alt="GS1 Logo" className="" />
          </div>
          <p className="text-gray-700 font-medium">
            Guaranteed Authentic Global Standards Barcodes
          </p>
        </div>

        {/* No Hidden Fees */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img src={Images.InstantCreated} alt="GS1 Logo" className="" />
          </div>
          <p className="text-gray-700 font-medium">
            Instant Created, Ready for Immediate Use
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6 lg:gap-4 mt-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img src={Images.OperatingDirectly} alt="Operating Directly" />
          </div>
          <p className="text-gray-700 font-medium">
            Operating Directly in Over 109 Countries and Expanding with
            Customers in 160+ Countries
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-blue-600">
            <img src={Images.GlobalBarcode} alt="GS1 Logo" className="" />
          </div>
          <p className="text-gray-700 font-medium">
            Global Barcode Registration
          </p>
        </div>

      

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img
              src={Images.BarcodeVerification}
              alt="BarcodeVerification"
              className=""
            />
          </div>
          <p className="text-gray-700 font-medium">
            Barcode Verification Report Provided
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img
              src={Images.AcceptedByRetailers}
              alt="AcceptedByRetailers"
              className=""
            />
          </div>
          <p className="text-gray-700 font-medium">
            Accepted by Retailers Worldwide
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 text-black">
            <img
              src={Images.RetailBarcodes}
              alt="RetailBarcodes"
              className=""
            />
          </div>
          <p className="text-gray-700 font-medium">
            Retail Barcodes with No Annual License Fees
          </p>
        </div>
      </div>
    </div>
  );
}
