"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Send, User, History, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
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

  // --- API: Send Email ---
  const handleSendEmail = async () => {
    if (!selectedUser || !subject || !message) {
      toast.error("Please select a recipient and fill all fields")
      return
    }

    setIsSending(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/support/send`, {
        userId: selectedUser.id,
        subject,
        message
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
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customer Support</h2>
            <p className="text-sm text-muted-foreground">Send individual emails to resolve specific issues.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- LEFT COLUMN: COMPOSE FORM --- */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-indigo-100 shadow-md">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-indigo-600" /> Compose Message
                </CardTitle>
                <CardDescription>
                  Send a one-off email via SMTP.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                {/* 1. User Search (Combobox) */}
                <div className="space-y-2">
                  <Label>Recipient</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between"
                      >
                        {selectedUser ? (
                          <div className="flex items-center gap-2">
                             <Avatar className="h-6 w-6">
                                <AvatarImage src={selectedUser.image} />
                                <AvatarFallback className="text-xs">{selectedUser.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <span>{selectedUser.name} ({selectedUser.email})</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Select customer...</span>
                        )}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command shouldFilter={false}> 
                        <CommandInput 
                          placeholder="Search by name or email..." 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup heading="Suggestions">
                            {userResults.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.id} // value must be unique
                                onSelect={() => {
                                  setSelectedUser(user)
                                  setOpenCombobox(false)
                                }}
                              >
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span>{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                                {selectedUser?.id === user.id && <CheckCircle2 className="ml-auto h-4 w-4 opacity-100" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 2. Template Selector */}
                <div className="space-y-2">
                  <Label>Load Template (Optional)</Label>
                  <Select onValueChange={applyTemplate}>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="Select a quick response..." />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* 3. Message Details */}
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input 
                    placeholder="e.g. Regarding your recent order..." 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea 
                    className="min-h-[200px] font-sans" 
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    Supports basic text formatting.
                  </p>
                </div>

              </CardContent>
              <CardFooter className="flex justify-between border-t bg-slate-50/50 py-4">
                 <Button variant="ghost" disabled={isSending}>Save as Draft</Button>
                 <Button 
                    onClick={handleSendEmail} 
                    disabled={isSending}
                    className="bg-indigo-600 hover:bg-indigo-700 min-w-[150px]"
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                   <History className="h-4 w-4 text-muted-foreground" /> Recent Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                    {history.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">No emails sent yet.</div>
                    ) : history.map((item) => (
                        <div key={item.id} className="p-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm truncate w-2/3">{item.to}</span>
                                <span className="text-[10px] text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">{item.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-2">{item.subject}</p>
                            <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${item.status === 'SENT' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-xs font-medium">{item.status}</span>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}