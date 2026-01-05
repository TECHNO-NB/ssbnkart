"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// --- 1. FALLBACK DATA (Default Content) ---
const FALLBACK_STORY = {
  tagline: "The Philosophy",
  title: "Celebrating India's Artisanal Legacy",
  description: "Fabindia is more than a brand; it is a bridge between the artisan and the urban consumer. With over 60 years of history, we empower rural craftspeople by bringing their traditional techniques—Handblock, Ikat, Chanderi—to the global stage.",
  imageUrl: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=800&auto=format&fit=crop",
  buttonText: "Read Our Story",
  buttonLink: "/about"
};

export function HeritageStory() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cms/heritage-story`);
        
        if (res.data && res.data.data) {
          setData(res.data.data);
        } else {
          // API success but no data (or empty) -> Use Fallback
          console.warn("No heritage story found, using fallback content.");
          setData(FALLBACK_STORY);
        }
      } catch (error) {
        // API failed -> Use Fallback
        console.error("Failed to load heritage story, using fallback content.", error);
        setData(FALLBACK_STORY);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <HeritageSkeleton />;
  }

  // Safety check: if fallback also fails (rare), return nothing
  if (!data) return null;

  return (
    <section className="py-24 px-6 bg-[#2c2c2c] text-[#eceae5]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="space-y-6 order-2 md:order-1">
          <span className="uppercase tracking-widest text-xs text-[#d4c5b5]">
            {data.tagline || FALLBACK_STORY.tagline}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight">
            {data.title || FALLBACK_STORY.title}
          </h2>
          <p className="text-white/70 leading-relaxed text-lg font-light">
            {data.description || FALLBACK_STORY.description}
          </p>
          <a href={data.buttonLink || FALLBACK_STORY.buttonLink}>
            <Button className="bg-[#d4c5b5] text-[#2c2c2c] hover:bg-[#fff] mt-4 rounded-none transition-colors">
              {data.buttonText || FALLBACK_STORY.buttonText}
            </Button>
          </a>
        </div>

        {/* Image Section */}
        <div className="relative order-1 md:order-2">
          {/* Decorative Frame */}
          <div className="absolute -top-4 -right-4 w-full h-full border border-[#d4c5b5]/30 rounded-lg hidden md:block pointer-events-none" />
          
          <Image 
            src={data.imageUrl || FALLBACK_STORY.imageUrl} 
            width={800}
            height={600}
            alt="Heritage Story" 
            className="rounded-lg shadow-2xl relative z-10 w-full h-auto object-cover aspect-[4/3]"
          />
        </div>
      </div>
    </section>
  );
}

function HeritageSkeleton() {
  return (
    <section className="py-24 px-6 bg-[#2c2c2c]">
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
             <Skeleton className="h-4 w-20 bg-gray-700" />
             <Skeleton className="h-12 w-3/4 bg-gray-700" />
             <Skeleton className="h-24 w-full bg-gray-700" />
             <Skeleton className="h-10 w-32 bg-gray-700" />
          </div>
          <Skeleton className="h-[400px] w-full bg-gray-700 rounded-lg" />
       </div>
    </section>
  )
}