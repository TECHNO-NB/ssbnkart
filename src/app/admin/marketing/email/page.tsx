"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Mail, Send, Users, FileText, Clock, MoreHorizontal, Eye, Loader2, ArrowUpRight } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
interface Campaign {
  id: string
  subject: string
  audience: string
  sent: number
  opened: string
  status: "SENT" | "DRAFT"
  date: string
}

export default function EmailMarketingPage() {
  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  // Form State
  const [emailForm, setEmailForm] = useState({
    subject: "",
    body: "Hi {{name}},\n\nWe are excited to announce our latest collection...",
    recipient: "all"
  })

  // --- 1. Fetch Campaigns ---
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/marketing/campaigns`)
      setCampaigns(res.data)
    } catch (error) {
      console.error("Failed to fetch campaigns", error)
      toast.error("Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  // --- 2. Send Campaign Handler ---
  const handleSendCampaign = async () => {
    if (!emailForm.subject || !emailForm.body) {
      toast.error("Please fill in subject and message body")
      return
    }

    setIsSending(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/marketing/campaigns/send`, emailForm)
      
      toast.success(`Campaign sent to ${emailForm.recipient} list successfully!`)
      setIsComposeOpen(false)
      
      // Reset Form & Refresh List
      setEmailForm(prev => ({ ...prev, subject: "", body: "" }))
      fetchCampaigns()

    } catch (error: any) {
      const msg = error.response?.data?.error || "Failed to send campaign"
      toast.error(msg)
    } finally {
      setIsSending(false)
    }
  }

  // Helper for Status Badge Color
  const getStatusBadge = (status: string) => {
    if (status === 'SENT') return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
    if (status === 'DRAFT') return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
    return "bg-indigo-50 text-indigo-700 border-indigo-200"
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Email Marketing</h2>
            <p className="text-sm text-muted-foreground">Create and manage email campaigns and newsletters.</p>
          </div>

          {/* === COMPOSE EMAIL DIALOG === */}
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <Send className="mr-2 h-4 w-4" /> New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Compose Email</DialogTitle>
                <DialogDescription>
                  Draft your message. Use the Preview tab to see how it looks.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 py-4 overflow-y-auto pr-2">
                <Tabs defaultValue="write" className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="write" className="w-24">Write</TabsTrigger>
                      <TabsTrigger value="preview" className="w-24">Preview</TabsTrigger>
                    </TabsList>
                  </div>

                  {/* --- WRITE TAB --- */}
                  <TabsContent value="write" className="flex-1 space-y-4 mt-0">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>To (Audience)</Label>
                            <Select 
                              onValueChange={(val) => setEmailForm({...emailForm, recipient: val})}
                              defaultValue={emailForm.recipient}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="newsletter">Newsletter Subscribers</SelectItem>
                                    <SelectItem value="vip">VIP Members</SelectItem>
                                    <SelectItem value="abandoned">Cart Abandoners</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Sender Name</Label>
                            <Input defaultValue="Luxe Store Team" disabled />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Subject Line</Label>
                        <Input 
                            placeholder="e.g. Flash Sale: 50% Off Everything!" 
                            value={emailForm.subject}
                            onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col h-full">
                        <Label>Message Body</Label>
                        <Textarea 
                            className="min-h-[300px] font-mono text-sm leading-relaxed p-4 resize-none" 
                            placeholder="Type your email content here..."
                            value={emailForm.body}
                            onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground flex gap-2">
                            <span>Variables:</span>
                            <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{'{{name}}'}</span>
                        </p>
                    </div>
                  </TabsContent>

                  {/* --- PREVIEW TAB --- */}
                  <TabsContent value="preview" className="h-full mt-0">
                    <div className="border rounded-lg bg-white h-full shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-slate-50 border-b p-4 space-y-2">
                            <div className="flex gap-2 text-sm">
                                <span className="text-muted-foreground w-16">To:</span>
                                <span className="font-medium text-indigo-600 capitalize">{emailForm.recipient.replace('_', ' ')} List</span>
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-muted-foreground w-16">Subject:</span>
                                <span className="font-medium">{emailForm.subject || "(No Subject)"}</span>
                            </div>
                        </div>
                        <div className="p-8 whitespace-pre-wrap font-sans text-slate-800 leading-relaxed overflow-y-auto flex-1">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full mb-6 flex items-center justify-center text-white font-bold text-lg">L</div>
                            
                            {emailForm.body.replace('{{name}}', 'John')}
                            
                            <div className="mt-12 pt-8 border-t text-xs text-slate-400 text-center">
                                <p>Luxe Store Inc. 123 Fashion St.</p>
                                <p className="underline cursor-pointer hover:text-slate-600">Unsubscribe</p>
                            </div>
                        </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="justify-between sm:justify-between pt-4 border-t">
                 <Button variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" /> Send Test Email
                 </Button>
                 <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setIsComposeOpen(false)} disabled={isSending}>
                      Discard
                    </Button>
                    <Button 
                      onClick={handleSendCampaign} 
                      disabled={isSending}
                      className="bg-indigo-600 hover:bg-indigo-700 gap-2 min-w-[140px]"
                    >
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                          <><Send className="h-4 w-4" /> Send Campaign</>
                        )}
                    </Button>
                 </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- STATS OVERVIEW --- */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Emails Sent (All Time)</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.reduce((acc, curr) => acc + (curr.sent || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,405</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12% this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Run</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* --- CAMPAIGN TABLE --- */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[400px]">Subject</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead className="hidden md:table-cell">Sent</TableHead>
                <TableHead className="hidden md:table-cell">Open Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                     <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> Loading campaigns...
                     </div>
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No campaigns found. Start a new one!
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((camp) => (
                  <TableRow key={camp.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${camp.status === 'SENT' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                              {camp.status === 'DRAFT' ? <FileText className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <span className="truncate max-w-[300px]" title={camp.subject}>{camp.subject}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm capitalize">
                      {camp.audience.toLowerCase().replace('_', ' ')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">
                      {camp.sent > 0 ? camp.sent.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {camp.opened}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(camp.status)}>
                        {camp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {camp.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Report</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </main>
    </div>
  )
}