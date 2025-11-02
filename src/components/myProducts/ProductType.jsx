import React from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useGetProductTypesQuery } from "../../store/apis/endpoints/userProducts";

function ProductType({ value, onChange }) {
  const { data: productTypesResponse, isLoading } = useGetProductTypesQuery();

  const productTypes =
    productTypesResponse?.data?.map((type) => ({
      label: type.nameEn,
      value: type.nameEn,
    })) || [];

  return (
    <Autocomplete
      label="Product Type"
      placeholder="Select product type"
      defaultItems={productTypes}
      selectedKey={value}
      onSelectionChange={(value) => onChange(value)}
      isLoading={isLoading}
    >
      {(item) => (
        <AutocompleteItem key={item.value} textValue={item.label}>
          <div className="flex flex-col">
            <span>{item.label}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

export default ProductType;
