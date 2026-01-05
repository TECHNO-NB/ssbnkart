// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  Heart,
  Truck,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addItem } from "@/redux/cartSlice";

interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
  priceDiff: string | null;
}

interface Review {
  rating: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string;
  images: string[];
  price: string;
  compareAtPrice: string;
  variants: Variant[];
  reviews: Review[];
  category: {
    name: string;
    slug: string;
  };
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product/${slug}`
        );
        setProduct(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [slug]);

  // Set default color & variant when product loads
  useEffect(() => {
    if (!product) return;
    const firstVariant = product.variants[0];
    setSelectedColor(firstVariant.color);
    setSelectedVariant(firstVariant);
  }, [product]);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const colors = Array.from(new Set(product.variants.map((v) => v.color)));

  const sizesByColor = (color: string) =>
    product.variants.filter((v) => v.color === color);

  const basePrice = Number(product.price);
  const priceDiff = Number(selectedVariant?.priceDiff || 0);
  const finalPrice = basePrice + priceDiff;
  const comparePrice = Number(product.compareAtPrice);

  const discount =
    comparePrice > finalPrice
      ? Math.round(((comparePrice - finalPrice) / comparePrice) * 100)
      : 0;

  const stock = selectedVariant?.stock ?? 0;

  const rating =
    product.reviews.reduce((a, r) => a + r.rating, 0) /
    (product.reviews.length || 1);

  // Inside your ProductPage component
  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/addToCart`,
        {
          userId: userData.id,
          productId: product.id,
          variantId: selectedVariant.id,
          quantity,
        }
      );

      if (res.status === 200 || res.status === 201) {
        dispatch(addItem(selectedVariant.id));
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart.");
    }
  };

  const addToWishlist = async (productId:string) => {
    try {
      const addWishlist = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist/${userData.id}`,
        {productId}
      );
      
      if (addWishlist.data.data.added) {
        toast.success("successfully added to wishlist");
      }else{
        toast.success("successfully removed from wishlist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span>{product.category.name}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#581c1c] font-medium truncate">
          {product.name}
        </span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <motion.div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </AnimatePresence>

            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-[#581c1c]">
                {discount}% OFF
              </Badge>
            )}
          </motion.div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-3/4 overflow-hidden rounded-lg border-2 ${
                  selectedImage === i
                    ? "border-[#581c1c]"
                    : "border-transparent"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-serif text-[#581c1c] mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-gray-400">
              ({product.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl font-medium">
              ${finalPrice.toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice && (
              <span className="line-through text-gray-400">
                ${comparePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-4 text-sm">
            {stock > 0 ? (
              <span className="text-green-700">
                In Stock ({stock} available)
              </span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm mb-2">
              Color: <span className="text-gray-600">{selectedColor}</span>
            </h3>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    const first = sizesByColor(color)[0];
                    setSelectedVariant(first);
                  }}
                  className={`px-4 py-2 rounded border text-sm ${
                    selectedColor === color
                      ? "bg-[#581c1c] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm mb-2">Size</h3>
            <div className="flex gap-2 flex-wrap">
              {sizesByColor(selectedColor!).map((v) => (
                <button
                  key={v.id}
                  disabled={v.stock <= 0}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded border text-sm ${
                    selectedVariant?.id === v.id
                      ? "bg-[#581c1c] text-white"
                      : "border-gray-300"
                  } ${v.stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex gap-4 mb-8 items-center">
            <div className="flex border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3"
              >
                <Minus />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3"
              >
                <Plus />
              </button>
            </div>

            <Button
              disabled={!selectedVariant || stock <= 0}
              className="flex-1 bg-[#581c1c]"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {stock > 0 ? "Add to Bag" : "Out of Stock"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                addToWishlist(product.id)
                setWishlisted(!wishlisted)
              }}
            >
              <Heart
                className={wishlisted ? "fill-red-500 text-red-500" : ""}
              />
            </Button>
          </div>

          <Separator />

          {/* Accordion for Description & Details */}
          <Accordion type="single" collapsible>
            <AccordionItem value="desc">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>{product.description}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>{product.details}</AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="text-[#581c1c]" /> Free delivery
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#581c1c]" /> Authentic product
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
