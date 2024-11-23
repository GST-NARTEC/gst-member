import React from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";

function Dashboard() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center ">
        <h1 className="text-2xl font-bold">Welcome to the Member Portal</h1>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
