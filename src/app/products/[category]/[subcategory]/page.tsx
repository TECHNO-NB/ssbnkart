"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "@/components/shop/ProductCard";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`;

export default function CategorySubCategoryPage() {
  const { category, subcategory } = useParams() as {
    category: string;
    subcategory: string;
  };

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params: any = {
          category: category.toLowerCase(),
        };

        // 🔹 subcategory logic
        if (subcategory === "new") {
          params.isNew = true;
        } else if (subcategory !== "all") {
          params.subcategory = subcategory.toLowerCase();
        }

        const res = await axios.get(API_URL, { params });
        setProducts(res.data.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-serif mb-6 capitalize">
        {category} / {subcategory}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}
