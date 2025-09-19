"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, TrendingUp, MapPin, Route, Footprints, Leaf, Users, Calendar, Gift, Crown, Zap } from "lucide-react"

export function RewardsScreen() {
  const [userStats, setUserStats] = useState({
    totalPoints: 2840,
    level: 8,
    nextLevelPoints: 3000,
    rank: 23,
    totalUsers: 1247,
    streak: 12,
    badges: 15,
  })

  const badges = [
    {
      id: 1,
      name: "Explorer",
      description: "Completed 10 trips",
      icon: MapPin,
      earned: true,
      earnedDate: "2024-01-10",
      rarity: "common",
      points: 100,
    },
    {
      id: 2,
      name: "Eco Warrior",
      description: "Saved 50kg CO₂",
      icon: Leaf,
      earned: true,
      earnedDate: "2024-01-08",
      rarity: "rare",
      points: 250,
    },
    {
      id: 3,
      name: "Distance Master",
      description: "Traveled 1000km",
      icon: Route,
      earned: true,
      earnedDate: "2024-01-05",
      rarity: "epic",
      points: 500,
    },
    {
      id: 4,
      name: "Social Butterfly",
      description: "Travel with 5 companions",
      icon: Users,
      earned: true,
      earnedDate: "2023-12-28",
      rarity: "rare",
      points: 200,
    },
    {
      id: 5,
      name: "Walking Champion",
      description: "Walk 100km total",
      icon: Footprints,
      earned: true,
      earnedDate: "2023-12-20",
      rarity: "common",
      points: 150,
    },
    {
      id: 6,
      name: "Streak Master",
      description: "30-day travel streak",
      icon: Zap,
      earned: false,
      progress: 12,
      target: 30,
      rarity: "legendary",
      points: 1000,
    },
    {
      id: 7,
      name: "Speed Demon",
      description: "Average 60km/h speed",
      icon: TrendingUp,
      earned: false,
      progress: 45.3,
      target: 60,
      rarity: "epic",
      points: 400,
    },
    {
      id: 8,
      name: "Globe Trotter",
      description: "Visit 20 different cities",
      icon: Trophy,
      earned: false,
      progress: 8,
      target: 20,
      rarity: "legendary",
      points: 800,
    },
  ]

  const leaderboard = [
    {
      rank: 1,
      name: "Priya Sharma",
      points: 5420,
      level: 12,
      avatar: "/diverse-woman-portrait.png",
      badge: "Globe Trotter",
    },
    {
      rank: 2,
      name: "Arjun Patel",
      points: 4890,
      level: 11,
      avatar: "/thoughtful-man.png",
      badge: "Eco Warrior",
    },
    {
      rank: 3,
      name: "Sneha Reddy",
      points: 4320,
      level: 10,
      avatar: "/diverse-woman-portrait.png",
      badge: "Distance Master",
    },
    {
      rank: 23,
      name: "You",
      points: userStats.totalPoints,
      level: userStats.level,
      avatar: "/placeholder.svg",
      badge: "Explorer",
      isCurrentUser: true,
    },
  ]

  const challenges = [
    {
      id: 1,
      title: "Weekend Warrior",
      description: "Complete 3 trips this weekend",
      progress: 1,
      target: 3,
      reward: 200,
      timeLeft: "2 days",
      difficulty: "easy",
    },
    {
      id: 2,
      title: "Green Commuter",
      description: "Use public transport for 5 trips",
      progress: 2,
      target: 5,
      reward: 300,
      timeLeft: "5 days",
      difficulty: "medium",
    },
    {
      id: 3,
      title: "Social Explorer",
      description: "Travel with companions 3 times",
      progress: 0,
      target: 3,
      reward: 400,
      timeLeft: "1 week",
      difficulty: "hard",
    },
  ]

  const rewards = [
    {
      id: 1,
      name: "Coffee Voucher",
      description: "Free coffee at partner cafes",
      cost: 500,
      category: "food",
      available: true,
    },
    {
      id: 2,
      name: "Fuel Discount",
      description: "10% off at partner fuel stations",
      cost: 800,
      category: "transport",
      available: true,
    },
    {
      id: 3,
      name: "Hotel Discount",
      description: "15% off hotel bookings",
      cost: 1200,
      category: "accommodation",
      available: true,
    },
    {
      id: 4,
      name: "Premium Features",
      description: "1 month premium app features",
      cost: 2000,
      category: "app",
      available: true,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Rewards & Achievements</h1>
        <p className="text-muted-foreground text-pretty">Earn points, unlock badges, and compete with friends</p>
      </div>

      {/* User Stats Overview */}
      <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>
                <Crown className="h-8 w-8 text-accent" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">Level {userStats.level} Traveler</h2>
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  Rank #{userStats.rank}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {userStats.totalPoints} points • {userStats.badges} badges earned
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{userStats.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{userStats.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userStats.level + 1}</span>
              <span>
                {userStats.totalPoints} / {userStats.nextLevelPoints}
              </span>
            </div>
            <Progress value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {userStats.nextLevelPoints - userStats.totalPoints} points to next level
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="badges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Badges ({badges.filter((b) => b.earned).length})</CardTitle>
              <CardDescription>Achievements you've unlocked on your travel journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges
                  .filter((badge) => badge.earned)
                  .map((badge) => {
                    const Icon = badge.icon
                    return (
                      <Card key={badge.id} className={`border ${getRarityColor(badge.rarity)}`}>
                        <CardContent className="pt-4">
                          <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                              <Icon className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{badge.name}</h4>
                              <p className="text-xs text-muted-foreground text-pretty">{badge.description}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {badge.rarity}
                              </Badge>
                              <span className="text-xs font-medium">+{badge.points} pts</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Progress Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">In Progress</CardTitle>
              <CardDescription>Badges you're working towards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {badges
                  .filter((badge) => !badge.earned)
                  .map((badge) => {
                    const Icon = badge.icon
                    const progress = badge.progress || 0
                    const target = badge.target || 100
                    return (
                      <div key={badge.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{badge.name}</h4>
                            <Badge variant="outline" className={getRarityColor(badge.rarity)}>
                              {badge.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 text-pretty">{badge.description}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>
                                {progress} / {target}
                              </span>
                              <span>+{badge.points} pts</span>
                            </div>
                            <Progress value={(progress / target) * 100} className="h-1" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Challenges</CardTitle>
              <CardDescription>Complete these challenges to earn bonus points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="border">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{challenge.title}</h4>
                          <Badge variant="secondary" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground text-pretty">{challenge.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-accent">+{challenge.reward} pts</div>
                        <div className="text-xs text-muted-foreground">{challenge.timeLeft} left</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>
                          {challenge.progress} / {challenge.target}
                        </span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Challenge Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Challenge Categories</CardTitle>
              <CardDescription>Different types of challenges to keep you motivated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Eco Challenges</h4>
                    <p className="text-xs text-muted-foreground">Sustainable travel goals</p>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Social Challenges</h4>
                    <p className="text-xs text-muted-foreground">Travel with companions</p>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Route className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Distance Challenges</h4>
                    <p className="text-xs text-muted-foreground">Travel distance goals</p>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Streak Challenges</h4>
                    <p className="text-xs text-muted-foreground">Consistency rewards</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global Leaderboard</CardTitle>
              <CardDescription>See how you rank among all travelers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    user.isCurrentUser ? "bg-accent/10 border border-accent/20" : "border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : user.rank === 2
                            ? "bg-gray-100 text-gray-700"
                            : user.rank === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.rank <= 3 ? <Trophy className="h-4 w-4" /> : user.rank}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Level {user.level} • {user.badge}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-accent">{user.points.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Friends Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Friends Leaderboard</CardTitle>
              <CardDescription>Compete with your travel companions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-pretty">Add friends to see how you compare with your travel companions!</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          {/* Available Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redeem Rewards</CardTitle>
              <CardDescription>Use your points to unlock exclusive benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{reward.name}</h4>
                    <p className="text-sm text-muted-foreground text-pretty">{reward.description}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {reward.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-accent">{reward.cost} pts</div>
                    <Button
                      variant={userStats.totalPoints >= reward.cost ? "default" : "outline"}
                      size="sm"
                      disabled={userStats.totalPoints < reward.cost}
                      className="mt-2"
                    >
                      {userStats.totalPoints >= reward.cost ? "Redeem" : "Not enough points"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Points History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Points Activity</CardTitle>
              <CardDescription>Your latest point earnings and redemptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: "Completed trip to Office", points: 50, date: "2 hours ago", type: "earned" },
                { action: "Eco Warrior badge earned", points: 250, date: "1 day ago", type: "earned" },
                { action: "Weekend challenge completed", points: 200, date: "2 days ago", type: "earned" },
                { action: "Coffee voucher redeemed", points: -500, date: "3 days ago", type: "spent" },
                { action: "Daily login bonus", points: 25, date: "3 days ago", type: "earned" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.date}</div>
                  </div>
                  <div className={`font-bold ${activity.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                    {activity.type === "earned" ? "+" : ""}
                    {activity.points} pts
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
