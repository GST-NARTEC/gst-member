import React from "react";
import { Link } from "react-router-dom";
import { Images } from "../../../assets/Index";

function Services() {
  const services = [
    {
      title: "UPC Barcodes",
      image: Images.UPCBarcode,
    },
    {
      title: "Amazon UPC Codes",
      image: Images.AmazonUPC,
    },
    {
      title: "Printed Labels",
      image:
        "https://upcs.com/wp-content/uploads/2023/07/barcode-label-clipart.svg",
    },
    {
      title: "EAN Codes",
      image: Images.EANBarcode,
    },
    {
      title: "ISBN Codes for Books",
      image: Images.ISBNBarcode,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Services Offered
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Get everything you need for your product identification and tracking
          needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="aspect-[4/3] relative bg-blue-50">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl text-center font-semibold text-blue-700 hover:text-blue-800">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                What are UPC Codes?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Universal Product Codes are a vital part of nearly all the
                products you see on shelves of all the stores you've been in, as
                well as all the products you see sold online. It is important
                when your business purchases Universal Product Codes that you
                buy from a reputable seller online to prevent issues in the
                future. UPCs are 12 digits long and are converted to barcodes
                which can be easily scanned to manage product inventory.
              </p>
              <Link
                to="/upc-guide"
                className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Read more on UPCs Guide
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                What is a Barcode?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Barcodes are the little black lines above the 12 digit number
                that you see on all products worldwide. The black lines
                represent the unique product code and allow scanners to easily
                recognize the product and allow vendors to easily scan inventory
                in and out and keep track of stock levels at the point of sale.
                With each order from SnapUPC, you will receive the 12 digit
                universal product code along with the barcode for each code you
                order. These can be used immediately and you can setup your
                product information with your UPC at any retailer worldwide.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                What is a GTIN 12 number?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A GTIN is a Global Trade Identification Number which the GS1
                calls 12 digit UPCs. A UPC is a GTIN and they are the same
                number, simply a different name of describing the unique
                identifier of each product.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Can I Print Barcode Labels?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes, we offer a print & ship service for USA customers. After we
                issue your barcodes to you, you can either print them yourself
                at home, or order our print service on our Printed Barcode
                Labels page. With this service you can customize your barcode
                and optional text, and we will print and ship it to your
                address. Orders arrive within 3-5 business days and typically
                ship same day.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Who are we?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                UPCs.com is one of the oldest and largest sellers of UPC Codes
                online and we take pride in helping businesses worldwide secure
                UPC Barcodes for their products. To date, we've helped well over
                150,000 businesses sell more than 10 million products worldwide.
                We make the ordering process easy and provide technical customer
                support for any issues that may arise.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Why buy Universal Product Codes at UPCs.com?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The GS1 issues all prefixes for UPCs, and to register a prefix
                costs a minimum of $250 and costs $150 a year to renew the
                codes. Because we've owned prefixes before the UCC/GS1
                Settlement and because we purchase prefixes in bulk, we're able
                to offer UPC codes for far cheaper than the GS1 and are not
                required to pay any renewal fees.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                How many UPC codes do I need?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Universal product codes are used to identify products with a
                unique 12 digit number, and then enable them to be scanned in
                and out of inventory. Every unique product needs a unique
                product code. For example, if you're selling T-Shirts, each
                unique Color will need a unique UPC. If you have 20 Black, 20
                White, and 20 Green for sale, you'll need 3 unique universal
                product codes, 1 for each unique Color.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                What is the GS1?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The GS1 (formerly the UCC) is a company that rents prefixes to
                companies. In most cases, you aren't required to own a prefix,
                so you can use UPCs without purchasing an expensive prefix from
                the GS1. Because the GS1 rents the global standard UPC, it is
                not possible to generate barcodes without having a prefix.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Services;
