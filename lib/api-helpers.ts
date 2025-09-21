import { type NextRequest, NextResponse } from "next/server"
import { validateRequest } from "./validation"
import { SecurityHelper } from "./security"
import type { z } from "zod"

// Standard API response wrapper
export function createApiResponse<T>(data: T, status = 200, headers: Record<string, string> = {}): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  })
}

// Error response helper
export function createErrorResponse(message: string, status = 400, details?: any): NextResponse {
  return createApiResponse(
    {
      error: message,
      ...(details && { details }),
    },
    status,
  )
}

// Validation middleware
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json()
    const validation = validateRequest(schema, body)

    if (!validation.success) {
      return {
        success: false,
        response: createErrorResponse("Validation failed", 400, {
          errors: validation.errors,
        }),
      }
    }

    return { success: true, data: validation.data }
  } catch (error) {
    return {
      success: false,
      response: createErrorResponse("Invalid JSON in request body", 400),
    }
  }
}

// Query parameter validation
export function validateQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): { success: true; data: T } | { success: false; response: NextResponse } {
  const { searchParams } = new URL(request.url)
  const params = Object.fromEntries(searchParams.entries())

  const validation = validateRequest(schema, params)

  if (!validation.success) {
    return {
      success: false,
      response: createErrorResponse("Invalid query parameters", 400, {
        errors: validation.errors,
      }),
    }
  }

  return { success: true, data: validation.data }
}

// Sanitize request data
export function sanitizeRequestData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = SecurityHelper.sanitizeInput(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => (typeof item === "string" ? SecurityHelper.sanitizeInput(item) : item))
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

// Handle async errors in API routes
export function withErrorHandling(handler: (request: NextRequest, context: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      console.error("API Error:", error)

      // Log error details for debugging
      await SecurityHelper.logSecurityEvent(
        "suspicious_activity",
        {
          error: error instanceof Error ? error.message : "Unknown error",
          path: request.url,
          method: request.method,
        },
        request,
      )

      return createErrorResponse("Internal server error", 500)
    }
  }
}

// CORS headers for API routes
export function addCorsHeaders(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://your-domain.com", // Replace with actual domain
  ]

  const requestOrigin = origin || "*"
  const allowOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0]

  response.headers.set("Access-Control-Allow-Origin", allowOrigin)
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400")

  return response
}

// Request logging middleware
export function withRequestLogging(handler: (request: NextRequest, context: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context: any) => {
    const startTime = Date.now()
    const ip = SecurityHelper.getClientIP(request)

    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - IP: ${ip}`)

    const response = await handler(request, context)

    const duration = Date.now() - startTime
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${response.status} (${duration}ms)`)

    return response
  }
}

// Combine multiple middleware functions
export function combineMiddleware(...middlewares: Array<(handler: any) => any>) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}
