// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

// --- Types ---
interface BannerData {
  id?: string;
  image: string;
  title: string;
  description: string;
  cta: string;
  link: string;
}

// --- Default Fallback Data ---
const DEFAULT_DATA: BannerData = {
  image: "https://apisap.fabindia.com/medias/hp-sec8-10dec25-01.jpg?context=bWFzdGVyfGltYWdlc3wzOTE0NTJ8aW1hZ2UvanBlZ3xhRFF5TDJoak1DOHhNelV4T1RNek9ERTJNelF3TnpndmFIQXRjMlZqT0MweE1HUmxZekkxTFRBeExtcHdad3wyOWE3NjNmNDMzMWU0YzYzMjQ1YjBlNTZiYmY5NDFiOWRjZTRhYTE2MjQ0ZTQ5NDIwZGZjNzI4YmQ3ZTM2OTY4",
  title: "Handwoven Heritage",
  description: "Experience the timeless elegance of authentic craftsmanship woven into every thread.",
  cta: "Discover More",
  link: "/shop/handwoven"
};

export function FeaturedBanner() {
  const [banners, setBanners] = useState<BannerData>();
  const [loading, setLoading] = useState(true);

  // --- API Fetching ---
  useEffect(() => {
    const fetchBanners = async () => {
      try {

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featuredbanners`);
        
        if (response.data && response.data.length > 0) {
          setBanners(response.data[0]);
        } else {
          // If API returns empty array, use default
          setBanners(DEFAULT_DATA);
        }
      } catch (error) {
        console.error("Failed to fetch featured banners:", error);
        // On error, fallback to default so UI doesn't break
        setBanners(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // --- Render Loop (Handles 1 or 2 banners) ---
  return (
    <>
      
        <section 
          key={banners?.id || 0} 
          className="w-screen max-w-[100vw] relative h-[60vh] min-h-[500px] md:h-[400px] overflow-hidden my-12 group first:mt-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={banners.image}
              alt={banners.title}
              fill
              className="object-cover object-center w-full h-full transition-transform duration-1000 group-hover:scale-105"
              priority // Only prioritize the first image for LCP
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-l md:from-black/20 md:via-black/20 md:to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center md:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl md:max-w-2xl space-y-8 text-center md:text-left md:mr-8 lg:mr-12"
            >
              <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-[1.1] drop-shadow-md">
                {banners.title}
              </h2>

              <p className="text-xl md:text-2xl text-white/95 font-light leading-relaxed drop-shadow-sm">
                {banners.description}
              </p>

              <div className="pt-4">
                <Link href={banners.link || "/"}>
                  <Button
                    size="lg"
                    className="bg-white text-[#581c1c] hover:bg-[#581c1c] hover:text-white rounded-full px-10 h-14 text-lg font-medium transition-all duration-300 hover:scale-105 border-none shadow-lg"
                  >
                    {banners.cta} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
     
    </>
  );
}