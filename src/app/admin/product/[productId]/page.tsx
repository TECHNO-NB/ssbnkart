"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ArrowLeft, Plus, Trash2, Save, Loader2, Edit2 } from "lucide-react"
import Link from "next/link"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"

export default function ProductEditPage() {
  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const params = useParams()

  // Variant Dialogs
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false)
  const [variantForm, setVariantForm] = useState({ id: "", sku: "", size: "", color: "", stock: 0, price: "" })
  const [isEditing, setIsEditing] = useState(false) // track if updating variant

  // --- Fetch Data ---
  useEffect(() => {
    const init = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products/${params.productId}`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/category`)
        ])
        setProduct(prodRes.data)
        setCategories(catRes.data)
      } catch (error) {
        toast.error("Failed to load product data")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [params.productId])

  // --- Handlers ---

  const handleSaveProduct = async () => {
    setIsSaving(true)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products/${params.productId}`, {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        categoryId: product.categoryId,
        status: product.status
      })
      toast.success("Product saved successfully")
    } catch (error) {
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  // Open Add Variant Dialog
  const openAddVariantDialog = () => {
    setVariantForm({ id: "", sku: "", size: "", color: "", stock: 0, price: "" })
    setIsEditing(false)
    setIsVariantDialogOpen(true)
  }

  // Open Edit Variant Dialog
  const openEditVariantDialog = (variant: any) => {
    setVariantForm({ 
      id: variant.id, 
      sku: variant.sku, 
      size: variant.size, 
      color: variant.color, 
      stock: variant.stock, 
      price: variant.price || "" 
    })
    setIsEditing(true)
    setIsVariantDialogOpen(true)
  }

  // Add or Update Variant
  const handleSaveVariant = async () => {
    try {
      if (isEditing) {
        // Update
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/variants/${variantForm.id}`, {
          ...variantForm,
          price: variantForm.price ? parseFloat(variantForm.price) : null
        })
        setProduct((prev: any) => ({
          ...prev,
          variants: prev.variants.map((v: any) => v.id === variantForm.id ? res.data : v)
        }))
        toast.success("Variant updated")
      } else {
        // Add
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/variants/products/${params.productId}/variants`, {
          ...variantForm,
          price: variantForm.price ? parseFloat(variantForm.price) : null
        })
        setProduct((prev: any) => ({
          ...prev,
          variants: [...prev.variants, res.data.variant]
        }))
        toast.success("Variant added")
      }
      setIsVariantDialogOpen(false)
      setVariantForm({ id: "", sku: "", size: "", color: "", stock: 0, price: "" })
    } catch (error) {
      toast.error("Failed to save variant")
    }
  }

  // Delete Variant
  const handleDeleteVariant = async (variantId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/variants/${variantId}`)
      setProduct((prev: any) => ({
        ...prev,
        variants: prev.variants.filter((v: any) => v.id !== variantId)
      }))
      toast.success("Variant deleted")
    } catch (error) {
      toast.error("Failed to delete variant")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/20">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">

        {/* --- Header Actions --- */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={product.status === 'Active' ? 'default' : 'secondary'} className={product.status === 'Active' ? "bg-green-600" : ""}>
                {product.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveProduct} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save Product
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">

          {/* --- LEFT COLUMN --- */}
          <div className="flex flex-col gap-8">

            {/* 1. Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    className="min-h-[120px]"
                    value={product.description || ""}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Variants */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Variants</CardTitle>
                <Button variant="secondary" size="sm" onClick={openAddVariantDialog}>
                  <Plus className="mr-2 h-4 w-4" /> Add Variant
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((variant: any) => (
                      <TableRow key={variant.id}>
                        <TableCell className="font-mono text-xs">{variant.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="mr-2">{variant.size}</Badge>
                          <span className="text-sm text-slate-500">{variant.color}</span>
                        </TableCell>
                        <TableCell>$ {variant.price || product.price}</TableCell>
                        <TableCell>{variant.stock}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditVariantDialog(variant)}>
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteVariant(variant.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="flex flex-col gap-8">

            {/* Status */}
            <Card>
              <CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent>
                <Select
                  value={product.status}
                  onValueChange={(val) => setProduct({ ...product, status: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Organization */}
            <Card>
              <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Base Price</Label>
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={product.categoryId || ""}
                    onValueChange={(val) => setProduct({ ...product, categoryId: val })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* --- VARIANT DIALOG (Add / Edit) --- */}
        <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Variant" : "Add Variant"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label>SKU</Label>
                <Input
                  placeholder="Enter SKU"
                  value={variantForm.sku}
                  onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Size</Label>
                  <Input
                    placeholder="Enter size or select"
                    value={variantForm.size}
                    onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
                    list="size-options"
                  />
                  <datalist id="size-options">
                    <option value="S" />
                    <option value="M" />
                    <option value="L" />
                    <option value="XL" />
                    <option value="XXL" />
                  </datalist>
                </div>

                <div>
                  <Label>Color</Label>
                  <Input
                    placeholder="Enter color or select"
                    value={variantForm.color}
                    onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                    list="color-options"
                  />
                  <datalist id="color-options">
                    <option value="Red" />
                    <option value="Blue" />
                    <option value="Black" />
                    <option value="White" />
                    <option value="Indigo" />
                  </datalist>
                </div>
              </div>

              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={variantForm.stock}
                  onChange={(e) =>
                    setVariantForm({ ...variantForm, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <Label>Price Difference (optional)</Label>
                <Input
                  type="number"
                  value={variantForm.price}
                  onChange={(e) =>
                    setVariantForm({ ...variantForm, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSaveVariant}>{isEditing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}
