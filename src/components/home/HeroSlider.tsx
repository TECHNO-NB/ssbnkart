// src/components/sections/HeroSlider.tsx
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// --- Interface ---
interface BannerData {
  id: string;
  title: string;
  image: string;
  link: string;
  buttonText?: string;
  subtitle?: string; 
}

// --- 1. FALLBACK DATA (Demo Data) ---
const DEMO_BANNERS: BannerData[] = [
  {
    id: "demo-fallback-1",
    title: "Timeless Elegance",
    // A reliable, high-quality placeholder image (Unsplash)
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop", 
    link: "/productlisting",
    buttonText: "Explore Collection",
    subtitle: "Discover handcrafted luxury designed for the modern soul."
  }
];

export function HeroSlider() {
  const [slides, setSlides] = React.useState<BannerData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  // --- 2. API Call with Fallback Logic ---
  React.useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/banner`);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setSlides(response.data);
        } else {
          // Fallback: API worked but returned empty array
          console.warn("No banners found in API, using demo data.");
          setSlides(DEMO_BANNERS);
        }
      } catch (error) {
        // Fallback: API failed completely
        console.error("Failed to load hero banners, using demo data.", error);
        setSlides(DEMO_BANNERS);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <section className="max-w-screen h-[50vh] md:h-[60vh] relative bg-gray-200">
        <Skeleton className="w-full h-full absolute inset-0" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
           <Skeleton className="h-4 w-32 bg-white/20 mb-2" />
           <Skeleton className="h-12 w-3/4 md:w-1/2 bg-white/20" />
           <Skeleton className="h-6 w-1/2 md:w-1/3 bg-white/20" />
           <Skeleton className="h-10 w-40 rounded-full bg-white/20 mt-4" />
        </div>
      </section>
    );
  }

  // --- Render Slider ---
  return (
    <section className="max-w-screen h-[50vh] md:h-[60vh] relative group overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="ml-0 h-[50vh] md:h-[60vh]">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full p-0 relative pl-0">
              
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill 
                  priority 
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
              </div>

              {/* Text Overlay */}
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4 md:px-0">
                <Card className="bg-transparent border-none shadow-none w-full max-w-[90%] md:max-w-3xl">
                  <CardContent className="p-0">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={textVariants}
                      className="text-white flex flex-col items-center gap-4 md:gap-6"
                    >
                      <p className="uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm font-medium text-white/90">
                        SSBN Essentials
                      </p>
                      
                      <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light leading-[1.1] tracking-tight">
                        {slide.title}
                      </h1>
                      
                      {slide.subtitle && (
                        <p className="text-base sm:text-lg md:text-xl text-white/90 font-light max-w-sm md:max-w-md mx-auto leading-relaxed">
                          {slide.subtitle}
                        </p>
                      )}
                      
                      <div className="pt-2 md:pt-4">
                        <Link href={slide.link}>
                            <Button 
                            size="lg" 
                            className="bg-white text-black hover:bg-white/90 rounded-full px-6 md:px-8 h-10 md:h-12 text-sm md:text-base border-none transition-transform hover:scale-105"
                            >
                            {slide.buttonText || "Shop Collection"}
                            </Button>
                        </Link>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-8 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex h-12 w-12 bg-white/10 hover:bg-white/30 border-white/20 text-white backdrop-blur-sm" />
        <CarouselNext className="right-8 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex h-12 w-12 bg-white/10 hover:bg-white/30 border-white/20 text-white backdrop-blur-sm" />
      </Carousel>
    </section>
  );
}