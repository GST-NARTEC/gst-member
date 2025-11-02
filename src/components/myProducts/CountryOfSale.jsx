import React from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useGetCountryOfOriginSaleQuery } from "../../store/apis/endpoints/userProducts";

function CountryOfSale({ value, onChange }) {
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetCountryOfOriginSaleQuery();

  const countries =
    countriesResponse?.data?.map((country) => ({
      label: country.name,
      value: country.name,
    })) || [];

  return (
    <Autocomplete
      label="Country of Sale"
      placeholder="Select country of sale"
      defaultItems={countries}
      selectedKey={value}
      onSelectionChange={(value) => onChange(value)}
      isLoading={isLoadingCountries}
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

export default CountryOfSale;
