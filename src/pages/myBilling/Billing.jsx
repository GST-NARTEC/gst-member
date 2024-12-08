import React from "react";
import MemberDocuments from "../../components/myProfile/MemberDocuments";
import MainLayout from "../../layout/PortalLayouts/MainLayout";

function Billing() {
  return (
    <MainLayout>
      <div className="m-8">
        <MemberDocuments />
      </div>
    </MainLayout>
  );
}

export default Billing;
