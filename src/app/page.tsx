"use client";
import CustomerPortal from "@/components/CustomerPortal";
import MembershipCard from "@/components/MembershipCard";
import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  default_price: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  metadata: {
    subscription: string | undefined;
  };
}

async function getMembershipDetails(): Promise<Product | null> {
  try {
    const response = await axios.get("/api/membership");

    if (response.status === 200) {
      return response.data.product;
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
  return null;
}

async function getCustomerDetails(): Promise<Customer | null> {
  try {
    const response = await axios.get("/api/customers");

    if (response.status === 200) {
      return response.data.customers;
    }
  } catch (err) {
    console.error("Failed to fetch customers:", err);
  }
  return null;
}

export default function Products() {
  const [product, setProduct] = useState<Product | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  useEffect(() => {
    getCustomerDetails().then((customer) => setCustomer(customer));
    getMembershipDetails().then((product) => setProduct(product));
  }, []);
  return (
    <div className=" bg-gray-100 min-h-[100%] flex flex-col">
      <header className="shadow bg-slate-400">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 ">Our Store</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {customer?.metadata.subscription === "true" ? (
          <CustomerPortal customer={customer} />
        ) : (
          <MembershipCard membership={product} />
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 Our Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
