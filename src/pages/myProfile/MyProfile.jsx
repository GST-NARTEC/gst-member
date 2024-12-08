import React from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { Button, Card } from "@nextui-org/react";
import MemberPersonalInfo from "../../components/myProfile/MemberPersonalInfo";
import OrdersTable from "../../components/myProfile/OrdersTable";
import MemberDocuments from "../../components/myProfile/MemberDocuments";
import Brands from "../../components/myProfile/Brands";

export default function MyProfile() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="flex justify-end">
        <Button
          onClick={() => navigate(-1)}
          variant="solid"
          color="default"
          startContent={<MdArrowBackIosNew />}
        >
          Back
        </Button>
      </div>

      <Card className="m-4">
        <MemberPersonalInfo />
      </Card>
      <Card className="m-4">
        <OrdersTable />
      </Card>
      <Card className="m-4">
        <MemberDocuments />
      </Card>
      <Card className="m-4">
        <Brands />
      </Card>
    </MainLayout>
  );
}
