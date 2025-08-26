"use client"

import { useState, useEffect } from "react"
import Dashboard from "@/components/Dashboard"
import Navigation from "@/components/Navigation"

interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "inprogress" | "complete"
  priority: "low" | "medium" | "high"
  dueDate: string
  project: string
  xpReward: number
}

interface UserStats {
  xp: number
  maxXp: number
  level: number
  streak: number
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userStats] = useState<UserStats>({
    xp: 750,
    maxXp: 1000,
    level: 5,
    streak: 7
  })

  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Complete project proposal",
        description: "Draft and finalize the Q1 project proposal for client review",
        status: "todo",
        priority: "high",
        dueDate: "2025-01-15",
        project: "Work",
        xpReward: 150
      },
      {
        id: "2",
        title: "Review team submissions",
        description: "Go through all team member submissions for the quarterly review",
        status: "inprogress",
        priority: "medium",
        dueDate: "2025-01-12",
        project: "Management",
        xpReward: 100
      },
      {
        id: "3",
        title: "Update documentation",
        description: "Update the API documentation with recent changes",
        status: "complete",
        priority: "low",
        dueDate: "2025-01-10",
        project: "Development",
        xpReward: 75
      }
    ]

    const mockUpcomingTasks = [
      {
        id: 1,
        title: "Design new landing page",
        description: "Create mockups for the new marketing landing page",
        priority: "high",
        dueDate: "2025-01-20",
        projectId: 1
      },
      {
        id: 2,
        title: "Implement user authentication",
        description: "Add login and registration functionality",
        priority: "medium",
        dueDate: "2025-01-25",
        projectId: 2
      }
    ]
    
    setTasks(mockTasks)
    setUpcomingTasks(mockUpcomingTasks)
    setLoading(false)
  }, [])

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task)
    // Handle task click - could open a modal or navigate to task details
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-white uppercase tracking-wide">LOADING DASHBOARD...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Dashboard 
        userStats={userStats}
        tasks={tasks}
        onTaskClick={handleTaskClick}
      />
    </div>
  )
}
