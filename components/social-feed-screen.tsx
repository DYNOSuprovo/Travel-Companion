"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, MessageCircle, Share2, MapPin, Plus } from "lucide-react"

interface TravelStory {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  title: string
  content: string
  photos: string[]
  location?: { lat: number; lng: number; name: string }
  tags: string[]
  likes_count: number
  comments_count: number
  is_liked: boolean
  created_at: string
}

interface Comment {
  id: string
  user_name: string
  user_avatar?: string
  content: string
  created_at: string
}

export function SocialFeedScreen() {
  const [stories, setStories] = useState<TravelStory[]>([])
  const [newStory, setNewStory] = useState({
    title: "",
    content: "",
    tags: "",
    location: "",
  })
  const [isCreatingStory, setIsCreatingStory] = useState(false)
  const [selectedStory, setSelectedStory] = useState<TravelStory | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      const response = await fetch("/api/social/stories")
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error("Load stories error:", error)
    }
  }

  const createStory = async () => {
    if (!newStory.title || !newStory.content) return

    try {
      const response = await fetch("/api/social/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newStory.title,
          content: newStory.content,
          tags: newStory.tags.split(",").map((tag) => tag.trim()),
          location: newStory.location ? { name: newStory.location } : null,
        }),
      })

      if (response.ok) {
        setNewStory({ title: "", content: "", tags: "", location: "" })
        setIsCreatingStory(false)
        loadStories()
      }
    } catch (error) {
      console.error("Create story error:", error)
    }
  }

  const toggleLike = async (storyId: string) => {
    try {
      const response = await fetch(`/api/social/stories/${storyId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        setStories(
          stories.map((story) =>
            story.id === storyId
              ? {
                  ...story,
                  is_liked: !story.is_liked,
                  likes_count: story.is_liked ? story.likes_count - 1 : story.likes_count + 1,
                }
              : story,
          ),
        )
      }
    } catch (error) {
      console.error("Toggle like error:", error)
    }
  }

  const loadComments = async (storyId: string) => {
    try {
      const response = await fetch(`/api/social/stories/${storyId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Load comments error:", error)
    }
  }

  const addComment = async (storyId: string) => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/social/stories/${storyId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment("")
        loadComments(storyId)
        // Update comment count in stories
        setStories(
          stories.map((story) =>
            story.id === storyId ? { ...story, comments_count: story.comments_count + 1 } : story,
          ),
        )
      }
    } catch (error) {
      console.error("Add comment error:", error)
    }
  }

  // Mock data for initial load
  useEffect(() => {
    setStories([
      {
        id: "1",
        user_id: "user1",
        user_name: "Sarah Johnson",
        user_avatar: "/woman-traveler.png",
        title: "Amazing sunset in Santorini",
        content:
          "Just witnessed the most incredible sunset from Oia! The colors were absolutely breathtaking. This trip to Greece has been everything I dreamed of and more. Can't wait to explore more of the islands tomorrow!",
        photos: ["/santorini-sunset.png"],
        location: { lat: 36.4618, lng: 25.3753, name: "Oia, Santorini, Greece" },
        tags: ["sunset", "greece", "santorini", "travel"],
        likes_count: 24,
        comments_count: 8,
        is_liked: false,
        created_at: "2024-01-15T18:30:00Z",
      },
      {
        id: "2",
        user_id: "user2",
        user_name: "Mike Chen",
        user_avatar: "/man-traveler.jpg",
        title: "Street food adventure in Bangkok",
        content:
          "Exploring the incredible street food scene in Bangkok! Just tried the most amazing pad thai from a local vendor. The flavors are incredible and the atmosphere is so vibrant. This city never sleeps!",
        photos: ["/bangkok-street-food.jpg"],
        location: { lat: 13.7563, lng: 100.5018, name: "Bangkok, Thailand" },
        tags: ["food", "bangkok", "thailand", "streetfood"],
        likes_count: 18,
        comments_count: 5,
        is_liked: true,
        created_at: "2024-01-14T12:15:00Z",
      },
    ])
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Create Story Button */}
      <Dialog open={isCreatingStory} onOpenChange={setIsCreatingStory}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Share Your Travel Story
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Travel Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                placeholder="Give your story a catchy title..."
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Your Story</label>
              <Textarea
                value={newStory.content}
                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                placeholder="Share your travel experience..."
                className="min-h-32"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                value={newStory.location}
                onChange={(e) => setNewStory({ ...newStory, location: e.target.value })}
                placeholder="Where did this happen?"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tags</label>
              <input
                type="text"
                value={newStory.tags}
                onChange={(e) => setNewStory({ ...newStory, tags: e.target.value })}
                placeholder="travel, adventure, food (comma separated)"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={createStory} className="flex-1">
                Share Story
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingStory(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stories Feed */}
      <div className="space-y-6">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={story.user_avatar || "/placeholder.svg"} />
                  <AvatarFallback>{story.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{story.user_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {story.location && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span>{story.location.name}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{new Date(story.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
                <p className="text-muted-foreground">{story.content}</p>
              </div>

              {story.photos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {story.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo || "/placeholder.svg"}
                      alt={`Story photo ${index + 1}`}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  ))}
                </div>
              )}

              {story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(story.id)}
                    className={story.is_liked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${story.is_liked ? "fill-current" : ""}`} />
                    {story.likes_count}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStory(story)
                      loadComments(story.id)
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {story.comments_count}
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comments Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStory.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user_avatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <p className="font-medium text-sm">{comment.user_name}</p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={() => addComment(selectedStory.id)} disabled={!newComment.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
