"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Gift,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator"; // Added Separator import
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { removeItem } from "@/redux/cartSlice";
import toast from "react-hot-toast";

const FREE_SHIPPING_THRESHOLD = 10000; // Base Currency (USD)
const TAX_RATE = 0.18;

type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  stock: number;
  image: string;
  inStock: boolean;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const userData = useSelector((state: any) => state.user);
  
  // 1. Get Currency Data from Redux
  const { data: currencyData } = useSelector((state: any) => state.currency);
  const router = useRouter();

  // 2. Define Rate & Code Logic
  const rate = currencyData?.rates || 1;
  const currencyCode = currencyData?.currencyCode || "USD";

  // 3. Helper: Format Price
  // We keep calculations in USD, but convert only for display
  const formatPrice = (amount: number) => {
    const converted = amount * rate;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  // ---------------- FETCH CART ----------------
  useEffect(() => {
    async function fetchCart() {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${userData.id}`
        );

        const apiItems = res.data?.data?.getAllCartItems?.[0]?.items || [];

        const formattedItems: CartItem[] = apiItems.map((item: any) => {
          const basePrice = Number(item.product.price);
          const priceDiff = Number(item.productVariant?.priceDiff ?? 0);
          const finalPrice = basePrice + priceDiff;

          return {
            id: item.id,
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name,
            price: finalPrice,
            quantity: item.quantity,
            size: item.productVariant?.size || "N/A",
            color: item.productVariant?.color || "N/A",
            stock: item.productVariant?.stock ?? 0,
            image: item.product.images?.[0] || "/placeholder.png",
            inStock: (item.productVariant?.stock ?? 0) > 0,
          };
        });

        setCartItems(formattedItems);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userData?.id) {
      fetchCart();
    } else {
      toast.error("You are not login!");
      router.push("/auth/login");
    }
  }, [userData?.id]);

  // ---------------- CALCULATIONS (Done in BASE Currency) ----------------
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // Logic remains in USD (10000 limit)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250; 
  const tax = Math.round(subtotal * TAX_RATE);
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  const progressPercentage = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );
  const amountNeeded = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  // ---------------- HANDLERS ----------------
  const updateQuantity = async (id: string, change: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    try {
      if (change === 1 && item.quantity < item.stock) {
        axios.defaults.withCredentials = true;
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/increment/${id}`
        );
      } else if (change === -1 && item.quantity > 1) {
        axios.defaults.withCredentials = true;
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/decrement/${id}`
        );
      } else {
        return;
      }

      setCartItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(i.stock, Math.max(1, i.quantity + change)) }
            : i
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeItemCart = async (id: string) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/removecartItem/${id}`
      );
      dispatch(removeItem(id));
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  // ---------------- UI STATES ----------------
  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return <EmptyCartState />;
  }

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-[#581c1c] mb-6">
          Shopping Bag ({cartItems.length})
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-5 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-[#581c1c]" />
                <span className="text-sm">
                  {amountNeeded > 0
                    ? `Add ${currencyCode} ${formatPrice(amountNeeded)} more for free shipping`
                    : "You unlocked FREE shipping 🎉"}
                </span>
              </div>
              <Progress value={progressPercentage} />
            </div>

            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-5 rounded-xl border flex gap-5"
                >
                  <img
                    src={item.image}
                    className="w-28 h-36 object-cover rounded"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <button onClick={() => removeItemCart(item.id)}>
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.color} | Size: {item.size}
                    </p>

                    <p className="text-[#581c1c] font-semibold mt-1">
                      {/* DYNAMIC PRICE PER ITEM */}
                      {currencyCode} {formatPrice(item.price)}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="px-3"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-3"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="font-semibold">
                         {/* DYNAMIC TOTAL PER ITEM */}
                         {currencyCode} {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-95 sticky top-24 h-fit space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="font-serif text-xl text-[#581c1c] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currencyCode} {formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `${currencyCode} ${formatPrice(shipping)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>{currencyCode} {formatPrice(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{currencyCode} {formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-8 bg-[#581c1c]"
                onClick={() => {
                  setIsCheckingOut(true);
                  router.push("/checkout");
                }}
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Gift className="w-5 h-5" />
                  <span>Gift Wrap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- EMPTY CART ----------------
function EmptyCartState() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <ShoppingBag size={48} className="text-gray-400 mb-4" />
      <h2 className="text-2xl font-serif text-[#581c1c]">Your Bag is Empty</h2>
      <Link href="/productlisting">
        <Button className="mt-6 bg-[#581c1c]">Start Shopping</Button>
      </Link>
    </div>
  );
}