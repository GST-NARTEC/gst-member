import React from "react";
import {
  Star,
  MapPin,
  ShoppingCart,
  Package2,
  Info,
  Tag,
  Scale,
  Calendar,
} from "lucide-react";

function BarcodeLookup({ data }) {
  const product = data?.products?.[0];
  if (!product) return null;

  const renderRating = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < parseInt(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-white/80">Barcode: {product.barcode_number}</p>
          {product.brand && (
            <p className="text-white/80 mt-2">Brand: {product.brand}</p>
          )}
        </div>
      </div>

      {/* Product Images and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-[400px] object-contain"
              />
            </div>
          ) : (
            <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
              <Package2 className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-primary">
                Product Details
              </h2>
            </div>
            <div className="space-y-3">
              {product.manufacturer && (
                <p>
                  <span className="font-semibold">Manufacturer:</span>{" "}
                  {product.manufacturer}
                </p>
              )}
              {product.model && (
                <p>
                  <span className="font-semibold">Model:</span> {product.model}
                </p>
              )}
              {product.mpn && (
                <p>
                  <span className="font-semibold">MPN:</span> {product.mpn}
                </p>
              )}
              {product.category && (
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category}
                </p>
              )}
            </div>
          </div>

          {/* Specifications Card */}
          {(product.color ||
            product.size ||
            product.material ||
            product.gender) && (
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-primary">
                  Specifications
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {product.color && (
                  <p>
                    <span className="font-semibold">Color:</span>{" "}
                    {product.color}
                  </p>
                )}
                {product.size && (
                  <p>
                    <span className="font-semibold">Size:</span> {product.size}
                  </p>
                )}
                {product.material && (
                  <p>
                    <span className="font-semibold">Material:</span>{" "}
                    {product.material}
                  </p>
                )}
                {product.gender && (
                  <p>
                    <span className="font-semibold">Gender:</span>{" "}
                    {product.gender}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Dimensions Card */}
          {(product.weight ||
            product.length ||
            product.width ||
            product.height) && (
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-primary">
                  Dimensions
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <p>
                    <span className="font-semibold">Weight:</span>{" "}
                    {product.weight}
                  </p>
                )}
                {product.length && (
                  <p>
                    <span className="font-semibold">Length:</span>{" "}
                    {product.length}
                  </p>
                )}
                {product.width && (
                  <p>
                    <span className="font-semibold">Width:</span>{" "}
                    {product.width}
                  </p>
                )}
                {product.height && (
                  <p>
                    <span className="font-semibold">Height:</span>{" "}
                    {product.height}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description and Features */}
      {(product.description ||
        (product.features && product.features.length > 0)) && (
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-primary mb-3">
                Description
              </h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
          {product.features && product.features.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">
                Features
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Store Availability */}
      {product.stores && product.stores.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Available Stores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.stores.map((store, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{store.name}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Price:</span>{" "}
                    {store.currency_symbol}
                    {store.price}
                  </p>
                  {store.sale_price && (
                    <p className="text-green-600">
                      <span className="font-medium">Sale:</span>{" "}
                      {store.currency_symbol}
                      {store.sale_price}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        store.availability === "in stock"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {store.availability}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Customer Reviews
            </h2>
          </div>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="border-b last:border-b-0 pb-4 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  {renderRating(review.rating)}
                </div>
                <h3 className="font-semibold mb-1">{review.title}</h3>
                <p className="text-gray-700 mb-2">{review.review}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{review.name}</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BarcodeLookup;
