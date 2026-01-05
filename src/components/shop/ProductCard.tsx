"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/redux/cartSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  stock: number;
  size?: string;
  color?: string;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    compareAtPrice?: string | null;
    images: string[];
    stock?: number;
    stoke?: number;
    slug?: string;
    category?: {
      name?: string;
      slug?: string;
    };
    variants?: Variant[];
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const {
    id,
    name,
    price,
    compareAtPrice,
    images,
    category,
    slug,
    variants = [],
    stock,
    stoke,
  } = product;

  const [showOverlay, setShowOverlay] = useState(false);
  const parentStock = stock ?? stoke ?? 0;
  const totalStock =
    variants.length > 0
      ? variants.reduce((acc, variant) => acc + (variant.stock || 0), 0)
      : parentStock;

  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state: any) => state.user);
  const cartItems: { id: string }[] = useSelector((state: any) => state.cart.items);

  const priceNum = Number(price);
  const compareNum = compareAtPrice && Number(compareAtPrice) > 0 ? Number(compareAtPrice) : null;

  const discountPercent =
    compareNum && compareNum > priceNum
      ? Math.round(((compareNum - priceNum) / compareNum) * 100)
      : null;

  const addToCart = async () => {
    if (totalStock <= 0) {
      toast.error("Out of stock");
      return;
    }

    if (!userData?.id) {
      toast.error("Please login to add items to cart");
      router.push("/auth/login");
      return;
    }

    // Variants redirect to product page
    if (variants.length > 0) {
      router.push(`/product/${slug || id}`);
      return;
    }

    // Prevent duplicate
    const exists = cartItems.some((item) => item.id === id);
    if (exists) {
      toast.error("Item already in cart!");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/addToCart`,
        {
          userId: userData.id,
          productId: id,
          quantity: 1,
        }
      );

      if (res.status === 200 || res.status === 201) {
        // Add item ID to Redux
        dispatch(addItem(id));
        toast.success("Added to cart successfully!", {
          style: { background: "#333", color: "#fff" },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="group cursor-pointer">
      <Card className="overflow-hidden border-none bg-transparent shadow-none">
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100"
          onClick={() => setShowOverlay(!showOverlay)}
        >
          <img
            src={images?.[0] || "/placeholder.png"}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />

          {discountPercent && (
            <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#581c1c] text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-md font-medium">
              {discountPercent}% OFF
            </span>
          )}

          {totalStock <= 0 && (
            <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/80 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-md">
              Out of stock
            </span>
          )}

          <div
            className={`
              absolute bottom-4 left-4 right-4 space-y-2 
              transition-all duration-300 ease-out
              group-hover:translate-y-0 group-hover:opacity-100
              ${showOverlay ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"}
            `}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart();
              }}
              disabled={totalStock <= 0}
              className={`w-full py-2.5 md:py-3 rounded-lg font-medium shadow-lg transition-colors text-sm md:text-base
                ${totalStock > 0 ? "bg-white hover:bg-gray-100 text-black" : "bg-gray-300 cursor-not-allowed text-gray-500"}
              `}
            >
              {variants.length > 0 ? "Select Options" : "Quick Add"}
            </button>

            <Link
              href={`/product/${slug || id}`}
              onClick={(e) => e.stopPropagation()}
              className="block w-full text-center py-2 rounded-lg bg-black text-white text-xs md:text-sm hover:bg-black/90 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>

        <CardContent className="pt-4 px-1">
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">
            {category?.name || "Uncategorized"}
          </p>

          <Link href={`/product/${slug || id}`}>
            <h3 className="font-medium text-base md:text-lg mt-1 line-clamp-1 hover:text-[#581c1c] transition-colors">
              {name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-1">
            <p className="font-serif text-[#581c1c] text-base md:text-lg font-medium">
              ${priceNum.toLocaleString("en-US")}
            </p>
            {compareNum  && compareNum > priceNum && (
              <p className="text-xs md:text-sm text-gray-400 line-through">
                ${compareNum.toLocaleString("en-US")}
              </p>
            )}
          </div>

          <p
            className={`text-[10px] md:text-xs mt-1 font-medium ${
              totalStock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalStock > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
