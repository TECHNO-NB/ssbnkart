"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// --- 1. FALLBACK DATA (Demo Products) ---
const FALLBACK_PRODUCTS = [
  {
    id: "fb-1",
    name: "Indigo Handblock Cotton Kurta",
    slug: "indigo-kurta",
    price: 2499,
    compareAtPrice: 2999,
    images: ["https://images.unsplash.com/photo-1583391733958-e026b1346338?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Women" }
  },
  {
    id: "fb-2",
    name: "Classic Beige Nehru Jacket",
    slug: "nehru-jacket",
    price: 3999,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1596401057633-565652b8ddbe?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Men" }
  },
  {
    id: "fb-3",
    name: "Handwoven Banarasi Silk Saree",
    slug: "silk-saree",
    price: 12500,
    compareAtPrice: 15000,
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Women" }
  },
  {
    id: "fb-4",
    name: "Antique Brass Table Lamp",
    slug: "brass-lamp",
    price: 1850,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Home" }
  }
];

export function FeaturesProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product/features/new`
        );

        const fetchedProducts = res.data?.data;

        if (fetchedProducts && Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
          // Success: Use API Data
          setProducts(fetchedProducts);
        } else {
          // API Empty: Use Fallback
          console.warn("No trending products found, using fallback data.");
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        // API Error: Use Fallback
        console.error("Failed to fetch trending products, using fallback.", err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-[#581c1c]">
           Latest Features Product 
          </h2>
          <div className="w-20 h-1 bg-[#d4c5b5] mx-auto mt-4" />
        </div>

        {loading ? (
          // --- Skeleton Loading State ---
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-3/4 w-full rounded-lg" />
                <div className="space-y-2">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- Product Grid ---
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            onClick={() => router.push("/productlisting")}
            variant="outline"
            className="border-[#581c1c] text-[#581c1c] hover:bg-[#581c1c] hover:text-white px-8 rounded-none transition-colors"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}