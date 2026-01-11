"use client";

import { useEffect, useState } from "react";
import { Edit2, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import toast, { Toaster } from "react-hot-toast";
import { AdminSidebar } from "@/components/admin/Sidebar";

// 1. Define the Interface for Type Safety
interface Currency {
  currencyCode: string;
  countryCode: string;
  rates: number;
}

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/currencies`;
const ADMIN_KEY = "secret123";

export default function AdminDashboard() {
  // 2. Use the Interface in State
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [newRate, setNewRate] = useState<string>("");

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setCurrencies(data);
    } catch (error) {
      console.error("Failed to fetch", error);
      toast.error("Failed to load currencies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleEditClick = (currency: Currency) => {
    setEditingCurrency(currency);
    setNewRate(currency.rates.toString());
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingCurrency) return;

    // Basic Validation
    if (!newRate || isNaN(parseFloat(newRate))) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${editingCurrency.currencyCode}`, {
        method: "PUT",
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRate: parseFloat(newRate) }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setCurrencies((prev) =>
        prev.map((c) =>
          c.currencyCode === editingCurrency.currencyCode
            ? { ...c, rates: parseFloat(newRate) }
            : c
        )
      );

      toast.success(`Updated ${editingCurrency.currencyCode} to ${newRate}`);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Could not update currency rate.");
    }
  };

  return (
    // 3. Layout: Flex container to put Sidebar next to Content
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar (Fixed width or responsive) */}
      <div className="hidden md:block w-64 border-r bg-white">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {/* Toaster for Notifications */}
        <Toaster position="top-right" />

        <div className="mx-auto max-w-5xl mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Currency Rates
            </h1>
            <p className="text-slate-500">Manage daily exchange rates</p>
          </div>
          <Button variant="outline" onClick={fetchCurrencies} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currencies.map((currency) => (
            <Card key={currency.currencyCode} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {currency.countryCode} / USD
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                  {currency.currencyCode}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {currency.rates.toFixed(2)}
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    curr / USD
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  1 {currency.currencyCode} = {(1 / currency.rates).toFixed(2)} USD
                </p>

                <Button
                  onClick={() => handleEditClick(currency)}
                  className="w-full mt-4"
                  variant="secondary"
                >
                  <Edit2 className="mr-2 h-4 w-4" /> Edit Rate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Rate</DialogTitle>
            <DialogDescription>
              Update the exchange rate for {editingCurrency?.currencyCode}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">
                Rate
              </Label>
              <Input
                id="rate"
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Enter the amount of {editingCurrency?.currencyCode} equal to $1 USD.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}