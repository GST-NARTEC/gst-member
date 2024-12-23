import React from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import OrdersTable from "../../components/myProfile/OrdersTable";

function MyOrders() {
  return (
    <MainLayout>
      <div className="p-8">
        <OrdersTable />
      </div>
    </MainLayout>
  );
}

export default MyOrders;
