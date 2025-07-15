import AddAdmin from "@/components/AddAdmin";
import AdminLayout from "@/components/AdminLayout";
import React from "react";
import styled from "styled-components";

export default function addAdmin() {
  return (
    <AddAdminStyled>
      <AdminLayout>
        <AddAdmin />
      </AdminLayout>
    </AddAdminStyled>
  );
}

const AddAdminStyled = styled.div``;
