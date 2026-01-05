"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Megaphone } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Announcement {
  id: string
  text: string
  isActive: boolean
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({ text: "", isActive: true })

  // --- Fetch Data ---
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/announcements`)
      setAnnouncements(res.data)
    } catch (error) {
      toast.error("Failed to fetch announcements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  // --- Handlers ---
  const openCreateDialog = () => {
    setSelectedItem(null)
    setFormData({ text: "", isActive: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: Announcement) => {
    setSelectedItem(item)
    setFormData({ text: item.text, isActive: item.isActive })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.text) {
      toast.error("Please enter announcement text")
      return
    }

    setIsSubmitting(true)
    try {
      if (selectedItem) {
        // Update
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/announcements/${selectedItem.id}`, formData)
        toast.success("Announcement updated")
      } else {
        // Create
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/announcements`, formData)
        toast.success("Announcement created")
      }
      setIsDialogOpen(false)
      fetchAnnouncements()
    } catch (error) {
      toast.error("Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/announcements/${id}`)
      toast.success("Deleted successfully")
      fetchAnnouncements()
    } catch (error) {
      toast.error("Failed to delete")
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
            <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
            <p className="text-sm text-muted-foreground">Manage the text shown on the top notification bar.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Announcement
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Announcement Text</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No announcements found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                        <Megaphone className="h-4 w-4 text-slate-400" />
                        {item.text}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "outline"} className={item.isActive ? "bg-green-600" : ""}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(item)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
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

        {/* --- CREATE/EDIT DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedItem ? "Edit Announcement" : "New Announcement"}</DialogTitle>
              <DialogDescription>Enter the text to display on the top bar.</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                    <Label>Announcement Text</Label>
                    <Input 
                        value={formData.text} 
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })} 
                        placeholder="e.g. Free shipping on orders over $50..." 
                    />
                </div>

                <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="space-y-0.5">
                        <Label>Active Status</Label>
                        <p className="text-xs text-muted-foreground">Show this bar at the top of the site</p>
                    </div>
                    <Switch 
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}