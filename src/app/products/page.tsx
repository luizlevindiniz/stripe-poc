"use client";
import ProductsList from "@/components/ProductsList";
import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  default_price: string;
  metadata: {
    subscription: string | undefined;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await axios.get("/api/products");

    if (response.status === 200) {
      return response.data.products.data;
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
  return [];
}

async function getCustomerDetails(): Promise<Customer> {
  try {
    const response = await axios.get("/api/customers");

    if (response.status === 200) {
      return response.data.customers;
    }
  } catch (err) {
    console.error("Failed to fetch customers:", err);
  }
  return { id: "", name: "", email: "" };
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer>();
  useEffect(() => {
    getProducts().then((products) => setProducts(products));
    getCustomerDetails().then((customers) => setCustomer(customers));
  }, []);
  return (
    <div className=" bg-gray-100 min-h-[100%] flex flex-col">
      <header className="shadow bg-slate-400">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 ">Our Store</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <ProductsList products={products} />
        <hr />
        <div>
          Customer Details
          <div key={customer?.id}>
            <p>{customer?.id}</p>
            <p>{customer?.name}</p>
            <p>{customer?.email}</p>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 Our Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
