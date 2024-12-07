export default function RetailersSection() {
  const retailers = [
    {
      name: "Newegg",
      logo: "https://upcs.com/wp-content/uploads/2020/10/home-bann-newegg2.png",
    },
    {
      name: "Sears",
      logo: "https://upcs.com/wp-content/uploads/2020/10/home-bann-sears2.png",
    },
    {
      name: "iTunes",
      logo: "https://upcs.com/wp-content/uploads/2020/10/home-bann-itunes2.png",
    },
    {
      name: "Buy.com",
      logo: "https://upcs.com/wp-content/uploads/2020/10/home-bann-buycom2.png",
    },
    {
      name: "eBay",
      logo: "https://upcs.com/wp-content/uploads/2020/10/home-bann-ebay2.png",
    },
    {
      name: "Amazon",
      logo: "https://upcs.com/wp-content/uploads/2020/10/home-bann-amazon2.png",
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            20+ YEARS, 150,000+ HAPPY CUSTOMERS,{" "}
            <span className="relative">
              WORLDWIDE!
              {/* <span className="absolute  bottom-0 left-0 w-full h-1 bg-black transform -translate-y-2"></span> */}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mt-6">
            Our Barcodes Work at Retailers Worldwide Including:
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {retailers.map((retailer) => (
            <div
              key={retailer.name}
              className="w-full max-w-[160px] transition-transform hover:scale-105"
            >
              <div className="relative aspect-[3/2]">
                <img
                  src={retailer.logo}
                  alt={`${retailer.name} logo`}
                  className="object-contain w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
