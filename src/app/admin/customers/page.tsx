"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Mail, Phone, MoreHorizontal, Loader2, AlertCircle } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// --- TypeScript Interface matching Controller Response ---
interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN" | "SUPPORT"
  orders: number
  spent: string // Formatted string like "$1,200.00"
  status: "Active" | "Blocked" | "Pending"
  joinedAt: string
}

export default function CustomersPage() {
  // --- State Management ---
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dialog & Editing State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // --- Fetch Data ---
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customer`, {
        params: { search: searchQuery }
      })
      setUsers(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  // Effect for initial load and search (Debounce could be added here for prod)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 500) // 500ms debounce
    return () => clearTimeout(timer)
  }, [searchQuery])

  // --- Handlers ---
  const handleEditClick = (user: User) => {
    setSelectedUser({ ...user }) // Create a copy to edit
    setIsDialogOpen(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedUser) return

    setIsSaving(true)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customer/${selectedUser.id}`, {
        role: selectedUser.role,
        status: selectedUser.status
      })
      
      toast.success("Customer profile updated successfully")
      setIsDialogOpen(false)
      fetchUsers() // Refresh list to show new data
    } catch (error) {
      console.error(error)
      toast.error("Failed to update customer")
    } finally {
      setIsSaving(false)
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
            <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
            <p className="text-sm text-muted-foreground">View and manage your user base.</p>
          </div>
          <Button onClick={() => fetchUsers()} variant="outline" size="sm" disabled={loading}>
             Refresh List
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Customer Info</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                     <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> Loading customers...
                     </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No customers found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          user.role === 'ADMIN' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' : 
                          user.role === 'SUPPORT' ? 'border-orange-200 text-orange-700 bg-orange-50' : ''
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{user.orders}</TableCell>
                    <TableCell>{user.spent}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        user.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                           user.status === 'Active' ? 'bg-green-600' : 
                           user.status === 'Blocked' ? 'bg-red-600' : 'bg-slate-500'
                        }`} />
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(user)}>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- EDIT DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>
                Update role permissions and account status.
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="grid gap-6 py-4">
                {/* User Header in Dialog */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                  <Avatar className="h-12 w-12">
                     <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.name}`} />
                     <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-base">{selectedUser.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {selectedUser.email}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {/* Role Selection */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Role</Label>
                    <div className="col-span-3">
                      <Select 
                        value={selectedUser.role} 
                        onValueChange={(val: any) => setSelectedUser({...selectedUser, role: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="SUPPORT">Support Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div className="col-span-3">
                      <Select 
                         value={selectedUser.status}
                         onValueChange={(val: any) => setSelectedUser({...selectedUser, status: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Blocked">Blocked</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div className="flex flex-col gap-1 p-3 border rounded-md">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-bold">{selectedUser.orders}</span>
                   </div>
                   <div className="flex flex-col gap-1 p-3 border rounded-md">
                      <span className="text-muted-foreground">Lifetime Spent</span>
                      <span className="font-bold text-green-600">{selectedUser.spent}</span>
                   </div>
                </div>

              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}