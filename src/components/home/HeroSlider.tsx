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

interface BannerData {
  id: string;
  title: string;
  image: string;
  link: string;
  buttonText?: string;
  subtitle?: string;
}

const DEMO_BANNERS: BannerData[] = [
  {
    id: "demo-fallback-1",
    title: "Timeless Elegance",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    link: "/productlisting",
    buttonText: "Explore Collection",
    subtitle: "Discover handcrafted luxury designed for the modern soul.",
  },
];

export function HeroSlider() {
  const [slides, setSlides] = React.useState<BannerData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/banner`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setSlides(response.data);
        } else {
          setSlides(DEMO_BANNERS);
        }
      } catch (error) {
        setSlides(DEMO_BANNERS);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  if (loading) {
    return (
      <section className="w-full h-[50vh] md:h-[60vh] relative bg-gray-200 overflow-hidden">
        <Skeleton className="w-full h-full absolute inset-0" />
      </section>
    );
  }

  return (
    // ✅ FIX: w-screen ➜ w-full
    <section className="w-full h-[50vh] md:h-[60vh] relative group overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full p-0 relative">
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

              <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                <Card className="bg-transparent border-none shadow-none w-full max-w-3xl">
                  <CardContent className="p-0">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={textVariants}
                      className="text-white flex flex-col items-center gap-4 md:gap-6"
                    >
                      <p className="uppercase tracking-[0.2em] text-xs md:text-sm">
                        SSBN Essentials
                      </p>

                      <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light">
                        {slide.title}
                      </h1>

                      {slide.subtitle && (
                        <p className="text-base md:text-xl max-w-md">
                          {slide.subtitle}
                        </p>
                      )}

                      <Link href={slide.link}>
                        <Button
                          size="lg"
                          className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                          {slide.buttonText || "Shop Collection"}
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-8 hidden md:flex" />
        <CarouselNext className="right-8 hidden md:flex" />
      </Carousel>
    </section>
  );
}
