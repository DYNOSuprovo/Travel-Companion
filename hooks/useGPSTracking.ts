"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface LocationPoint {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
}

export interface GPSStats {
  distance: number // kilometers
  duration: number // seconds
  averageSpeed: number // km/h
  maxSpeed: number // km/h
  locations: LocationPoint[]
}

// Haversine formula to calculate distance between two points
function calculateDistance(point1: LocationPoint, point2: LocationPoint): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.latitude * Math.PI) / 180) *
      Math.cos((point2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function useGPSTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [stats, setStats] = useState<GPSStats>({
    distance: 0,
    duration: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    locations: [],
  })
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const locationsRef = useRef<LocationPoint[]>([])

  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      return
    }

    setError(null)
    setIsTracking(true)
    startTimeRef.current = Date.now()
    locationsRef.current = []

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: LocationPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
        }

        locationsRef.current.push(newLocation)

        // Calculate stats
        let totalDistance = 0
        let maxSpeed = 0

        for (let i = 1; i < locationsRef.current.length; i++) {
          const distance = calculateDistance(locationsRef.current[i - 1], locationsRef.current[i])
          totalDistance += distance

          // Calculate speed: distance / time (in seconds) * 3600 (to get km/h)
          const timeDiff = (locationsRef.current[i].timestamp - locationsRef.current[i - 1].timestamp) / 1000
          if (timeDiff > 0) {
            const speed = (distance / timeDiff) * 3600
            maxSpeed = Math.max(maxSpeed, speed)
          }
        }

        const duration = (Date.now() - (startTimeRef.current || Date.now())) / 1000
        const averageSpeed = duration > 0 ? (totalDistance / duration) * 3600 : 0

        setStats({
          distance: Number.parseFloat(totalDistance.toFixed(2)),
          duration: Math.floor(duration),
          averageSpeed: Number.parseFloat(averageSpeed.toFixed(2)),
          maxSpeed: Number.parseFloat(maxSpeed.toFixed(2)),
          locations: locationsRef.current,
        })
      },
      (err) => {
        console.error("[v0] GPS error:", err)
        setError(`GPS Error: ${err.message}`)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    )

    watchIdRef.current = watchId
  }, [])

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
    return stats
  }, [stats])

  const resetTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
    setStats({
      distance: 0,
      duration: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      locations: [],
    })
    locationsRef.current = []
    startTimeRef.current = null
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return {
    isTracking,
    stats,
    error,
    startTracking,
    stopTracking,
    resetTracking,
  }
}
