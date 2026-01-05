"use client";

import * as React from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface AddressDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
  initialData?: Partial<{
    addressId: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    type: string;
    isDefault: boolean;
  }>;
  onSuccess?: () => void;
}

export const AddressDialog: React.FC<AddressDialogProps> = ({
  isOpen,
  setIsOpen,
  userId,
  initialData,
  onSuccess,
}) => {
  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    addressId: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    type: "HOME",
    isDefault: false,
  });

  React.useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<(HTMLInputElement) | HTMLSelectElement | any>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/address/${userId}`, { ...form });
      setIsOpen(false);
      setForm({
        addressId: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        type: "HOME",
        isDefault: false,
      });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogTitle>{form.addressId ? "Edit Address" : "Create Address"}</DialogTitle>
        <DialogDescription>Fill in your address details.</DialogDescription>

        <div className="grid gap-4 mt-4">
          <Input placeholder="Street" name="street" value={form.street} onChange={handleChange} />
          <Input placeholder="City" name="city" value={form.city} onChange={handleChange} />
          <Input placeholder="State" name="state" value={form.state} onChange={handleChange} />
          <Input placeholder="ZIP Code" name="zipCode" value={form.zipCode} onChange={handleChange} />
          <Input placeholder="Country" name="country" value={form.country} onChange={handleChange} />
          <Input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />

          <select name="type" value={form.type} onChange={handleChange} className="border rounded px-2 py-1">
            <option value="HOME">HOME</option>
            <option value="WORK">WORK</option>
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
            Default Address
          </label>

          <div className="flex gap-2 mt-2">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : form.addressId ? "Update" : "Create"}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
