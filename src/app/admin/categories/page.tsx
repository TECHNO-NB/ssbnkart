"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FolderTree, Plus, Trash2, Edit2, Loader2, AlertCircle } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

// Shadcn Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

// Types
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string | null
  parentName: string
  count: number // product count
}

export default function CategoriesPage() {
  // --- State ---
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "none"
  })

  // --- API Actions ---

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/category`)
      setCategories(res.data)
    } catch (error) {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.slug) {
      toast.error("Name and Slug are required")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        ...formData,
        parentId: formData.parentId === "none" ? null : formData.parentId
      }

      if (selectedCategory) {
        // Update Existing
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/category/${selectedCategory.id}`, payload)
        toast.success("Category updated successfully")
      } else {
        // Create New
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/category`, payload)
        toast.success("Category created successfully")
      }

      setIsDialogOpen(false)
      fetchCategories() // Refresh data
    } catch (error: any) {
      const msg = error.response?.data?.error || "Something went wrong"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return
    try {
      setIsSubmitting(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/categories/${selectedCategory.id}`)
      toast.success("Category deleted")
      setIsDeleteDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      const msg = error.response?.data?.error || "Failed to delete"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Handlers ---

  const openCreateDialog = () => {
    setSelectedCategory(null)
    setFormData({ name: "", slug: "", description: "", parentId: "none" })
    setIsDialogOpen(true)
  }

  const openEditDialog = (cat: Category) => {
    setSelectedCategory(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "none"
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (cat: Category) => {
    setSelectedCategory(cat)
    setIsDeleteDialogOpen(true)
  }

  // Helper to auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // If creating new, auto-generate slug. If editing, don't force it.
    if (!selectedCategory) {
      const generatedSlug = val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      setFormData(prev => ({ ...prev, name: val, slug: generatedSlug }))
    } else {
      setFormData(prev => ({ ...prev, name: val }))
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
            <p className="text-sm text-muted-foreground">Organize your products hierarchy.</p>
          </div>
          <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* Categories Table */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> Loading...
                      </div>
                   </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No categories found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 rounded text-indigo-600">
                        <FolderTree className="h-4 w-4" />
                      </div>
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono bg-slate-50 px-2 py-1 rounded w-fit">
                      {cat.slug}
                    </TableCell>
                    <TableCell>
                       {cat.parentName !== '-' ? (
                         <Badge variant="outline" className="text-slate-600">
                            {cat.parentName}
                         </Badge>
                       ) : (
                         <span className="text-xs text-slate-400 italic">Top Level</span>
                       )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {cat.count}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(cat)}>
                        <Edit2 className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openDeleteDialog(cat)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- CREATE / EDIT DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>{selectedCategory ? "Edit Category" : "Create Category"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleNameChange}
                  placeholder="e.g. Summer Collection" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug" 
                  value={formData.slug} 
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="summer-collection" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select 
                  value={formData.parentId} 
                  onValueChange={(val) => setFormData({...formData, parentId: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {categories
                      .filter(c => c.id !== selectedCategory?.id) // Prevent selecting self as parent
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Category description for SEO..." 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (selectedCategory ? "Save Changes" : "Create Category")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- DELETE CONFIRMATION --- */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the category <span className="font-bold text-slate-900">"{selectedCategory?.name}"</span>.
                {selectedCategory?.count && selectedCategory.count > 0 ? (
                   <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs rounded flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Warning: This category contains {selectedCategory.count} products.
                   </div>
                ) : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => { e.preventDefault(); handleDelete(); }} 
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </div>
  )
}