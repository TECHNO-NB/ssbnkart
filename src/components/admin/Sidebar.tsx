"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Package,
  Truck,
  Megaphone,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  LifeBuoy,
  Clapperboard,
  FolderTree,
  LogOut,
  Star,
  GalleryVertical,
  Flame,
} from "lucide-react";

import { cn } from "@/lib/utils"; // Assuming you have a cn utility, or use template literals
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import toast from "react-hot-toast";

const sidebarGroups = [
  {
    label: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/admin" }],
  },
  {
    label: "Store Management",
    items: [
      { icon: ShoppingBag, label: "Products", href: "/admin/products" },
      { icon: FolderTree, label: "Categories", href: "/admin/categories" },
      { icon: Package, label: "Inventory", href: "/admin/inventory" },
      { icon: Truck, label: "Orders", href: "/admin/orders" },
    ],
  },
  {
    label: "Customers & Support",
    items: [
      { icon: Users, label: "Customers", href: "/admin/customers" },
      { icon: Mail, label: "Email Support", href: "/admin/support/email" },
      { icon: Star, label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    label: "Marketing & Content",
    items: [
      { icon: GalleryVertical, label: "Banners", href: "/admin/banners" },
      { icon: Flame, label: "Featured", href: "/admin/marketing/featured" },
      {
        icon: ImageIcon,
        label: "Featured Category",
        href: "/admin/marketing/featured-category",
      },
      { icon: Flame, label: "Featured Banner", href: "/admin/marketing/featured-banner" },
      { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
      {
        icon: MessageSquare,
        label: "Email Campaigns",
        href: "/admin/marketing/email",
      },
      { icon: Clapperboard, label: "Vlog", href: "/admin/vlog" },
    ],
  },
  {
    label: "System",
    items: [{ icon: Settings, label: "Settings", href: "/admin/settings" }],
  },
];

export function AdminSidebar() {

  const router=useRouter()

    const logout = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`
    );

    if (response.data) {
      toast.success("Logout Success");
      router.push("/auth/login");
    }
  };
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-slate-50/40 min-h-screen w-65 flex-col lg:flex sticky top-0 h-screen">
      {/* --- Logo Header --- */}
      <div className="flex h-24 mt-4 items-center border-b px-6 bg-white/50 backdrop-blur-sm">
        <Link className="flex items-center gap-2 font-bold" href="/">
          <div className="h-8 w-8 rounded-lg mb-5 bg-indigo-600 flex items-center justify-center text-white">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="text-xl mb-5 text-indigo-950 tracking-tight">
            SSBN Admin
          </span>
        </Link>
      </div>

      {/* --- Navigation Links (Scrollable) --- */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-4">
          {sidebarGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {/* Group Label */}
              <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </h4>

              {/* Group Items */}
              <div className="grid gap-1">
                {group.items.map((item, index) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-indigo-600" : "text-slate-500"
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* --- User Footer --- */}
      <div className="mt-auto border-t p-4 bg-white/50">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <span className="text-sm font-semibold text-slate-900">
                Admin 
              </span>
              <span className="text-xs text-slate-500">admin@ssbnkart.com</span>
            </div>
          </div>
        </div>

        <Button
        onClick={logout}
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
