import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, language, context } = await request.json()

    // Simple intent detection (in a real app, you'd use NLP services)
    let intent = "general"
    const entities = {}

    if (message.toLowerCase().includes("recommend") || message.toLowerCase().includes("suggest")) {
      intent = "recommendation"
    } else if (message.toLowerCase().includes("weather")) {
      intent = "weather"
    } else if (message.toLowerCase().includes("translate")) {
      intent = "translation"
    } else if (message.toLowerCase().includes("pack") || message.toLowerCase().includes("bring")) {
      intent = "packing"
    }

    // Generate response based on intent
    let response = ""
    let recommendations = null

    switch (intent) {
      case "recommendation":
        response =
          "I'd be happy to help you with recommendations! Based on your travel history and preferences, I can suggest destinations, restaurants, activities, and more. What type of recommendations are you looking for?"
        recommendations = await generateRecommendations(user.id, message)
        break

      case "weather":
        response =
          "I can help you check the weather for your destination. Please provide the location and dates you're interested in, and I'll get you the latest forecast information."
        break

      case "translation":
        response =
          "I can help translate text for you! Just tell me what you'd like to translate and which language you need it in."
        break

      case "packing":
        response =
          "I can help you create a smart packing list! Tell me your destination, travel dates, and planned activities, and I'll generate a personalized packing list based on the weather forecast and your itinerary."
        break

      default:
        response =
          "I'm here to help with all your travel needs! I can provide recommendations, check weather, translate text, create packing lists, and answer any travel-related questions. What would you like to know?"
    }

    // Store the interaction
    await supabase.from("voice_interactions").insert({
      user_id: user.id,
      interaction_type: "query",
      input_text: message,
      response_text: response,
      intent,
      entities,
      confidence_score: 0.8,
    })

    return NextResponse.json({
      response,
      intent,
      entities,
      recommendations,
    })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateRecommendations(userId: string, message: string) {
  // Mock recommendation generation
  // In a real app, this would use ML models and user data
  return [
    {
      id: "rec1",
      type: "destination",
      title: "Kyoto, Japan",
      description: "Perfect for cultural experiences and temple visits",
      confidence_score: 0.9,
      reasoning: "Based on your interest in cultural activities and previous trips to Asia",
    },
  ]
}
