import React from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useGetActiveBrandsQuery } from "../../store/apis/endpoints/brands";

function MyBrands({ value, onChange }) {
  const { data: brandsResponse, isLoading } = useGetActiveBrandsQuery();

  const formattedBrands = brandsResponse?.data?.brands?.map(brand => ({
    label: brand.nameEn,
    value: brand.nameEn,
  })) || [];

  return (
    <Autocomplete
      label="Brand Name"
      placeholder="Select brand name"
      defaultItems={formattedBrands}
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

export default MyBrands;
