"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "@/components/shop/ProductCard";
import { Loader2, AlertCircle } from "lucide-react";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`;

// Page URL: /shop/[category]
export default function CategorySearchPage() {
  // 1. Get Dynamic Route Param (e.g., "men", "women")
  const params = useParams();
  const category = (params?.category as string) || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      try {
        setLoading(true);

        // Build API Parameters - Category Only
        const apiParams: any = {
          category: category.toLowerCase(), 
        };

        const res = await axios.get(API_URL, { params: apiParams });
        
        if (res.data && res.data.success) {
          setProducts(res.data.data.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch category products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen ">
      {/* Header */}
      <div className="mb-10 text-center md:text-left border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-serif text-[#581c1c] capitalize mb-2">
          {category.replace("-", " ")}
        </h1>
        <p className="text-gray-500 font-medium capitalize">
           Collection
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-[#581c1c]" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">
            We couldn't find any items in the <strong>{category}</strong> category right now.
          </p>
        </div>
      )}
    </div>
  );
}