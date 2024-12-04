import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItemAddons } from "../../../store/slices/cartSlice";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
} from "@nextui-org/react";
import { FaMinus, FaPlus } from "react-icons/fa";

function Addons({
  isOpen,
  onOpenChange,
  selectedItem,
  selectedItemIndex,
  currencySymbol,
}) {
  const dispatch = useDispatch();
  const [localAddons, setLocalAddons] = React.useState({});

  React.useEffect(() => {
    if (selectedItem) {
      const initialState = (selectedItem.selectedAddons || []).reduce(
        (acc, addon) => ({
          ...acc,
          [addon.id]: { quantity: addon.quantity || 1 },
        }),
        {}
      );
      setLocalAddons(initialState);
    } else {
      setLocalAddons({});
    }
  }, [selectedItem?.id]);

  const handleAddonChange = (addon, isChecked) => {
    setLocalAddons((prev) => ({
      ...prev,
      [addon.id]: isChecked ? { quantity: 1 } : undefined,
    }));
  };

  const handleQuantityChange = (addon, change) => {
    setLocalAddons((prev) => ({
      ...prev,
      [addon.id]: {
        quantity: Math.max(1, (prev[addon.id]?.quantity || 0) + change),
      },
    }));
  };

  const handleSubmit = (onClose) => {
    const updatedAddons = Object.entries(localAddons)
      .filter(([_, value]) => value !== undefined)
      .map(([id, value]) => ({
        ...selectedItem.addons.find((a) => a.id === id),
        quantity: value.quantity,
      }));

    dispatch(
      updateCartItemAddons({
        index: selectedItemIndex,
        selectedAddons: updatedAddons,
      })
    );
    onClose();
  };

  if (!selectedItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      placement="center"
      classNames={{
        base: "max-w-md mx-auto",
        closeButton: "top-3 right-3",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold">
                Select Addons for {selectedItem.title}
              </h2>
            </ModalHeader>
            <ModalBody className="p-6 gap-4">
              {selectedItem.addons.map((addon) => (
                <div
                  key={addon.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        isSelected={!!localAddons[addon.id]}
                        onValueChange={(isChecked) =>
                          handleAddonChange(addon, isChecked)
                        }
                        size="lg"
                      />
                      <div>
                        <p className="font-medium text-gray-700">
                          {addon.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ({addon.unit}) - {currencySymbol}
                          {addon.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {localAddons[addon.id] && (
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-l-full transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuantityChange(addon, -1);
                          }}
                        >
                          <FaMinus size={12} className="text-gray-600" />
                        </button>
                        <span className="px-4 font-medium text-gray-700">
                          {localAddons[addon.id].quantity}
                        </span>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-r-full transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuantityChange(addon, 1);
                          }}
                        >
                          <FaPlus size={12} className="text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ModalBody>
            <ModalFooter className="border-t border-gray-200 p-6">
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => handleSubmit(onClose)}
                className="bg-navy-600 text-white"
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default Addons;
