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

    const { location, alert_type, message } = await request.json()

    // Create emergency alert
    const { data: alert, error: alertError } = await supabase
      .from("emergency_alerts")
      .insert({
        user_id: user.id,
        location,
        alert_type,
        message,
        status: "active",
      })
      .select()
      .single()

    if (alertError) {
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
    }

    // Get emergency contacts
    const { data: contacts, error: contactsError } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user.id)

    if (!contactsError && contacts) {
      // Send notifications to emergency contacts
      const notifications = contacts.map(async (contact) => {
        // In a real app, you'd integrate with SMS/email services
        console.log(`Sending SOS alert to ${contact.name} at ${contact.phone}`)

        // Mock notification sending
        return {
          contact_id: contact.id,
          status: "sent",
          sent_at: new Date().toISOString(),
        }
      })

      const notificationResults = await Promise.all(notifications)

      // Update alert with notification results
      await supabase
        .from("emergency_alerts")
        .update({
          contacts_notified: notificationResults,
        })
        .eq("id", alert.id)
    }

    return NextResponse.json({
      success: true,
      alert_id: alert.id,
      contacts_notified: contacts?.length || 0,
    })
  } catch (error) {
    console.error("SOS API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
