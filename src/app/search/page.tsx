"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search as SearchIcon, 
  X, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Loader2,
  AlertCircle
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shop/ProductCard"; // Ensure path is correct
import { Button } from "@/components/ui/button";

// --- Configuration ---
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`;

// Mock suggestions (You can replace these with an API call later if needed)
const RECENT_SEARCHES = ["Cotton Kurta", "Brass Lamps", "Silk Sarees"];
const TRENDING_TERMS = ["Summer Collection", "Indigo", "Gift Sets", "Nehru Jackets"];

const SUGGESTED_CATEGORIES = [
  { name: "Women", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200" },
  { name: "Men", image: "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?auto=format&fit=crop&q=80&w=200" },
  { name: "Home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=200" },
  { name: "Jewelry", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200" },
];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500); // Wait 500ms before searching
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- Search API Call ---
  useEffect(() => {
    const performSearch = async () => {
      // If query is empty or too short, reset results
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      try {
        setLoading(true);
        setHasSearched(true);

        const { data } = await axios.get(API_URL, {
          params: {
            search: debouncedQuery,
            limit: 8, // Limit results for the preview
          },
        });

        if (data.success) {
          setResults(data.data.products || []);
        }
      } catch (error) {
        console.error("Search failed", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // --- Handlers ---
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      
      {/* --- Search Header --- */}
      <div className="sticky top-0  bg-[#faf9f6]/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 -z-10 flex items-center gap-4">
          <SearchIcon className="w-6 h-6 text-[#581c1c]" />
          <input
            autoFocus
            type="text"
            placeholder="Search for kurtas, decor, etc..."
            className="flex-1 bg-transparent border-none text-2xl md:text-3xl font-serif text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={query ? clearSearch : () => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: Suggestions (Shown when query is empty) */}
          {!hasSearched && !loading && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-12"
            >
              {/* Left Col: Recent & Trending */}
              <div className="md:col-span-4 space-y-10">
                {/* Recent Searches */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {RECENT_SEARCHES.map((term) => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[#581c1c] hover:text-[#581c1c] transition-all text-sm text-gray-600 shadow-sm"
                      >
                        <Clock className="w-3 h-3" /> {term}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Trending Terms */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trending Now</h3>
                  <div className="space-y-3">
                    {TRENDING_TERMS.map((term, idx) => (
                      <button 
                        key={term} 
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-4 group w-full text-left p-2 hover:bg-white rounded-lg transition-colors"
                      >
                         <span className="text-[#581c1c]/30 font-serif text-lg font-bold">0{idx + 1}</span>
                         <span className="text-gray-700 font-medium group-hover:text-[#581c1c] transition-colors">{term}</span>
                         <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#581c1c] ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: Visual Categories */}
              <div className="md:col-span-8">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Explore Collections</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {SUGGESTED_CATEGORIES.map((cat) => (
                      <Link href={`/shop/${cat.name.toLowerCase()}`} key={cat.name} className="group text-center">
                         <div className="relative aspect-square rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#581c1c] transition-all shadow-md group-hover:shadow-xl">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         </div>
                         <span className="font-serif text-lg text-gray-800 group-hover:text-[#581c1c] transition-colors">{cat.name}</span>
                      </Link>
                   ))}
                 </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 2: Search Loading */}
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-10 h-10 animate-spin text-[#581c1c] mb-4" />
              <p className="text-gray-500 font-serif">Searching for "{query}"...</p>
            </motion.div>
          )}

          {/* VIEW 3: Search Results */}
          {!loading && hasSearched && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <p className="text-gray-600">
                    Found <span className="font-bold text-black">{results.length}</span> results for "<span className="italic">{query}</span>"
                  </p>
                  {results.length > 0 && (
                     <Link href={`/shop?search=${query}`} className="text-[#581c1c] text-sm font-medium flex items-center gap-1 hover:underline">
                        View all matches <ArrowRight className="w-4 h-4" />
                     </Link>
                  )}
               </div>

               {results.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
                    {results.map((product) => (
                       <ProductCard key={product.id} product={product} />
                    ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                     </div>
                     <h3 className="text-2xl font-serif text-gray-900 mb-2">No matches found</h3>
                     <p className="text-gray-500 max-w-md mx-auto">
                       We couldn't find any products matching "{query}". Try checking for typos or using broader keywords.
                     </p>
                     <Button 
                       variant="outline" 
                       className="mt-6 border-[#581c1c] text-[#581c1c] hover:bg-[#581c1c] hover:text-white"
                       onClick={clearSearch}
                     >
                       Clear Search
                     </Button>
                 </div>
               )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}