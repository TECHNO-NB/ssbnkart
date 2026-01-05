"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  Heart,
  ChevronDown,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
// NOTE: Make sure you have a logo image at this path or replace with your own
import logo from "@/../public/logo.jpeg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem, resetCart } from "@/redux/cartSlice";

// --- 1. DATA CONFIGURATION ---
const NAV_LINKS = [


  {
    id: "women",
    label: "Women",
    href: "/women",
    featured: true,
    columns: [
      {
        title: "All in New Arrivals",
        items: [{ label: "New Collection", href: "/products/woman/new" }],
      },
      {
        title: "Clothing",
        items: [
          { label: "Ethnic Wear", href: "/products/women/ethnic" },
          { label: "Western Wear", href: "/products/women/western" },
          { label: "Sarees", href: "/products/women/sarees" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { label: "Jewelry", href: "/products/women/jewelry" },
          { label: "Bags", href: "/products/women/bags" },
          { label: "Footwear", href: "/products/women/footwear" },
        ],
      },
    ],
  },
  {
    id: "men",
    label: "Men",
    href: "/men",
    featured: false,
    columns: [
      {
        title: "Clothing",
        items: [
          { label: "Kurtas", href: "/products/men/kurtas" },
          { label: "Shirts", href: "/products/men/shirts" },
          { label: "Trousers", href: "/products/men/trousers" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { label: "Footwear", href: "/products/men/footwear" },
          { label: "Watches", href: "/products/men/watches" },
        ],
      },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    href: "/kids",
    featured: false,
    columns: [
      {
        title: "Boys",
        items: [
          { label: "Ethnic Wear", href: "/products/kids/boys-ethnic" },
          { label: "Western Wear", href: "/products/kids/boys-western" },
        ],
      },
      {
        title: "Girls",
        items: [
          { label: "Ethnic Wear", href: "/products/kids/girls-ethnic" },
          { label: "Western Wear", href: "/products/kids/girls-western" },
        ],
      },
      {
        title: "Infants",
        items: [
          { label: "Infant Boys", href: "/products/kids/infant-boys" },
          { label: "Infant Girls", href: "/products/kids/infant-girls" },
        ],
      },
    ],
  },
  {
    id: "home",
    label: "Home & Living",
    href: "/home",
    featured: false,
    columns: [
      {
        title: "Home & Living",
        items: [
          { label: "Bed Linen", href: "/products/home/bed" },
          { label: "Cushions", href: "/products/home/cushions" },
          { label: "Curtains", href: "/products/home/curtains" },
        ],
      },
      // {
      //   title: "Furniture",
      //   items: [
      //     { label: "Living Room", href: "/products/home/living" },
      //     { label: "Bedroom", href: "/products/home/bedroom" },
      //     { label: "Dining", href: "/products/home/dining" },
      //   ],
      // },
    ],
  },
  { id: "collection", label: "Collection", href: "/productlisiting", featured: false },
   { id: "service", label: "Service", href: "/service", featured: false },
  // { id: "home&living", label: "Home & Living", href: "/home&living", featured: false },
  { id: "sale", label: "Sale", href: "/sale", featured: false },
];

// --- 2. SUB-COMPONENTS ---

// Type for your announcement data
interface Announcement {
  id: string;
  text: string;
  isActive: boolean;
  // Add other fields if your API returns them
}

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback announcements in case API fails or returns empty
  const FALLBACK_ANNOUNCEMENTS = [
    "Free Shipping on Orders Above $1000",
    "Festive Sale: Flat 20% Off on Kurtas",
    "New Arrivals: The Indigo Collection",
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/announcements`
        );
        const activeAnnouncements = response.data
          .filter((a: Announcement) => a.isActive)
          .map((a: Announcement) => a.text);

        if (activeAnnouncements.length > 0) {
          setAnnouncements(activeAnnouncements);
        } else {
          setAnnouncements(FALLBACK_ANNOUNCEMENTS);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        setAnnouncements(FALLBACK_ANNOUNCEMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements]); // Re-run effect when announcements change

  if (loading || announcements.length === 0) {
    // Optional: Return null or a skeleton/placeholder while loading
    // For a smoother UI, we might render nothing until loaded or just the empty bar
    return <div className="h-8 bg-[#581c1c]" />; 
  }

  return (
    <div className="bg-[#581c1c] text-white text-[10px] sm:text-[11px] py-2 overflow-hidden relative h-8 flex items-center justify-center tracking-widest uppercase font-medium z-50">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute px-4 text-center w-full truncate"
        >
          {announcements[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const totalCart=useSelector((state:any)=> state.cart);
  console.log(totalCart.items.length)
  const dispatch=useDispatch()



  // State for Desktop Hover Menu
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // State for Mobile Accordion
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<string | null>(
    null
  );

  const { scrollY } = useScroll();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const toggleMobileAccordion = (id: string) => {
    setMobileAccordionOpen(mobileAccordionOpen === id ? null : id);
  };

useEffect(() => {
  const fetchCartCount = async () => {
    if (!userData?.id) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/cartitemCount/${userData.id}`
      );

      if (res.data?.items) {
        dispatch(resetCart()); 
        res.data.items.forEach((id: string) => dispatch(addItem(id)));
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  fetchCartCount();


  }, [userData.id]);

  return (
    <>
      <AnnouncementBar />

      <motion.header
        onMouseLeave={handleMouseLeave}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b border-transparent bg-white",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-2"
            : "py-3 sm:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            {/* --- Mobile Menu Trigger --- */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            {/* --- Brand Logo --- */}
            <Link
              href="/"
              className="shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none"
            >
              <span
                className={cn(
                  "font-serif tracking-tighter text-[#581c1c] transition-all flex gap-2 items-center duration-300",
                  isScrolled ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                )}
              >
                {/* Replace with your Image component if needed */}
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full relative overflow-hidden">
                  <Image src={logo} alt="logo" fill className="object-cover" />
                </div>
                SSBN
              </span>
            </Link>

            {/* --- Desktop Navigation --- */}
            <nav className="hidden lg:flex items-center space-x-8 mx-auto h-full">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.id}
                  className="h-full flex items-center"
                  onMouseEnter={() => setActiveMenu(link.id)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "group relative text-sm font-medium transition-colors uppercase tracking-wider py-4",
                      activeMenu === link.id
                        ? "text-[#581c1c]"
                        : "text-gray-700 hover:text-[#581c1c]"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-0.5 bg-[#581c1c] transition-all duration-300",
                        activeMenu === link.id
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* --- Utility Icons --- */}
            <div className="flex items-center justify-end space-x-1 sm:space-x-4">
              {/* Desktop Expanding Search */}
              <div className="hidden sm:flex items-center">
              
                <button
                  onClick={() =>router.push("/search") }
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={() => router.push("/search")}
                className="sm:hidden p-2"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => router.push("/wishlist")}
                className="hidden sm:block p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => router.push("/account")}
                className="hidden sm:block p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => router.push("/cart")}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {totalCart.items.length > 0 ? (
                  <span className="absolute top-1 right-0.5 w-3.5 h-3.5 bg-[#581c1c] text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                    {totalCart.items.length}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP MEGA MENU OVERLAY --- */}
        <AnimatePresence>
          {activeMenu &&
            NAV_LINKS.find((l) => l.id === activeMenu)?.columns && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-xl z-30 hidden lg:block"
                onMouseEnter={() => setActiveMenu(activeMenu)}
              >
                <div className="max-w-7xl mx-auto px-8 py-8">
                  <div className="grid grid-cols-4 gap-8">
                    {NAV_LINKS.find((l) => l.id === activeMenu)?.columns?.map(
                      (col, idx) => (
                        <div key={idx} className="space-y-4">
                          <h3 className="text-[#581c1c] font-bold text-sm uppercase tracking-widest border-b border-gray-100 pb-2">
                            {col.title}
                          </h3>
                          <ul className="space-y-3">
                            {col.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <Link
                                  href={item.href}
                                  className="text-gray-500 hover:text-[#581c1c] hover:translate-x-1 transition-all inline-block text-sm"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}

                    {/* Optional Image for specific categories */}
                    {(activeMenu === "women" || activeMenu === "men") && (
                      <div className="relative h-full min-h-50 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                        Promotion Image Area
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </motion.header>

      {/* --- MOBILE DRAWER MENU (RESPONSIVE) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white z-50 shadow-xl overflow-y-auto lg:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 flex items-center justify-between border-b shrink-0">
                <span className="font-serif text-2xl text-[#581c1c] font-bold">
                  SSBN
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Links Area */}
              <div className="flex-1 overflow-y-auto py-2">
                {NAV_LINKS.map((link) => {
                  const hasSubMenu = link.columns && link.columns.length > 0;
                  const isOpen = mobileAccordionOpen === link.id;

                  return (
                    <div key={link.id} className="border-b border-gray-50">
                      {/* Main Category Link/Button */}
                      <div
                        className={cn(
                          "flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors",
                          isOpen && "bg-gray-50"
                        )}
                        onClick={() =>
                          hasSubMenu
                            ? toggleMobileAccordion(link.id)
                            : (() => {
                                router.push(link.href);
                                setIsMobileMenuOpen(false);
                              })()
                        }
                      >
                        <span
                          className={cn(
                            "font-medium uppercase tracking-wide text-sm transition-colors",
                            isOpen ? "text-[#581c1c]" : "text-gray-800"
                          )}
                        >
                          {link.label}
                        </span>

                        {hasSubMenu ? (
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-gray-400 transition-transform duration-300",
                              isOpen ? "rotate-180 text-[#581c1c]" : ""
                            )}
                          />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      {/* Submenu Accordion */}
                      <AnimatePresence>
                        {hasSubMenu && isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50"
                          >
                            <div className="px-6 pb-6 pt-2 space-y-6">
                              {link.columns?.map((col, idx) => (
                                <div key={idx} className="space-y-3">
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {col.title}
                                  </h4>
                                  <ul className="space-y-2 border-l-2 border-gray-200 pl-4">
                                    {col.items.map((item, i) => (
                                      <li key={i}>
                                        <Link
                                          href={item.href}
                                          onClick={() =>
                                            setIsMobileMenuOpen(false)
                                          }
                                          className="text-sm text-gray-600 hover:text-[#581c1c] block py-1 transition-colors"
                                        >
                                          {item.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Footer Links (Sticky Bottom) */}
              <div className="px-6 py-6 bg-gray-100 shrink-0 space-y-4 border-t border-gray-200">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-gray-600"
                >
                  <User className="w-5 h-5" /> My Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-gray-600"
                >
                  <Heart className="w-5 h-5" /> Wishlist
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}