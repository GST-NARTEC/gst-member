import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useGetPackagingTypesQuery } from "../../store/apis/endpoints/userProducts";

function PackagingType({ value, onChange }) {
  const { data: packagingTypesResponse, isLoading } =
    useGetPackagingTypesQuery();

  const packagingTypes =
    packagingTypesResponse?.data?.map((type) => ({
      label: type.nameEn,
      value: type.nameEn,
    })) || [];

  return (
    <Autocomplete
      label="Packaging Type"
      placeholder="Select packaging type"
      defaultItems={packagingTypes}
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

export default PackagingType;
