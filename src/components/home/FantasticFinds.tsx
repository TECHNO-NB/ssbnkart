"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";

// 1. Redux Imports
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Updated Interface
interface FindItem {
  id: string;
  title: string;       // e.g. "Summer Pick"
  productName: string; // Actual Product Name
  subtitle: string;    // Formatted Price string (e.g. "$50.00")
  price?: number;      // RAW NUMBER needed for math (e.g. 50). Ensure API sends this!
  image: string;
  link: string;
}

export function FantasticFinds() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [finds, setFinds] = useState<FindItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Get Currency Data from Redux
  const { data: currencyData } = useSelector((state: RootState) => state.currency);
  
  // 3. Define Rate & Code Logic
  const rate = currencyData?.rates || 1;
  const currencyCode = currencyData?.currencyCode || "USD";

  // Helper: Format Number
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featured`);
        setFinds(res.data);
      } catch (error) {
        console.error("Failed to load Fantastic Finds", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Scroll Handlers ---
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; 
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-[#fff5f2] overflow-hidden relative">
       {/* Decorative Background */}
       <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-b from-white/40 to-transparent rounded-full blur-3xl pointer-events-none" />
       
       <div className="max-w-7xl mx-auto px-6">
         <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
           
           {/* --- LEFT: Sticky Header --- */}
           <div className="lg:w-1/3 lg:sticky lg:left-0">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <span className="text-[#581c1c] uppercase tracking-[0.2em] text-sm font-medium">
                   Curated For You
                 </span>
                 <h2 className="text-5xl md:text-6xl font-serif text-[#581c1c] leading-tight">
                   Fantastic <br/> <span className="italic text-[#a68a64]">Finds</span>
                 </h2>
                 <p className="text-gray-600 max-w-sm leading-relaxed">
                   Discover our handpicked selection of seasonal favorites, currently available in our catalog.
                 </p>
                 
                 <div className="flex items-center gap-4 pt-4">
                    <Button 
                      onClick={() => scroll("left")}
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-[#581c1c]/20 hover:bg-[#581c1c] hover:text-white transition-colors"
                    >
                       <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button 
                      onClick={() => scroll("right")}
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-[#581c1c]/20 hover:bg-[#581c1c] hover:text-white transition-colors"
                    >
                       <ChevronRight className="w-5 h-5" />
                    </Button>
                 </div>
              </motion.div>
           </div>

           {/* --- RIGHT: Scrollable Carousel --- */}
           <div className="lg:w-2/3 w-full">
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                 {loading ? (
                   // Skeleton Loading State
                   Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="min-w-70 sm:min-w-[320px] snap-center">
                        <Skeleton className="aspect-3/4 rounded-2xl mb-4" />
                        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                     </div>
                   ))
                 ) : (
                   finds.map((item, idx) => {
                     
                     // 4. Calculate Price Logic inside the map
                     // Prefer 'item.price' (number). If missing, try to parse 'item.subtitle' (string)
                     const basePrice = item.price 
                        ? Number(item.price) 
                        : Number(item.subtitle.replace(/[^0-9.-]+/g,"")) || 0;
                     
                     const finalPrice = basePrice * rate;
                     
                     return (
                       <motion.div
                         key={item.id}
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: idx * 0.1 }}
                         className="min-w-70 sm:min-w-[320px] snap-center group cursor-pointer"
                       >
                          <Link href={`/products/${item.link}`}>
                            {/* Image Card */}
                            <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-4 shadow-sm bg-white">
                              <img 
                                src={item.image} 
                                alt={item.productName} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                              
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60" />

                              {/* Hover Button */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 backdrop-blur-[2px]">
                                <div className="bg-white text-[#581c1c] rounded-full px-6 py-3 font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                                   Shop Now <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                              
                              {/* Price Tag (DYNAMIC) */}
                              <div className="absolute top-4 right-4">
                                <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#581c1c] shadow-sm">
                                   {/* If we have a valid price, show converted. Else fallback to subtitle string */}
                                   {basePrice > 0 
                                      ? `${currencyCode} ${formatMoney(finalPrice)}`
                                      : item.subtitle
                                   }
                                </div>
                              </div>
                            </div>

                            {/* Content Below */}
                            <div className="text-center">
                              <h3 className="text-xl font-serif text-[#581c1c] group-hover:text-[#a68a64] transition-colors">
                                 {item.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.productName}</p>
                              <div className="h-0.5 w-0 bg-[#a68a64] mx-auto mt-2 transition-all duration-300 group-hover:w-12" />
                            </div>
                          </Link>
                       </motion.div>
                     );
                   })
                 )}
                 
                 {/* "See All" Card */}
                 <div className="min-w-50 snap-center flex items-center justify-center">
                    <Link href="/productlisting" className="group flex flex-col items-center gap-4 text-[#581c1c] hover:opacity-80 transition-opacity">
                       <div className="w-16 h-16 rounded-full border-2 border-[#581c1c] flex items-center justify-center group-hover:bg-[#581c1c] group-hover:text-white transition-colors">
                          <ArrowRight className="w-6 h-6" />
                       </div>
                       <span className="font-serif text-lg">View All</span>
                    </Link>
                 </div>

              </div>
           </div>
        </div>
       </div>
    </section>
  );
}