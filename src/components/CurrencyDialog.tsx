"use client";

import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define your supported currencies here
const CURRENCIES = [
  { code: "USD", name: "United States Dollar", flag: "🇺🇸"},
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵"},
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦"},
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "EUR", name: "Euro", flag: "🇪🇺"},
];

export default function CurrencyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>("");

  useEffect(() => {
    // 1. Check if currency is already saved in LocalStorage
    const savedCurrency = localStorage.getItem("user_currency");

    // 2. If NOT saved, open the dialog automatically
    if (!savedCurrency) {
      setIsOpen(true);
    }
  }, []);

  const handleSave = (currencyCode: string) => {
    // Find the full currency object based on the code selected
    const currencyData = CURRENCIES.find((c) => c.code === currencyCode);

    if (currencyData) {
      // 3. Save the selected object to LocalStorage
      localStorage.setItem("user_currency", JSON.stringify(currencyData));
      
      // 4. Close the dialog
      setIsOpen(false);
      
      // Optional: Refresh the page to apply the currency change globally immediately
      window.location.reload(); 
    }
  };

  const handleSetDefault = () => {
    // Quick button to set USD as default
    handleSave("USD");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* We use onPointerDownOutside and onEscapeKeyDown to prevent 
        closing the modal by clicking outside. User MUST make a choice. 
      */}
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto bg-blue-50 p-3 rounded-full mb-2 w-fit">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl">Select Your Currency</DialogTitle>
          <DialogDescription className="text-center">
            We noticed you haven't set a currency yet. Please select one to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select onValueChange={setSelectedCode} value={selectedCode}>
            <SelectTrigger className="w-full h-12 text-lg">
              <SelectValue placeholder="Choose currency..." />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code} className="py-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currency.flag}</span>
                    <span className="font-semibold">{currency.code}</span>
                    <span className="text-slate-400 text-sm hidden sm:inline-block">
                      - {currency.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button 
            className="w-full h-11 text-md" 
            onClick={() => handleSave(selectedCode)}
            disabled={!selectedCode} // Disable until they pick something
          >
            Confirm Currency
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <Button 
            variant="outline" 
            className="w-full text-slate-600"
            onClick={handleSetDefault}
          >
            Use Default (USD)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}