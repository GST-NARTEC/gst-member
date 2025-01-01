import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const locationTypes = [
  {
    id: 1,
    name: "Corporate Headquaters",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path fill="currentColor" d="M12,3L2,12h3v8h6v-6h2v6h6v-8h3L12,3z" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Distribution centre",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M17,10.5V7c0-0.55-0.45-1-1-1H4c-0.55,0-1,0.45-1,1v10c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1v-3.5l4,4v-11L17,10.5z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Factory",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M12,7V3H2v18h20V7H12z M10,19H4v-2h6V19z M10,15H4v-2h6V15z M10,11H4V9h6V11z M10,7H4V5h6V7z M20,19h-8v-2h8V19z M20,15h-8v-2h8V15z M20,11h-8V9h8V11z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    name: "Grocery store",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
        />
      </svg>
    ),
  },
  {
    id: 5,
    name: "Dock door",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M19,3H5C3.89,3,3,3.89,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.89,20.1,3,19,3z M19,19H5V5h14V19z"
        />
      </svg>
    ),
  },
  {
    id: 6,
    name: "Bank",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M11.5,1L2,6v2h19V6L11.5,1z M4,10v7h3v-7H4z M10,10v7h3v-7H10z M16,10v7h3v-7H16z M2,20h19v3H2V20z"
        />
      </svg>
    ),
  },
  {
    id: 7,
    name: "Mobile blood donation van",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M20,8h-3V4H3C1.9,4,1,4.9,1,6v11h2c0,1.66,1.34,3,3,3s3-1.34,3-3h6c0,1.66,1.34,3,3,3s3-1.34,3-3h2v-5L20,8z M6,19.5 c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S6.83,19.5,6,19.5z M18,19.5c-0.83,0-1.5-0.67-1.5-1.5 s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S18.83,19.5,18,19.5z M17,12V9.5h2.5l2.5,2.5H17z"
        />
      </svg>
    ),
  },
  {
    id: 8,
    name: "Cold storage within a warehouse",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M18,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C20,2.9,19.1,2,18,2z M18,20H6V4h12V20z M8,6h8v2H8V6z M8,10h8v2H8V10z M8,14h8v2H8V14z"
        />
      </svg>
    ),
  },
  {
    id: 9,
    name: "Port",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M20,4h-4V2h-4v2H8V2H4v2H0v18h24V4H20z M22,20H2V6h20V20z"
        />
      </svg>
    ),
  },
  {
    id: 10,
    name: "Barn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M20,2H4C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,20H4V4h16V20z"
        />
      </svg>
    ),
  },
  {
    id: 11,
    name: "Shelf",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M2,20h20v-4H2V20z M4,17h2v2H4V17z M2,4v4h20V4H2z M6,7H4V5h2V7z M2,14h20v-4H2V14z M4,11h2v2H4V11z"
        />
      </svg>
    ),
  },
  {
    id: 12,
    name: "Clinic",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-700">
        <path
          fill="currentColor"
          d="M19,3H5C3.89,3,3,3.89,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.89,20.1,3,19,3z M17,13h-4v4h-2v-4H7v-2h4V7h2v4h4V13z"
        />
      </svg>
    ),
  },
];

function PhysicalLocationModal({ isOpen, onClose, onSelect }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      classNames={{
        body: "p-0",
        base: "max-h-[90vh]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 py-3">
          <h2 className="text-lg font-bold">Select Location Type</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2">
            {locationTypes.map((locationType) => (
              <div
                key={locationType.id}
                onClick={() => {
                  onSelect(locationType);
                  onClose();
                }}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 hover:border-navy-600 cursor-pointer transition-all duration-200 hover:shadow-md bg-white"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full mb-2">
                  {locationType.icon}
                </div>
                <span className="text-xs font-medium text-center text-gray-700 line-clamp-2">
                  {locationType.name}
                </span>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="py-2">
          <Button size="sm" color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PhysicalLocationModal;
