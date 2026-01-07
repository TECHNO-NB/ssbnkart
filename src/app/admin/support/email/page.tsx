"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Send, User, History, CheckCircle2, AlertCircle, Loader2, LifeBuoy, Mail, Clock } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Types
interface UserResult {
  id: string
  name: string
  email: string
  image?: string
}

interface LogEntry {
  id: string
  to: string
  subject: string
  status: string
  date: string
}

const emailTemplates = [
  { 
    id: "mpl_1", 
    name: "Order Confirmation (Manual)", 
    subject: "Order # Confirmed", 
    body: "Hi {{name}},\n\nJust wanted to personally confirm that we have received your order. We are packing it now!" 
  },
  { 
    id: "mpl_2", 
    name: "Refund Processed", 
    subject: "Update on your Refund Request", 
    body: "Hi {{name}},\n\nWe have processed a refund to your original payment method. It should appear in 3-5 days." 
  },
  { 
    id: "mpl_3", 
    name: "Address Update", 
    subject: "Shipping Address Updated", 
    body: "Hi {{name}},\n\nAs requested, we have updated the shipping address for your active order." 
  },
]

// --- 1. NEW DESIGN ENGINE (Does not affect page logic, only the sent email) ---
const generateSupportEmailHTML = (bodyText: string, subject: string) => {
  const formattedBody = bodyText.replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">SSBN KART SUPPORT</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 0 20px 0; text-align: center; background-color: #ffffff;">
               <div style="display: inline-block; padding: 16px; background-color: #eff6ff; border-radius: 50%;">
                 <img src="https://img.icons8.com/fluency/96/lifebuoy.png" alt="Support" style="width: 48px; height: 48px; display: block;">
               </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 50px 40px 50px; color: #334155; font-size: 16px; line-height: 1.6;">
              ${formattedBody}
            </td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 13px; margin: 0;">
                &copy; 2024 SSBN Kart Inc. • <a href="#" style="color: #4f46e5; text-decoration: none;">Help Center</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export default function SupportEmailPage() {
  // State
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userResults, setUserResults] = useState<UserResult[]>([])
  
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  
  const [history, setHistory] = useState<LogEntry[]>([])
  const [isSending, setIsSending] = useState(false)

  // --- API: Search Users ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/support/users?search=${searchQuery}`)
          setUserResults(res.data)
        } catch (error) {
          console.error("Search failed")
        }
      } else {
        setUserResults([])
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // --- API: Fetch History ---
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/support/history`)
      setHistory(res.data)
    } catch (error) {
      console.error("Failed to load history")
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  // --- API: Send Email (UPDATED WITH DESIGN) ---
  const handleSendEmail = async () => {
    if (!selectedUser || !subject || !message) {
      toast.error("Please select a recipient and fill all fields")
      return
    }

    setIsSending(true)
    
    // GENERATE THE HTML HERE
    const htmlContent = generateSupportEmailHTML(message, subject);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/support/send`, {
        userId: selectedUser.id,
        subject,
        message: htmlContent, // Sending HTML instead of plain text
        plainText: message // Optional: if your backend supports a fallback field
      })
      
      toast.success(`Email sent to ${selectedUser.name}`)
      // Reset
      setSubject("")
      setMessage("")
      fetchHistory()
    } catch (error: any) {
      const msg = error.response?.data?.error || "Failed to send email"
      toast.error(msg)
    } finally {
      setIsSending(false)
    }
  }

  // Helper: Apply Template
  const applyTemplate = (templateId: string) => {
    const tmpl = emailTemplates.find(t => t.id === templateId)
    if (tmpl && selectedUser) {
      setSubject(tmpl.subject)
      setMessage(tmpl.body.replace("{{name}}", selectedUser.name.split(" ")[0]))
    } else if (tmpl) {
      setSubject(tmpl.subject)
      setMessage(tmpl.body)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Customer Support Console</h2>
          <p className="text-sm text-slate-500">Manage direct communication and resolve ticket issues via email.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: COMPOSE FORM --- */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                        <LifeBuoy className="h-5 w-5 text-indigo-600" /> New Support Ticket
                        </CardTitle>
                        <CardDescription>
                        Send a beautifully formatted email to a customer.
                        </CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                {/* 1. User Search (Combobox) */}
                <div className="grid gap-2">
                  <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Recipient</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between h-11 border-slate-200 bg-slate-50/50 hover:bg-white transition-all"
                      >
                        {selectedUser ? (
                          <div className="flex items-center gap-3">
                             <Avatar className="h-6 w-6 border border-slate-200">
                                <AvatarImage src={selectedUser.image} />
                                <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">{selectedUser.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div className="flex flex-col items-start leading-none gap-0.5">
                                <span className="text-sm font-medium text-slate-700">{selectedUser.name}</span>
                                <span className="text-xs text-slate-400">{selectedUser.email}</span>
                             </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground flex items-center gap-2"><Search className="h-4 w-4" /> Search customer by name...</span>
                        )}
                        
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0 shadow-xl border-slate-100" align="start">
                      <Command shouldFilter={false}> 
                        <CommandInput 
                          placeholder="Type to search..." 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                          className="border-none focus:ring-0"
                        />
                        <CommandList>
                          <CommandEmpty className="py-6 text-center text-sm text-slate-500">No user found.</CommandEmpty>
                          <CommandGroup heading="Suggestions">
                            {userResults.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.id} 
                                onSelect={() => {
                                  setSelectedUser(user)
                                  setOpenCombobox(false)
                                }}
                                className="cursor-pointer py-3"
                              >
                                <div className="flex items-center gap-3 w-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{user.name}</span>
                                        <span className="text-xs text-slate-400">{user.email}</span>
                                    </div>
                                    {selectedUser?.id === user.id && <CheckCircle2 className="ml-auto h-4 w-4 text-indigo-600" />}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 2. Template Selector */}
                <div className="grid gap-2">
                  <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Quick Templates</Label>
                  <Select onValueChange={applyTemplate}>
                    <SelectTrigger className="bg-white border-slate-200 h-10">
                      <SelectValue placeholder="Select a pre-made response..." />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="cursor-pointer">{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-slate-100" />

                {/* 3. Message Details */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Subject Line</Label>
                        <Input 
                            placeholder="e.g. Update regarding order #1234" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="h-11 border-slate-200 focus-visible:ring-indigo-500 font-medium"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Message Body</Label>
                        <div className="relative">
                            <Textarea 
                                className="min-h-[250px] font-sans text-base leading-relaxed p-4 border-slate-200 focus-visible:ring-indigo-500 resize-y bg-slate-50/30 focus:bg-white transition-colors" 
                                placeholder="Write your support message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3 flex gap-2">
                                {/* Optional: Add formatting toolbar icons here in future */}
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center justify-between">
                            <span>Markdown not supported. Plain text only.</span>
                            <span>{message.length} chars</span>
                        </p>
                    </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 bg-slate-50/50 py-4 px-6">
                 <Button variant="ghost" disabled={isSending} className="text-slate-500 hover:text-slate-900">
                    Save Draft
                 </Button>
                 <Button 
                   onClick={handleSendEmail} 
                   disabled={isSending}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px] shadow-md shadow-indigo-200"
                 >
                   {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <><Send className="mr-2 h-4 w-4" /> Send Email</>
                   )}
                 </Button>
              </CardFooter>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: HISTORY --- */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm h-full flex flex-col bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                   <History className="h-4 w-4 text-slate-500" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 relative">
                <ScrollArea className="h-[600px] w-full">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center text-slate-400 mt-10">
                            <Mail className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No emails sent yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-slate-50">
                            {history.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="flex items-center gap-2 max-w-[70%]">
                                            <div className={`h-2 w-2 rounded-full mt-0.5 flex-shrink-0 ${item.status === 'SENT' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <span className="font-semibold text-sm text-slate-700 truncate" title={item.to}>{item.to}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 h-5 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {item.date}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium truncate pl-4 group-hover:text-indigo-600 transition-colors">
                                        {item.subject}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}