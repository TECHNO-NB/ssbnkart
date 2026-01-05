"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button"; // Shadcn button
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard"; // Reusing the card from previous step

// --- Mock Data ---
const CATEGORIES = [
  { id: 1, name: "Women's Ethnic", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop", size: "large" },
  { id: 2, name: "Men's Kurtas", image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=800&auto=format&fit=crop", size: "small" },
  { id: 3, name: "Home Decor", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=800&auto=format&fit=crop", size: "small" },
  { id: 4, name: "Handcrafted Jewelry", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop", size: "medium" },
];

const TRENDING = [
  { id: 1, name: "Indigo Block Print Kurta", price: 2999, category: "Women", image: "https://images.unsplash.com/photo-1583391733958-e026b1346338?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Beige Silk Nehru Jacket", price: 4500, category: "Men", image: "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Ceramic Serving Bowl", price: 1290, category: "Home", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "Cotton Silk Dupatta", price: 1899, category: "Women", image: "https://images.unsplash.com/photo-1620452395727-b52b2f676449?auto=format&fit=crop&q=80&w=600" },
];

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="bg-[#faf9f6]"> {/* Soft cream background */}
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1629814424765-a898b3c95971?q=80&w=2000&auto=format&fit=crop" 
            alt="Fabindia Heritage" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20" /> {/* Dark Overlay */}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-xl text-white space-y-6"
          >
            <motion.p variants={fadeInUp} className="uppercase tracking-[0.2em] text-sm font-medium">
              Summer Collection '25
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-light leading-tight">
              Threads of <br/> Tradition
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 font-light max-w-md">
              Handwoven textiles crafted by artisans across India, reimagined for the modern home and wardrobe.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 text-md">
                Shop The Collection
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. VALUE PROPS */}
      <section className="py-8 border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-6 text-center md:text-left">
          {[
            { icon: Leaf, title: "100% Organic", desc: "Sourced from nature" },
            { icon: Truck, title: "Global Shipping", desc: "Delivered to 100+ countries" },
            { icon: Sparkles, title: "Handcrafted", desc: "Made by skilled artisans" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 min-w-[250px] mx-auto md:mx-0">
              <div className="p-3 bg-stone-100 rounded-full">
                <item.icon className="w-5 h-5 text-stone-700" />
              </div>
              <div>
                <h4 className="font-medium text-sm uppercase tracking-wide">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BENTO GRID CATEGORIES */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          {CATEGORIES.map((cat, idx) => (
            <div 
              key={cat.id} 
              className={`relative group overflow-hidden rounded-xl cursor-pointer ${
                cat.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                cat.size === 'medium' ? 'md:col-span-2' : ''
              }`}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-serif">{cat.name}</h3>
                <span className="text-sm border-b border-white/0 group-hover:border-white/100 transition-all duration-300 pb-1">Shop Now</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS CAROUSEL */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#581c1c]">This Month's Favorites</h2>
            <div className="w-20 h-1 bg-[#d4c5b5] mx-auto mt-4" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRENDING.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-[#581c1c] text-[#581c1c] hover:bg-[#581c1c] hover:text-white px-8 rounded-none">
              View All Bestsellers
            </Button>
          </div>
        </div>
      </section>

      {/* 5. HERITAGE / STORY SECTION */}
      <section className="py-24 px-6 bg-[#2c2c2c] text-[#eceae5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="uppercase tracking-widest text-xs text-[#d4c5b5]">The Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              Celebrating India's <span className="text-[#d4c5b5] italic">Artisanal</span> Legacy
            </h2>
            <p className="text-white/70 leading-relaxed text-lg font-light">
              Fabindia is more than a brand; it is a bridge between the artisan and the urban consumer. 
              With over 60 years of history, we empower rural craftspeople by bringing their 
              traditional techniques—Handblock, Ikat, Chanderi—to the global stage.
            </p>
            <Button className="bg-[#d4c5b5] text-[#2c2c2c] hover:bg-[#fff] mt-4">
              Read Our Story
            </Button>
          </div>
          <div className="relative">
             {/* Decorative Frame */}
             <div className="absolute -top-4 -right-4 w-full h-full border border-[#d4c5b5]/30 rounded-lg hidden md:block" />
             <img 
               src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=800&auto=format&fit=crop" 
               alt="Artisan Working" 
               className="rounded-lg shadow-2xl relative z-10 w-full"
             />
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center">
         <Sparkles className="w-8 h-8 text-[#581c1c] mx-auto mb-4" />
         <h2 className="text-3xl font-serif mb-4">Join the Fab Family</h2>
         <p className="text-muted-foreground mb-8">
           Subscribe to receive updates, access to exclusive deals, and more.
         </p>
         <div className="flex gap-2 max-w-md mx-auto">
           <input 
             type="email" 
             placeholder="Enter your email address" 
             className="flex-1 px-4 py-3 border rounded-md focus:outline-none focus:border-[#581c1c]"
           />
           <Button className="bg-[#581c1c] hover:bg-[#4a1717]">Subscribe</Button>
         </div>
      </section>
    </div>
  );
}