"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Send, Bot, User, Volume2, Languages, Lightbulb } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: string
  intent?: string
  entities?: any
}

interface Recommendation {
  id: string
  type: string
  title: string
  description: string
  confidence_score: number
  reasoning: string
  metadata: any
}

export function AIAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = selectedLanguage

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    loadRecommendations()
    loadChatHistory()
  }, [selectedLanguage])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadRecommendations = async () => {
    try {
      const response = await fetch("/api/ai/recommendations")
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error("Load recommendations error:", error)
    }
  }

  const loadChatHistory = () => {
    // Load recent chat history
    setMessages([
      {
        id: "1",
        type: "assistant",
        content:
          "Hello! I'm your AI travel assistant. I can help you plan trips, find recommendations, translate text, and answer any travel-related questions. How can I assist you today?",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsProcessing(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          language: selectedLanguage,
          context: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
          intent: data.intent,
          entities: data.entities,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // If new recommendations were generated, refresh them
        if (data.recommendations) {
          loadRecommendations()
        }
      }
    } catch (error) {
      console.error("Send message error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage
      speechSynthesis.speak(utterance)
    }
  }

  const translateText = async (text: string, targetLang: string) => {
    try {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          source_language: "auto",
          target_language: targetLang,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.translated_text
      }
    } catch (error) {
      console.error("Translation error:", error)
    }
    return text
  }

  const saveRecommendation = async (recommendationId: string) => {
    try {
      await fetch(`/api/ai/recommendations/${recommendationId}/save`, {
        method: "POST",
      })
      loadRecommendations()
    } catch (error) {
      console.error("Save recommendation error:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Language Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
          </select>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{rec.title}</h3>
                    <Badge variant="secondary">{Math.round(rec.confidence_score * 100)}% match</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <p className="text-xs text-muted-foreground mb-3">{rec.reasoning}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveRecommendation(rec.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Travel Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/20">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="flex-shrink-0">
                    {message.type === "user" ? (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-background border shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</span>
                      {message.type === "assistant" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => speakText(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-background border shadow-sm rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything about your travels..."
                disabled={isProcessing}
              />
            </div>
            <Button
              onClick={isListening ? stopListening : startListening}
              variant="outline"
              size="icon"
              className={isListening ? "bg-red-100 border-red-300" : ""}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={sendMessage} disabled={!inputText.trim() || isProcessing}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {isListening && (
            <div className="text-center">
              <Badge variant="secondary" className="animate-pulse">
                Listening...
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
