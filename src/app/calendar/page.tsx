"use client"

import { useState, useEffect } from "react"
import Calendar from "@/components/Calendar"
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

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Mock tasks for demonstration - in a real app, you'd fetch from API
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
      },
      {
        id: "4",
        title: "Client meeting",
        description: "Discuss project requirements and timeline",
        status: "todo",
        priority: "high",
        dueDate: "2025-01-18",
        project: "Business",
        xpReward: 100
      },
      {
        id: "5",
        title: "Code review",
        description: "Review pull requests from team members",
        status: "todo",
        priority: "medium", 
        dueDate: "2025-01-22",
        project: "Development",
        xpReward: 80
      },
      {
        id: "6",
        title: "Sprint planning",
        description: "Plan tasks for the next sprint",
        status: "todo",
        priority: "high",
        dueDate: "2025-01-25",
        project: "Management",
        xpReward: 120
      }
    ]
    
    setTasks(mockTasks)
    setLoading(false)
  }, [])

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task)
    // Handle task click - could open a modal or navigate to task details
  }

  const handleDateClick = (date: Date) => {
    console.log("Date clicked:", date)
    // Handle date click - could open a form to create a new task for that date
  }

  const handleAddTask = (date: Date) => {
    console.log("Add task for date:", date)
    // Handle add task for specific date
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-white uppercase tracking-wide">LOADING CALENDAR...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Calendar
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onDateClick={handleDateClick}
        onAddTask={handleAddTask}
      />
    </div>
  )
}
