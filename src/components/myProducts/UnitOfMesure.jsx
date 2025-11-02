import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useGetUnitOfMesurmentQuery } from "../../store/apis/endpoints/unitOfMesurment";

function UnitOfMeasure({ value, onChange }) {
  const { data, isLoading } = useGetUnitOfMesurmentQuery();

  // Transform API data to match the required format
  const measurementUnits =
    data?.data?.map((unit) => ({
      label: unit.name,
      value: unit.name,
      // description: `Code: ${unit.code}`,
    })) || [];

  return (
    <Autocomplete
      label="Unit of Measure"
      placeholder="Select unit of measure"
      defaultItems={measurementUnits}
      selectedKey={value}
      onSelectionChange={(value) => onChange(value)}
      isLoading={isLoading}
    >
      {(item) => (
        <AutocompleteItem key={item.value} textValue={item.label}>
          <div className="flex flex-col">
            <span>{item.label}</span>
            {/* <span className="text-small text-default-400"> */}
              {/* {item.description} */}
            {/* </span> */}
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

export default UnitOfMeasure;
