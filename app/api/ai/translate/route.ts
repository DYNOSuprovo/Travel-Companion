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

    const { text, source_language, target_language } = await request.json()

    // Check cache first
    const { data: cached } = await supabase
      .from("translation_cache")
      .select("*")
      .eq("source_text", text)
      .eq("source_language", source_language === "auto" ? "en" : source_language)
      .eq("target_language", target_language)
      .single()

    if (cached) {
      return NextResponse.json({
        translated_text: cached.translated_text,
        source_language: cached.source_language,
        target_language: cached.target_language,
        confidence_score: cached.confidence_score,
        from_cache: true,
      })
    }

    // Mock translation (in a real app, you'd use Google Translate API, etc.)
    const mockTranslations: Record<string, Record<string, string>> = {
      en: {
        es: "Hola, ¿cómo estás?",
        fr: "Bonjour, comment allez-vous?",
        de: "Hallo, wie geht es dir?",
        ja: "こんにちは、元気ですか？",
        ko: "안녕하세요, 어떻게 지내세요?",
        zh: "你好，你好吗？",
      },
    }

    let translated_text = text // Default fallback
    let confidence_score = 0.5

    // Simple mock translation logic
    if (text.toLowerCase().includes("hello") || text.toLowerCase().includes("hi")) {
      const translations = mockTranslations.en
      if (translations[target_language]) {
        translated_text = translations[target_language]
        confidence_score = 0.95
      }
    } else {
      // For other text, just add a prefix to simulate translation
      const prefixes: Record<string, string> = {
        es: "[ES] ",
        fr: "[FR] ",
        de: "[DE] ",
        ja: "[JA] ",
        ko: "[KO] ",
        zh: "[ZH] ",
      }
      translated_text = (prefixes[target_language] || "") + text
      confidence_score = 0.7
    }

    // Cache the translation
    await supabase.from("translation_cache").insert({
      source_text: text,
      source_language: source_language === "auto" ? "en" : source_language,
      target_language,
      translated_text,
      confidence_score,
    })

    return NextResponse.json({
      translated_text,
      source_language: source_language === "auto" ? "en" : source_language,
      target_language,
      confidence_score,
      from_cache: false,
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
