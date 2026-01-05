"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

// 1. Interfaces
interface ApiResponseItem {
  id: string;
  categoryName: string; 
  image: string;
  size: string;
  active: boolean;
  order: number;
  categoryId: string;
  customImage: string;
}

interface BentoUiItem {
  id: string;
  name: string;
  image: string;
  link: string;
  size: string;
}

// 2. FALLBACK DATA (Demo Data)
const FALLBACK_CATEGORIES: BentoUiItem[] = [
  {
    id: "fb-1",
    name: "Women's Ethnic",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    link: "/shop/women",
    size: "LARGE" // 2x2 Block
  },
  {
    id: "fb-2",
    name: "Men's Kurta",
    image: "https://apisap.fabindia.com/medias/20235813-01.jpg?context=bWFzdGVyfGltYWdlc3w4Njg1NnxpbWFnZS9qcGVnfGFETmhMMmcyTlM4eE16UXlPVEk0TVRNd05UTTVPREl2TWpBeU16VTRNVE5mTURFdWFuQm58NWM4YjY0NjM0NTM0ZDFlNDVjNGZkZDNmZDIzMDdjYzJmYjVkNTMyZmQ4MjAwY2IwNDA1MzFkMWI0MDNkYzAwZQ&aio=w-400",
    link: "/shop/men",
    size: "SMALL" // 1x1 Block
  },
  {
    id: "fb-3",
    name: "Home Decor",
    image: "https://apisap.fabindia.com/medias/20254508-01.jpg?context=bWFzdGVyfGltYWdlc3w0MzEwNDV8aW1hZ2UvanBlZ3xhR0UwTDJneU1pOHhNekk0TkRZMk56UTBNVEUxTlRBdk1qQXlOVFExTURoZk1ERXVhbkJufGNmZWY3NjYxYzUzZDA4ZmE2OTE2MTBjMjMwMzE4YWIxOTZiNGIwNGQ2NTk4YTNlYmM1ZDQwZWFkMDViYzUzM2Y&aio=w-400",
    link: "/shop/home",
    size: "SMALL" // 1x1 Block
  },
  {
    id: "fb-4",
    name: "Jewelry",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    link: "/shop/jewelry",
    size: "MEDIUM" // 2x1 Block
  }
];

export function CategoryBentoGrid() {
  const [categories, setCategories] = useState<BentoUiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/bento`);
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Map API response to UI structure
          const formattedData: BentoUiItem[] = res.data.map((item: ApiResponseItem) => ({
            id: item.id,
            name: item.categoryName, 
            image: item.customImage || item.image, 
            link: `/shop/${item.categoryName.toLowerCase().replace(/\s+/g, '-')}`,
            size: item.size
          }));
          
          setCategories(formattedData);
        } else {
          // API worked but returned no data -> Use Fallback
          console.warn("No bento items found, using fallback data.");
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (error) {
        // API failed -> Use Fallback
        console.error("Failed to load curated categories, using fallback data.", error);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to determine grid classes based on size
  const getGridClass = (size: string) => {
    switch (size.toLowerCase()) {
      case 'large': return 'md:col-span-2 md:row-span-2';
      case 'medium': return 'md:col-span-2';
      default: return 'md:col-span-1 md:row-span-1'; // small is 1x1
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto bg-[#faf9f6]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-between items-end mb-10"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#581c1c]">Curated Categories</h2>
          <p className="mt-2 text-muted-foreground">Explore our wide range of authentic products.</p>
        </div>
        <Link href="/shop" className="hidden md:flex items-center gap-2 text-[#581c1c] font-medium hover:gap-3 transition-all">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 md:h-[600px] auto-rows-[200px]">
        {loading ? (
           // --- Skeleton Loading State ---
           <>
             <Skeleton className="md:col-span-2 md:row-span-2 w-full h-full rounded-xl bg-gray-200" />
             <Skeleton className="md:col-span-1 md:row-span-1 w-full h-full rounded-xl bg-gray-200" />
             <Skeleton className="md:col-span-1 md:row-span-1 w-full h-full rounded-xl bg-gray-200" />
             <Skeleton className="md:col-span-2 md:row-span-1 w-full h-full rounded-xl bg-gray-200" />
           </>
        ) : (
           categories.map((cat) => (
            <Link 
              href={cat.link}
              key={cat.id} 
              className={`relative group overflow-hidden rounded-xl cursor-pointer ${getGridClass(cat.size)}`}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Text Content */}
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-serif font-bold tracking-wide capitalize">{cat.name}</h3>
                <span className="text-sm border-b border-white/0 group-hover:border-white/100 transition-all duration-300 pb-1 inline-block mt-2">
                  Shop Now
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
      
      {/* Mobile "View All" Button */}
      <div className="mt-8 md:hidden flex justify-center">
         <Link href="/productlisting" className="flex items-center gap-2 text-[#581c1c] font-medium border border-[#581c1c]/20 px-6 py-3 rounded-full hover:bg-[#581c1c] hover:text-white transition-colors">
            View All Categories <ArrowRight className="w-4 h-4" />
         </Link>
      </div>
    </section>
  );
}