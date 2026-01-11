"use client";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ValuePropsBar } from "@/components/home/ValuePropsBar";
import { CategoryBentoGrid } from "@/components/home/CategoryBentoGrid";
import { TrendingSection } from "@/components/home/TrendingSection";
import { HeritageStory } from "@/components/home/HeritageStory";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FantasticFinds } from "./FantasticFinds";
import { FeaturedBanner } from "./FeaturedBanner";
import { useRouter } from "next/navigation";
import { DicountedProducts } from "./DiscountedProduct";
import { FeaturesProducts } from "./FeaturedProducts";
import { FeaturedBanner2 } from "./FeaturedBanner2";
import { convertUSDToLocal } from "@/lib/getCountry";
import { useEffect } from "react";

export default  function Landing() {
  const router = useRouter();


  useEffect(()=>{
const fetch=async()=>{

  console.log("++++++++++++++++",await convertUSDToLocal(20))
}
fetch()
  },[])
  return (
    <main className="bg-[#faf9f6] min-h-screen max-w-screen">
      {/* 1. Modern Image Slider (First Section as requested) */}
      <HeroSlider />

      {/* 2. Trust Signals */}
      <ValuePropsBar />

      <FantasticFinds />

      {/* 3. Categories (Bento Grid) */}
      <CategoryBentoGrid />

      {/* Featured Banner */}
      <FeaturedBanner />

      {/* 4. Trending Products Carousel/Grid */}
      <TrendingSection />
      <FeaturedBanner2 />
      <DicountedProducts />

      <FeaturesProducts />

      {/* 5. Brand Story (Dark Section) */}
      <HeritageStory />

      {/* 6. Simple Newsletter (kept inline for simplicity, could be separated too) */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center ">
        <Sparkles className="w-8 h-8 text-[#581c1c] mx-auto mb-4" />
        <h2 className="text-3xl font-serif mb-4 text-[#581c1c]">
          Join the SSBN Family
        </h2>
        <p className="text-muted-foreground mb-8">
          Subscribe to receive updates, access to exclusive deals, and more.
        </p>
        <div className="flex gap-2 max-w-md mx-auto justify-center">
          <Button
            onClick={() => router.push("/auth/register")}
            className="bg-[#581c1c] hover:bg-[#4a1717] rounded-none px-6"
          >
            Register
          </Button>
        </div>
      </section>
    </main>
  );
}
