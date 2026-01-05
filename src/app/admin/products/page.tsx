"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { AdminSidebar } from "@/components/admin/Sidebar";

// shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// types
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  category?: string;
  stock?: number;
  variants?: number;
  status?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // create form
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    categoryId: "",
    price: "",
    compareAtPrice: "",
    isFeatured: false,
    description: "",
  });

  // images
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // ---------------- FETCH ----------------
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products`,
          { params: { search: searchQuery } }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/category`
        ),
      ]);

      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchData, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ---------------- HELPERS ----------------
  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    setNewProduct((p) => ({ ...p, name: val, slug }));
  };

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const list = Array.from(files);

    if (images.length + list.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // append new images
    setImages((prev) => [...prev, ...list]);
    setImagePreviews((prev) => [
      ...prev,
      ...list.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- CREATE ----------------
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.slug || !newProduct.price) {
      toast.error("Please fill required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("slug", newProduct.slug);
      formData.append("categoryId", newProduct.categoryId);
      formData.append("price", newProduct.price);
      formData.append("compareAtPrice", newProduct.compareAtPrice);
      formData.append("description", newProduct.description);
      // Fixed: FormData expects strings, not booleans
      formData.append("isFeatured", String(newProduct.isFeatured));

      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Product created");
      setIsCreateOpen(false);
      fetchData();

      setNewProduct({
        name: "",
        slug: "",
        categoryId: "",
        price: "",
        compareAtPrice: "",
        isFeatured: false,
        description: "",
      });
      setImages([]);
      setImagePreviews([]);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products/${selectedProduct.id}`
      );
      toast.success("Deleted");
      setIsDeleteOpen(false);
      fetchData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-sm text-muted-foreground">
              Manage catalog and inventory
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-150">
              <DialogHeader>
                <DialogTitle>Create Product</DialogTitle>
                <DialogDescription>
                  Upload product details and images (max 5)
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />

                <Input
                  placeholder="Slug"
                  value={newProduct.slug}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, slug: e.target.value })
                  }
                />

                <Select
                  onValueChange={(v) =>
                    setNewProduct({ ...newProduct, categoryId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Compare at price (MRP)"
                  value={newProduct.compareAtPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      compareAtPrice: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
                {/* ---------------- FIXED isFeatured ---------------- */}
                <div className="space-y-1">
                  <Label>Is Featured?</Label>
                  <Select
                    value={newProduct.isFeatured ? "true" : "false"}
                    onValueChange={(value) =>
                      setNewProduct({
                        ...newProduct,
                        isFeatured: value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes, Featured</SelectItem>
                      <SelectItem value="false">No, Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* -------------------------------------------------- */}

                {/* IMAGE UPLOAD */}
                <div className="space-y-2">
                  <Label>Product Images (max 5)</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files)}
                  />

                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative">
                          <img
                            src={src}
                            className="h-20 w-20 rounded border object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleCreateProduct}
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        {/* TABLE */}
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Images</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto animate-spin" />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="flex gap-1">
                      {Array.isArray(p.image) ? (
                        // @ts-ignore
                        p.image.slice(0, 5).map((img: string, idx: number) => (
                          <Avatar key={idx}>
                            <AvatarImage src={img} />
                            <AvatarFallback>
                              <ImageIcon />
                            </AvatarFallback>
                          </Avatar>
                        ))
                      ) : (
                        <Avatar>
                          <AvatarImage src={p.image} />
                          <AvatarFallback>
                            <ImageIcon />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/product/${p.id}`}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* DELETE DIALOG */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}