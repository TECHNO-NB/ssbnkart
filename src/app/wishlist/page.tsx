"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingBag, 
  X, 
  AlertCircle,
  Share2,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/redux/cartSlice";

// --- Types based on your JSON Response ---

interface Variant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  priceDiff: string | null;
}

// The raw product shape inside the API response
interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: number;
  images: string[];
  tags?: string[];
  variants?: Variant[]; 
  category?: { name: string; slug: string };
}

// The raw item shape from the Wishlist array
interface ApiWishlistItem {
  id: string; // This is the Wishlist ID (e.g., cmjlmidq...)
  productId: string;
  product: ApiProduct;
}

// The shape our UI uses (Flattened)
interface MappedProduct extends ApiProduct {
  wishlistItemId: string; // We map ApiWishlistItem.id to this
}

export default function WishlistPage() {
  const [items, setItems] = useState<MappedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  // --- 1. Fetch Wishlist ---
  const fetchWishlist = async () => {
    if (!userData?.id) return; 

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist/${userData.id}`);
      
      // Access the raw array from your JSON structure
      const rawItems: ApiWishlistItem[] = response.data?.data?.items || [];
      
      // CRITICAL STEP: Map the nested API data to the flat structure the UI expects
      const mappedItems: MappedProduct[] = rawItems
        .filter(item => item.product) // Safety check: ensure product exists
        .map((item) => ({
          ...item.product,          // Spread all product details (name, price, images, etc.)
          wishlistItemId: item.id   // Attach the Wishlist Item ID (needed for delete)
        }));

      setItems(mappedItems);
      
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
      setError("Could not load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userData?.id]);

  // --- 2. Remove Item ---
  const removeFromWishlist = async (wishlistItemId: string) => {
    const previousItems = [...items];
    
    // Optimistic UI update
    setItems((prev) => prev.filter((item) => item.wishlistItemId !== wishlistItemId));

    try {
      // Use the mapped wishlistItemId
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist/${wishlistItemId}`);
      toast.success("Removed from wishlist");
    } catch (err) {
      setItems(previousItems); // Revert on error
      toast.error("Failed to remove item");
      console.error(err);
    }
  };

  // --- 3. Move to Bag Logic ---
  const moveToBag = async (item: MappedProduct) => {
    const hasVariants = item.variants && item.variants.length > 0;

    // If it has variants (size/color), go to product page
    if (hasVariants) {
      router.push(`/product/${item.slug || item.id}`);
      return;
    }

    try {
      setProcessingId(item.id);
      
      // 1. Add to Cart (Uses Product ID)
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/addToCart`,
        {
          userId: userData.id,
          productId: item.id, // This is the Product ID
          quantity: 1, 
        }
      );

      // 2. Remove from Wishlist (Uses Wishlist Item ID)
      if (item.wishlistItemId) {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist/${item.wishlistItemId}`);
      }
      
      // Dispatch generic cart action (adjust payload if your reducer expects full product)
      dispatch(addItem(item.id)); 
      
      // 3. Update UI
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Moved to Shopping Bag");

    } catch (err) {
      toast.error("Failed to move to bag");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <WishlistSkeleton />;

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-gray-500 mb-6">{error}</p>
        <Button onClick={fetchWishlist} variant="outline">Try Again</Button>
      </div>
    );
  }

  if (items.length === 0) return <EmptyWishlistState />;

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#581c1c] tracking-tight">My Wishlist</h1>
            <p className="text-muted-foreground mt-2 font-light">
              <span className="font-medium text-black">{items.length} items</span> saved for later
            </p>
          </div>
          <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:border-[#581c1c] hover:text-[#581c1c] rounded-full px-6">
            <Share2 className="w-4 h-4" /> Share Collection
          </Button>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <WishlistCard 
                key={item.id} // Product ID
                item={item} 
                onRemove={removeFromWishlist}
                onMoveToBag={moveToBag}
                isProcessing={processingId === item.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// --- Component: Single Wishlist Card ---
function WishlistCard({ 
  item, 
  onRemove, 
  onMoveToBag,
  isProcessing 
}: { 
  item: MappedProduct, 
  onRemove: (wishlistItemId: string) => void,
  onMoveToBag: (item: MappedProduct) => void,
  isProcessing: boolean
}) {
  
  // Calculate stock including variants
  const totalStock = (item.variants?.reduce((acc, v) => acc + v.stock, 0) || 0) + (item.stock || 0);
  const inStock = totalStock > 0;
  
  const hasVariants = item.variants && item.variants.length > 0;
  const buttonText = hasVariants ? "Select Options" : "Add to Bag";
  
  const formatPrice = (price: string) => `$${Number(price).toLocaleString('en-US')}`; // Changed to $ for Indian Context based on data (Fabindia)
  const imageUrl = item.images?.[0] || '/placeholder.png';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-sm hover:shadow-md transition-all">
        <Link href={`/product/${item.slug || item.id}`} className="block w-full h-full">
          <img 
            src={imageUrl} 
            alt={item.name} 
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!inStock ? "grayscale opacity-60" : ""}`} 
          />
        </Link>

        {/* Remove Button */}
        <button
          onClick={(e) => { 
            e.preventDefault(); 
            // Pass the mapped wishlistItemId
            if (item.wishlistItemId) onRemove(item.wishlistItemId); 
          }}
          className="absolute top-2 right-2 p-2 bg-white/70 backdrop-blur-md rounded-full hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase text-red-600 rounded-full shadow-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Sold Out
            </span>
          </div>
        )}

        {inStock && (
          <div className="absolute inset-x-4 bottom-4 translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
            <Button 
              onClick={() => onMoveToBag(item)}
              disabled={isProcessing}
              className="w-full bg-white/95 text-black hover:bg-black hover:text-white shadow-lg rounded-full h-10"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             {item.category?.name || "Collection"}
           </p>
           {inStock && (
             <button 
               onClick={() => onMoveToBag(item)}
               disabled={isProcessing}
               className="md:hidden text-gray-600"
             >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin"/> : <ShoppingBag className="w-5 h-5"/>}
             </button>
           )}
        </div>

        <Link href={`/product/${item.slug || item.id}`}>
          <h3 className="font-medium text-gray-900 line-clamp-1 hover:text-[#581c1c] transition-colors text-sm sm:text-base">
            {item.name}
          </h3>
        </Link>
        
        <p className="font-serif text-base font-medium text-[#581c1c] mt-0.5">
          {formatPrice(item.price)}
        </p>
      </div>
    </motion.div>
  );
}

// --- Skeleton Component ---
function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <Skeleton className="h-12 w-64 bg-gray-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-xl bg-gray-200" />
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/4 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Empty State Component ---
function EmptyWishlistState() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#faf9f6] text-center px-6">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
        <Heart className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-3xl font-serif text-[#581c1c] mb-2">Your Wishlist is Empty</h2>
      <p className="text-gray-500 max-w-sm mb-8">Save items you love here to buy later.</p>
      <Link href="/productlisting">
        <Button className="bg-[#581c1c] hover:bg-[#4a1717] rounded-full px-8">
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}