import { useState } from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import BulkImportModal from "./BulkImportModal";
import { Button } from "@heroui/react";
import { Upload } from "lucide-react";

function AddBulkProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-primary my-4">
          Bulk Products Import
        </h1>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Button
            color="primary"
            size="lg"
            startContent={<Upload size={24} />}
            onClick={() => setIsModalOpen(true)}
          >
            Open Bulk Import
          </Button>
        </div>
        <BulkImportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}

export default AddBulkProducts;
