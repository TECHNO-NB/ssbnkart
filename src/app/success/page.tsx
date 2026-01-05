'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, ArrowRight, ShoppingBag, Truck, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // 1. Simulate fetching real Order ID from session
      // In reality, you might call an API here
      setOrderId(`ORD-${sessionId.slice(-8).toUpperCase()}`);

      // 2. Trigger Confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        {/* Top Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-green-500 to-emerald-700" />

        <div className="p-8 md:p-12 text-center">
          
          {/* Animated Icon */}
          <div className="mx-auto mb-8 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 rounded-full border border-green-100 animate-ping opacity-20 duration-1000" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200"
              >
                <Check className="h-8 w-8 text-white stroke-[3]" />
              </motion.div>
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Thank you for your purchase. We have received your order and will begin processing it right away.
          </p>

          {/* Order Details Card */}
          <div className="bg-gray-50/80 rounded-2xl p-6 mb-8 text-left border border-gray-100 shadow-inner">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Reference</p>
                <p className="font-mono text-lg font-medium text-gray-900 tracking-wide">
                  {orderId || "Generating..."}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                <p className="text-sm font-medium text-gray-900">3-5 Business Days</p>
              </div>
            </div>
            
            <Separator className="bg-gray-200 mb-6" />

            {/* Timeline */}
            <div className="relative flex justify-between items-center">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-gray-200 -z-10" />
              
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs shadow-sm ring-4 ring-white">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">Confirmed</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center text-xs ring-4 ring-white">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Shipped</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center text-xs ring-4 ring-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Delivered</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black gap-2 text-base rounded-xl transition-all">
                <ShoppingBag className="w-4 h-4" /> Return Home
              </Button>
            </Link>
            
            <Link href="/account/orders" className="flex-1">
              <Button className="w-full h-12 bg-gray-900 hover:bg-black text-white gap-2 text-base rounded-xl shadow-lg hover:shadow-xl transition-all">
                View Order <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

// Main page component wrapped in Suspense for Next.js boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#faf9f6]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}