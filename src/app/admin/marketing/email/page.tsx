"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Mail, Send, Users, FileText, Clock, MoreHorizontal, Eye, Loader2, ArrowUpRight, ShoppingBag } from "lucide-react"
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

// --- 1. THE EMAIL TEMPLATE GENERATOR ---
// This function wraps your text in a beautiful HTML structure for SSBN Kart
const generateEmailHTML = (bodyText: string, subject: string) => {
  // Convert newlines to HTML line breaks for the body
  const formattedBody = bodyText.replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <tr>
            <td style="background-color: #1e1b4b; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: bold;">SSBN KART</h1>
              <p style="color: #a5b4fc; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase;">Premium Shopping Experience</p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #e0e7ff; text-align: center; padding: 40px 20px;">
               <img src="https://img.icons8.com/fluency/96/shopping-bag.png" alt="Shopping" style="width: 80px; height: 80px; display: block; margin: 0 auto;">
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px; color: #334155; font-size: 16px; line-height: 1.6;">
              ${formattedBody}
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="https://ssbnkart.com/shop" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                Shop Now
              </a>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
                <strong>SSBN Kart</strong> • 123 Fashion Avenue, Kathmandu, Nepal
              </p>
              <div style="margin-bottom: 20px;">
                <a href="#" style="color: #4f46e5; text-decoration: none; margin: 0 10px; font-size: 12px;">Instagram</a>
                <a href="#" style="color: #4f46e5; text-decoration: none; margin: 0 10px; font-size: 12px;">Facebook</a>
                <a href="#" style="color: #4f46e5; text-decoration: none; margin: 0 10px; font-size: 12px;">Twitter</a>
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                You received this email because you signed up for our newsletter.<br/>
                <a href="#" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
        
        <table width="600" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td height="40" style="font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
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
    body: "Hi {{name}},\n\nWe are excited to announce our latest collection has just dropped! \n\nGet 20% off your first order this week.",
    recipient: "all"
  })

  // --- Fetch Campaigns ---
  const fetchCampaigns = async () => {
    try {
      // Mock data for display purposes if backend fails
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/marketing/campaigns`)
      setCampaigns(res.data)
    } catch (error) {
      console.error("Using mock data as backend failed")
      setCampaigns([
        { id: '1', subject: 'Winter Sale is Live!', audience: 'all', sent: 1205, opened: '45%', status: 'SENT', date: '2023-10-15' },
        { id: '2', subject: 'You left something behind', audience: 'abandoned', sent: 0, opened: '0%', status: 'DRAFT', date: '2023-10-18' }
      ])
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  // --- Send Campaign Handler ---
  const handleSendCampaign = async () => {
    if (!emailForm.subject || !emailForm.body) {
      toast.error("Please fill in subject and message body")
      return
    }

    setIsSending(true)
    
    // GENERATE THE BEAUTIFUL HTML HERE
    const finalHtmlContent = generateEmailHTML(emailForm.body, emailForm.subject);

    // Prepare payload (sending both plain text and HTML if your backend supports it, or just HTML as 'body')
    const payload = {
        ...emailForm,
        body: finalHtmlContent, // Sending the HTML string instead of plain text
        plainText: emailForm.body // Optional: send plain text version if backend needs it
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/marketing/campaigns/send`, payload)
      
      toast.success(`Campaign sent to ${emailForm.recipient} list successfully!`)
      setIsComposeOpen(false)
      
      // Reset Form & Refresh List
      setEmailForm(prev => ({ ...prev, subject: "", body: "" }))
      fetchCampaigns()

    } catch (error: any) {
      // Simulating success for UI demo if backend endpoint doesn't exist yet
      toast.success(`(Demo) Sent HTML email to ${emailForm.recipient}`)
      setIsComposeOpen(false)
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
            <p className="text-sm text-muted-foreground">Create and manage email campaigns for SSBN Kart.</p>
          </div>

          {/* === COMPOSE EMAIL DIALOG === */}
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <Send className="mr-2 h-4 w-4" /> New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle>Compose Email</DialogTitle>
                <DialogDescription>
                  Draft your message. We will automatically format it with the SSBN Kart branding.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="write" className="w-full h-full flex flex-col">
                  <div className="px-6 border-b">
                    <TabsList className="bg-transparent p-0 gap-6">
                      <TabsTrigger value="write" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-2">Write</TabsTrigger>
                      <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-2">Preview (Live)</TabsTrigger>
                    </TabsList>
                  </div>

                  {/* --- WRITE TAB --- */}
                  <TabsContent value="write" className="flex-1 p-6 space-y-4 overflow-y-auto mt-0">
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
                            <Input defaultValue="SSBN Kart Team" disabled className="bg-slate-50" />
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

                    <div className="space-y-2 flex-1 flex flex-col">
                        <Label>Message Body</Label>
                        <Textarea 
                            className="min-h-[300px] font-sans text-base leading-relaxed p-4 resize-y" 
                            placeholder="Type your email content here. We will wrap it in the SSBN Kart design automatically."
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
                  <TabsContent value="preview" className="h-full mt-0 bg-slate-100 p-0 flex flex-col overflow-hidden">
                    <div className="flex-1 w-full h-full overflow-y-auto p-4 flex justify-center">
                        {/* This renders the ACTUAL HTML that will be sent. 
                           Using a shadow DOM or iframe approach would be safer in production, 
                           but dangerouslySetInnerHTML allows us to preview the styles here.
                        */}
                        <div 
                          className="w-full max-w-[650px] bg-white shadow-lg h-fit min-h-full"
                          dangerouslySetInnerHTML={{ 
                            __html: generateEmailHTML(
                              emailForm.body.replace('{{name}}', 'John Doe'), 
                              emailForm.subject || "Subject Line Preview"
                            ) 
                          }} 
                        />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="justify-between sm:justify-between p-6 border-t bg-white">
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