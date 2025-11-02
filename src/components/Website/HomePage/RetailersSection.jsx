import { Images } from "../../../assets/Index";

export default function RetailersSection() {
  const retailers = [
    {
      name: "Amazon",
      logo: Images.Amazon,
    },
    {
      name: "Walmart",
      logo: Images.Walmart,
    },
    {
      name: "Danube",
      logo: Images.Danube,
    },
    {
      name: "Carrefour",
      logo: Images.Carrefour,
    },
    {
      name: "Tamimi Markets",
      logo: Images.TamimiMarkets,
    },
    {
      name: "SPAR",
      logo: Images.SparLogo,
    },
    {
      name: "Nestle",
      logo: Images.NestoLogo,
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight md:leading-tight lg:leading-tight capitalize">
            Thousands of satisfied clients worldwide and more than twenty years
            of experience in offering solutions and services
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mt-6">
            Our Global Standards Barcodes Power Retailers Worldwide Across the
            Supply Chain!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 items-center justify-items-center">
          {retailers.map((retailer) => (
            <div
              key={retailer.name}
              className="w-full max-w-[160px] transition-transform hover:scale-105"
            >
              <div className="relative aspect-3/2">
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
