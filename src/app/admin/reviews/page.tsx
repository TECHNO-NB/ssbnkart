"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Star, Trash2, MessageSquare, MoreHorizontal, Loader2, Reply } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Types
interface Review {
  id: string
  user: string
  userImage?: string
  product: string
  rating: number
  comment: string
  reply?: string
  date: string
  status: "Published" | "Flagged"
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog State
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Fetch Reviews ---
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/reviews`)
      setReviews(res.data)
    } catch (error) {
      toast.error("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // --- Handlers ---
  const openReviewDialog = (review: Review) => {
    setSelectedReview(review)
    setReplyText(review.reply || "") // Pre-fill if edited before
    setIsDialogOpen(true)
  }

  const handlePostReply = async () => {
    if (!selectedReview || !replyText) return

    setIsSubmitting(true)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/reviews/${selectedReview.id}/reply`, { reply: replyText })
      toast.success("Reply posted successfully")
      setIsDialogOpen(false)
      fetchReviews() // Refresh data
    } catch (error) {
      toast.error("Failed to post reply")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!selectedReview) return
    if (!confirm("Are you sure? This action cannot be undone.")) return

    setIsSubmitting(true)
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/reviews/${selectedReview.id}`)
      toast.success("Review deleted")
      setIsDialogOpen(false)
      fetchReviews()
    } catch (error) {
      toast.error("Failed to delete review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        <div className="mb-2">
          <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">Monitor and moderate customer feedback.</p>
        </div>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[300px]">Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" /> Loading reviews...
                    </div>
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No reviews found.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.userImage} />
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {review.user}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{review.product}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-yellow-500">
                        {review.rating} <Star className="ml-1 h-3.5 w-3.5 fill-current" />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="truncate text-sm text-slate-600">{review.comment}</p>
                      {review.reply && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-indigo-600 font-medium">
                           <Reply className="h-3 w-3" /> Replied
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.status === 'Flagged' ? 'destructive' : 'secondary'} className="capitalize">
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openReviewDialog(review)}>
                        <MessageSquare className="h-4 w-4 text-slate-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- REVIEW DETAILS DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>Review for {selectedReview?.product}</DialogDescription>
            </DialogHeader>

            {selectedReview && (
              <div className="grid gap-6 py-4">
                {/* User Review Card */}
                <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={selectedReview.userImage} />
                        <AvatarFallback>{selectedReview.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{selectedReview.user}</p>
                        <div className="flex text-yellow-500 text-xs mt-0.5">
                          {Array.from({ length: selectedReview.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{selectedReview.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">"{selectedReview.comment}"</p>
                </div>

                {/* Admin Reply Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Reply className="h-4 w-4 text-indigo-600" />
                    Your Response
                  </label>
                  <Textarea 
                    placeholder="Write a public response to this customer..." 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">This reply will be visible on the product page.</p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 justify-between sm:justify-between w-full">
              <Button 
                variant="destructive" 
                onClick={handleDeleteReview}
                disabled={isSubmitting}
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-100 shadow-none"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} 
                <span className="ml-2">Delete</span>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handlePostReply} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post Reply"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}