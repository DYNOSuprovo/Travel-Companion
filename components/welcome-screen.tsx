"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Shield, Users, BarChart3, Award } from "lucide-react"
import { AppContainer } from "@/components/app-container"

export function WelcomeScreen() {
  const [currentStep, setCurrentStep] = useState("welcome")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    otp: "",
    state: "",
    city: "",
    nationality: "",
    agreeToTerms: false,
    agreeToDataSharing: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendOTP = () => {
    // OTP sending logic would go here
    console.log("Sending OTP to:", formData.phone)
    setCurrentStep("otp")
  }

  const handleVerifyOTP = () => {
    // OTP verification logic would go here
    console.log("Verifying OTP:", formData.otp)
    setCurrentStep("profile")
  }

  const handleCompleteRegistration = () => {
    // Registration completion logic would go here
    console.log("Registration completed:", formData)
    setCurrentStep("app")
  }

  if (currentStep === "app") {
    return <AppContainer />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {currentStep === "welcome" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-balance">Welcome to Travel Companion</CardTitle>
              <CardDescription className="text-base text-pretty">
                Your intelligent travel companion for seamless journey tracking and personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-sm font-medium">Secure Tracking</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-sm font-medium">Companion Management</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-sm font-medium">Smart Analytics</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-sm font-medium">Rewards System</span>
                </div>
              </div>
              <Button onClick={() => setCurrentStep("auth")} className="w-full" size="lg">
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "auth" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Create Your Account</CardTitle>
              <CardDescription>Enter your details to get started with Travel Companion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <Button onClick={handleSendOTP} className="w-full" disabled={!formData.email || !formData.phone}>
                Send OTP
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "otp" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Verify Your Phone</CardTitle>
              <CardDescription>Enter the 6-digit OTP sent to {formData.phone}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep("auth")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleVerifyOTP} className="flex-1" disabled={formData.otp.length !== 6}>
                  Verify OTP
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "profile" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Complete Your Profile</CardTitle>
              <CardDescription>Help us personalize your travel experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select onValueChange={(value) => handleInputChange("nationality", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="british">British</SelectItem>
                    <SelectItem value="canadian">Canadian</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the <button className="text-accent underline">Terms of Service</button> and{" "}
                    <button className="text-accent underline">Privacy Policy</button>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="data-sharing"
                    checked={formData.agreeToDataSharing}
                    onCheckedChange={(checked) => handleInputChange("agreeToDataSharing", checked as boolean)}
                  />
                  <Label htmlFor="data-sharing" className="text-sm leading-relaxed">
                    I consent to anonymized data sharing with NATPAC for research and improvement purposes
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep("otp")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleCompleteRegistration}
                  className="flex-1"
                  disabled={
                    !formData.state ||
                    !formData.city ||
                    !formData.nationality ||
                    !formData.agreeToTerms ||
                    !formData.agreeToDataSharing
                  }
                >
                  Complete Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
