import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string
}

export class SecurityHelper {
  // Rate limiting middleware
  static rateLimit(config: RateLimitConfig) {
    return async (request: NextRequest, identifier?: string) => {
      const key = identifier || config.keyGenerator?.(request) || this.getClientIP(request)
      const now = Date.now()
      const windowStart = now - config.windowMs

      // Clean up old entries
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
          rateLimitStore.delete(k)
        }
      }

      const current = rateLimitStore.get(key)

      if (!current || current.resetTime < now) {
        // First request in window or window expired
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + config.windowMs,
        })
        return { allowed: true, remaining: config.maxRequests - 1 }
      }

      if (current.count >= config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: current.resetTime,
        }
      }

      current.count++
      return {
        allowed: true,
        remaining: config.maxRequests - current.count,
      }
    }
  }

  // Get client IP address
  static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")

    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }

    if (realIP) {
      return realIP
    }

    return "unknown"
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/['"]/g, "") // Remove quotes
      .trim()
      .slice(0, 1000) // Limit length
  }

  // Generate secure random tokens
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  // Hash sensitive data
  static hashData(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex")
  }

  // Verify user ownership of resources
  static async verifyResourceOwnership(
    resourceType: "trip" | "profile" | "feedback" | "preferences",
    resourceId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const supabase = await createClient()

      let query
      switch (resourceType) {
        case "trip":
          query = supabase.from("trips").select("user_id").eq("id", resourceId).single()
          break
        case "profile":
          query = supabase.from("profiles").select("id").eq("id", resourceId).single()
          break
        case "feedback":
          query = supabase.from("trip_feedback").select("user_id").eq("id", resourceId).single()
          break
        case "preferences":
          query = supabase.from("user_preferences").select("user_id").eq("id", resourceId).single()
          break
        default:
          return false
      }

      const { data, error } = await query

      if (error || !data) {
        return false
      }

      // For profile, check if the resource ID matches user ID
      if (resourceType === "profile") {
        return data.id === userId
      }

      // For other resources, check if user_id matches
      return data.user_id === userId
    } catch (error) {
      console.error("Error verifying resource ownership:", error)
      return false
    }
  }

  // Validate and sanitize file uploads
  static validateFileUpload(file: File, allowedTypes: string[], maxSize: number) {
    const errors: string[] = []

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(", ")}`)
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`)
    }

    // Check file name
    if (file.name.length > 255) {
      errors.push("File name too long")
    }

    // Basic security checks
    const dangerousExtensions = [".exe", ".bat", ".cmd", ".scr", ".pif", ".com"]
    const hasExtension = dangerousExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    if (hasExtension) {
      errors.push("File type not allowed for security reasons")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // Log security events
  static async logSecurityEvent(
    event: "login_attempt" | "rate_limit_exceeded" | "unauthorized_access" | "suspicious_activity",
    details: Record<string, any>,
    request: NextRequest,
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      ip: this.getClientIP(request),
      userAgent: request.headers.get("user-agent"),
      details,
    }

    // In production, send to logging service (e.g., Sentry, LogRocket, etc.)
    console.warn("Security Event:", logEntry)
  }

  // Check for suspicious patterns
  static detectSuspiciousActivity(request: NextRequest): boolean {
    const userAgent = request.headers.get("user-agent") || ""
    const ip = this.getClientIP(request)

    // Check for common bot patterns
    const botPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i]

    const isSuspiciousUserAgent = botPatterns.some((pattern) => pattern.test(userAgent))

    // Check for suspicious IP patterns (basic example)
    const isSuspiciousIP = ip === "unknown" || ip.startsWith("127.") || ip.startsWith("10.")

    return isSuspiciousUserAgent || isSuspiciousIP
  }
}

// Middleware wrapper for API routes
export function withSecurity(
  handler: (request: NextRequest, context: any) => Promise<Response>,
  options: {
    rateLimit?: RateLimitConfig
    requireAuth?: boolean
    validateOwnership?: {
      resourceType: "trip" | "profile" | "feedback" | "preferences"
      resourceIdParam: string
    }
  } = {},
) {
  return async (request: NextRequest, context: any) => {
    try {
      // Rate limiting
      if (options.rateLimit) {
        const rateLimiter = SecurityHelper.rateLimit(options.rateLimit)
        const result = await rateLimiter(request)

        if (!result.allowed) {
          await SecurityHelper.logSecurityEvent(
            "rate_limit_exceeded",
            {
              ip: SecurityHelper.getClientIP(request),
              resetTime: result.resetTime,
            },
            request,
          )

          return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Remaining": result.remaining.toString(),
              "X-RateLimit-Reset": result.resetTime?.toString() || "",
            },
          })
        }
      }

      // Authentication check
      if (options.requireAuth) {
        const supabase = await createClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          await SecurityHelper.logSecurityEvent(
            "unauthorized_access",
            {
              path: request.url,
              method: request.method,
            },
            request,
          )

          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          })
        }

        // Resource ownership validation
        if (options.validateOwnership) {
          const resourceId = context.params?.[options.validateOwnership.resourceIdParam]
          if (resourceId) {
            const hasAccess = await SecurityHelper.verifyResourceOwnership(
              options.validateOwnership.resourceType,
              resourceId,
              user.id,
            )

            if (!hasAccess) {
              await SecurityHelper.logSecurityEvent(
                "unauthorized_access",
                {
                  userId: user.id,
                  resourceType: options.validateOwnership.resourceType,
                  resourceId,
                },
                request,
              )

              return new Response(JSON.stringify({ error: "Access denied" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
              })
            }
          }
        }
      }

      // Suspicious activity detection
      if (SecurityHelper.detectSuspiciousActivity(request)) {
        await SecurityHelper.logSecurityEvent(
          "suspicious_activity",
          {
            userAgent: request.headers.get("user-agent"),
            path: request.url,
          },
          request,
        )
      }

      // Call the original handler
      return await handler(request, context)
    } catch (error) {
      console.error("Security middleware error:", error)
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  }
}
