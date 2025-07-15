import AdminLayout from "@/components/AdminLayout";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import NewRestaurantRequests from "@/components/NewRestaurantRequests";

export default function NewRequests() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin token exists, if not redirect to login page
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login"); // Redirect to login page if no token
      return;
    }
  }, [router]);

  return (
    <AdminLayout>
      <NewRequestsStyled>
        <NewRestaurantRequests />
      </NewRequestsStyled>
    </AdminLayout>
  );
}

const NewRequestsStyled = styled.div``;
