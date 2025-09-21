import { z } from "zod"

// User profile validation schemas
export const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(100, "Full name too long"),
  phone: z.string().optional().nullable(),
  state: z.string().min(1, "State is required").max(50, "State name too long"),
  city: z.string().min(1, "City is required").max(50, "City name too long"),
  nationality: z.string().min(1, "Nationality is required").max(50, "Nationality too long"),
})

// Trip validation schemas
export const tripSchema = z.object({
  trip_number: z.string().min(1, "Trip number is required").max(20, "Trip number too long"),
  origin: z.string().min(1, "Origin is required").max(200, "Origin too long"),
  destination: z.string().min(1, "Destination is required").max(200, "Destination too long"),
  transport_mode: z.enum(["walking", "cycling", "car", "bus", "train", "flight", "other"], {
    errorMap: () => ({ message: "Invalid transport mode" }),
  }),
  start_time: z.string().datetime("Invalid start time format"),
  end_time: z.string().datetime("Invalid end time format").optional().nullable(),
  distance_km: z.number().min(0, "Distance cannot be negative").max(50000, "Distance too large").optional().nullable(),
})

export const tripUpdateSchema = tripSchema.partial().extend({
  status: z.enum(["active", "completed", "cancelled"]).optional(),
})

// Trip companion validation schemas
export const tripCompanionSchema = z.object({
  companion_user_id: z.string().uuid("Invalid user ID format"),
})

export const companionStatusSchema = z.object({
  status: z.enum(["accepted", "declined"], {
    errorMap: () => ({ message: "Status must be 'accepted' or 'declined'" }),
  }),
})

// Feedback validation schemas
export const feedbackSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  feedback_text: z.string().max(1000, "Feedback text too long").optional().nullable(),
  suggestions: z.string().max(500, "Suggestions too long").optional().nullable(),
})

// User preferences validation schemas
export const userPreferencesSchema = z.object({
  preferred_transport_modes: z
    .array(z.enum(["walking", "cycling", "car", "bus", "train", "flight", "other"]))
    .max(7, "Too many transport modes selected")
    .optional(),
  budget_range_min: z.number().min(0, "Budget cannot be negative").optional().nullable(),
  budget_range_max: z.number().min(0, "Budget cannot be negative").optional().nullable(),
  preferred_trip_duration_hours: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 hour")
    .max(720, "Duration cannot exceed 30 days")
    .optional()
    .nullable(),
  interests: z.array(z.string().max(50, "Interest name too long")).max(20, "Too many interests").optional(),
})

// Authentication validation schemas
export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
    confirmPassword: z.string(),
    fullName: z.string().max(100, "Full name too long").optional(),
    phone: z.string().max(20, "Phone number too long").optional(),
    state: z.string().min(1, "State is required").max(50, "State name too long"),
    city: z.string().min(1, "City is required").max(50, "City name too long"),
    nationality: z.string().min(1, "Nationality is required").max(50, "Nationality too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // Password strength validation
      const hasUpperCase = /[A-Z]/.test(data.password)
      const hasLowerCase = /[a-z]/.test(data.password)
      const hasNumbers = /\d/.test(data.password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.password)
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    },
    {
      message: "Password must contain uppercase, lowercase, number, and special character",
      path: ["password"],
    },
  )

export const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

// External service validation schemas
export const weatherQuerySchema = z.object({
  location: z.string().min(1, "Location is required").optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
})

export const trafficQuerySchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  transport_mode: z.enum(["walking", "cycling", "car", "bus", "train", "flight", "other"]).optional(),
})

export const placesQuerySchema = z.object({
  query: z.string().min(1, "Query is required").optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  radius: z.string().regex(/^\d+$/, "Radius must be a number").optional(),
})

// Utility functions for validation
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ["Validation failed"] }
  }
}

// Rate limiting validation
export const rateLimitSchema = z.object({
  requests_per_minute: z.number().int().min(1).max(1000).default(60),
  requests_per_hour: z.number().int().min(1).max(10000).default(1000),
  requests_per_day: z.number().int().min(1).max(100000).default(10000),
})
