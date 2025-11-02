import React, { useState } from "react";
import {
  Card,
  Button,
  Image,
  Skeleton,
  Input,
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { MdSearch } from "react-icons/md";

import { useSelector, useDispatch } from "react-redux";
import { selectCurrencySymbol } from "../../../store/slices/currencySymbolSlice";
import { useDebounce } from "../../../hooks/useDebounce";

// api
import { useGetActiveProductsQuery } from "../../../store/apis/endpoints/products";
import { useGetTaxQuery } from "../../../store/apis/endpoints/tax";

// Redux
import { addToCart } from "../../../store/slices/cartSlice";

import Cart from "../../../components/auth/registration/Cart";

function Barcodes() {
  const dispatch = useDispatch();
  const currencySymbol = useSelector(selectCurrencySymbol);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 9; // Items per page

  const debouncedSearch = useDebounce(search, 500);

  const { data: productsData, isLoading: isProductsLoading } =
    useGetActiveProductsQuery({
      page,
      limit,
      search: debouncedSearch,
    });

  const { data: taxData, isLoading: isTaxLoading } = useGetTaxQuery();

  const defaultImage =
    "https://www.sagedata.com/images/2007/Code_128_Barcode_Graphic.jpg";

  const addItemToCart = (product) => {
    console.log(product);
    dispatch(addToCart(product));
  };

  const vatDetails = taxData?.data?.vats?.[0] || {
    value: 0,
    type: "PERCENTAGE",
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation and search */}
      <div className="mb-4 flex justify-between items-center">
        {/* Add search input */}
        <div className="w-72">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            startContent={<MdSearch className="text-gray-400" />}
            className="w-full"
            isClearable
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Grid */}
        <div className="flex-1">
          {isProductsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="p-4 shadow-md">
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="w-32 h-24 rounded-lg mb-3" />
                    <Skeleton className="w-3/4 h-4 rounded-lg mb-1" />
                    <Skeleton className="w-full h-8 rounded-lg mb-2" />
                    <Skeleton className="w-20 h-4 rounded-lg mb-3" />
                    <Skeleton className="w-full h-8 rounded-lg" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-['50%']">
                {productsData?.data?.products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-2 shadow-md hover:shadow-md transition-shadow h-full"
                  >
                    <div className="flex flex-col items-center text-center h-full">
                      <div className="w-full aspect-[4/3] relative mb-3">
                        <Popover showArrow placement="bottom">
                          <PopoverTrigger>
                            <Image
                              src={product.image || defaultImage}
                              alt={product.title}
                              className="w-full h-full object-contain cursor-pointer hover:opacity-80"
                            />
                          </PopoverTrigger>
                          <PopoverContent className="p-2">
                            <Image
                              src={product.image || defaultImage}
                              alt={product.title}
                              className="w-80 h-60 object-contain"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <h3 className="text-base font-bold mb-2 min-h-[2.5rem] line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-gray-500 text-[15px] ">
                        Usage: {product.description}
                      </p>

                      <div className="w-full mt-auto pt-4">
                        <Button
                          className="w-full bg-[#1B365C] hover:bg-[#152a4a] text-white rounded-md py-2 px-4 font-medium"
                          onClick={() => addItemToCart(product)}
                          isLoading={isProductsLoading}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Updated pagination using API response structure */}
              {productsData?.data?.pagination && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    total={productsData?.data?.pagination?.totalPages}
                    page={page}
                    onChange={setPage}
                    showControls
                    classNames={{
                      wrapper: "gap-2",
                      item: "w-8 h-8",
                      cursor: "bg-navy-600 text-white font-medium",
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Cart section */}
        <div className="w-full lg:w-[350px] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <Cart
            currencySymbol={currencySymbol}
            vatDetails={vatDetails}
            defaultImage={defaultImage}
          />
        </div>
      </div>
    </div>
  );
}

export default Barcodes;
