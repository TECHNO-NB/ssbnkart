"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Loader2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/shop/ProductCard"; // Ensure this path is correct
import { useDebounce } from "use-debounce";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

/* ================= CONFIG ================= */
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`;
const CATEGORY_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category/tree`;
const ITEMS_PER_PAGE = 12;

/* ================= TYPES ================= */
interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface Pagination {
  total: number;
  page: number;
  pages: number;
}

/* ================= CATEGORY TREE COMPONENT ================= */
const CategoryTree = ({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (slug: string) => void;
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <div key={cat.id} className="relative">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id={cat.id}
              checked={selectedCategory === cat.slug}
              onCheckedChange={() => onSelect(cat.slug)}
              className="border-gray-300 data-[state=checked]:bg-[#581c1c] data-[state=checked]:border-[#581c1c]"
            />
            <label
              htmlFor={cat.id}
              className={`text-sm leading-none cursor-pointer transition-colors ${
                selectedCategory === cat.slug
                  ? "font-semibold text-[#581c1c]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {cat.name}
            </label>
          </div>

          {/* Recursive Subcategories */}
          {cat.children && cat.children.length > 0 && (
            <div className="ml-4 mt-2 border-l-2 border-gray-100 pl-3">
              <CategoryTree
                categories={cat.children}
                selectedCategory={selectedCategory}
                onSelect={onSelect}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ================= FILTER SIDEBAR COMPONENT ================= */
const FilterContent = ({
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  onClear,
}: any) => {
  return (
    <div className="space-y-8 pr-4">
      {/* Search */}
      <div>
        <h3 className="font-serif text-lg mb-3 text-[#581c1c] font-medium">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Find products..."
            className="pl-9 bg-white border-gray-200 focus-visible:ring-[#581c1c]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-serif text-lg mb-4 text-[#581c1c] font-medium">Categories</h3>
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-2">
          <CategoryTree
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={(slug: string) =>
              setSelectedCategory(selectedCategory === slug ? null : slug)
            }
          />
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg text-[#581c1c] font-medium">Price</h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            ${priceRange[0]} - ${priceRange[1]}+
          </span>
        </div>
        <Slider
          value={priceRange}
          max={20000}
          step={500}
          onValueChange={setPriceRange}
          className="py-4"
        />
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={onClear}
        className="w-full gap-2 border-dashed border-gray-300 text-gray-600 hover:text-[#581c1c] hover:border-[#581c1c]"
      >
        <XCircle size={16} /> Reset Filters
      </Button>
    </div>
  );
};

/* ================= MAIN SHOP PAGE ================= */
export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
  const [sortOption, setSortOption] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pages: 1,
  });

  /* ---------- 1. Load Category Tree ---------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(CATEGORY_API);
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  /* ---------- 2. Fetch Products ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Scroll to top on page change
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });

        const { data } = await axios.get(API_URL, {
          params: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearch || undefined,
            category: selectedCategory || undefined,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < 20000 ? priceRange[1] : undefined,
            sort: sortOption,
          },
        });

        if (data.success) {
          setProducts(data.data.products || []);
          setPagination(data.data.pagination || { total: 0, page: 1, pages: 1 });
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearch, selectedCategory, priceRange, sortOption]);

  /* ---------- 3. Reset Page on Filter Change ---------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, priceRange, sortOption]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 20000]);
    setSortOption("latest");
    setCurrentPage(1);
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#faf9f6] pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#581c1c] text-white py-12 px-6 mb-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif tracking-wide">The Collection</h1>
          <p className="mt-2 text-[#e4d6c8] font-light max-w-2xl">
            Explore our curated selection of handcrafted garments, blending tradition with modern elegance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-10">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <FilterContent
              categories={categories}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onClear={handleClearFilters}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="text-black font-bold">{products.length}</span> of <span className="text-black font-bold">{pagination.total}</span> results
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex-1 sm:flex-none border-gray-300">
                    <SlidersHorizontal size={16} className="mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="font-serif text-2xl text-[#581c1c]">Refine Results</SheetTitle>
                  </SheetHeader>
                  <FilterContent
                    categories={categories}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    onClear={handleClearFilters}
                  />
                </SheetContent>
              </Sheet>

              {/* Sorting */}
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px] border-gray-300 focus:ring-[#581c1c]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#581c1c]" />
                <p>Curating collection...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-200 p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                  Try adjusting your filters or price range to find what you're looking for.
                </p>
                <Button onClick={handleClearFilters} className="mt-6 bg-[#581c1c]">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="hover:border-[#581c1c] hover:text-[#581c1c]"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: pagination.pages }).map((_, i) => {
                  const page = i + 1;
                  // Simple logic to show limited pages if too many
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-[#581c1c] text-white shadow-md transform scale-110"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                className="hover:border-[#581c1c] hover:text-[#581c1c]"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}