import { validateRequest, tripSchema, signUpSchema } from "@/lib/validation"

describe("Validation", () => {
  describe("Trip Schema", () => {
    it("should validate correct trip data", () => {
      const validTrip = {
        trip_number: "TRIP-001",
        origin: "New York",
        destination: "Boston",
        transport_mode: "car",
        start_time: "2024-01-15T10:00:00Z",
        distance_km: 215.5,
      }

      const result = validateRequest(tripSchema, validTrip)
      expect(result.success).toBe(true)
    })

    it("should reject missing required fields", () => {
      const invalidTrip = {
        origin: "New York",
        destination: "Boston",
      }

      const result = validateRequest(tripSchema, invalidTrip)
      expect(result.success).toBe(false)
    })

    it("should reject invalid transport mode", () => {
      const invalidTrip = {
        trip_number: "TRIP-001",
        origin: "New York",
        destination: "Boston",
        transport_mode: "invalid",
        start_time: "2024-01-15T10:00:00Z",
      }

      const result = validateRequest(tripSchema, invalidTrip)
      expect(result.success).toBe(false)
    })
  })

  describe("SignUp Schema", () => {
    it("should validate correct signup data", () => {
      const validSignup = {
        email: "user@example.com",
        password: "SecurePass123!",
        confirmPassword: "SecurePass123!",
        fullName: "John Doe",
        state: "California",
        city: "San Francisco",
        nationality: "USA",
      }

      const result = validateRequest(signUpSchema, validSignup)
      expect(result.success).toBe(true)
    })

    it("should reject weak passwords", () => {
      const weakSignup = {
        email: "user@example.com",
        password: "weak",
        confirmPassword: "weak",
        state: "California",
        city: "San Francisco",
        nationality: "USA",
      }

      const result = validateRequest(signUpSchema, weakSignup)
      expect(result.success).toBe(false)
    })

    it("should reject mismatched passwords", () => {
      const mismatchSignup = {
        email: "user@example.com",
        password: "SecurePass123!",
        confirmPassword: "DifferentPass123!",
        state: "California",
        city: "San Francisco",
        nationality: "USA",
      }

      const result = validateRequest(signUpSchema, mismatchSignup)
      expect(result.success).toBe(false)
    })
  })
})
