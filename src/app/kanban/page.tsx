"use client"

import { useState, useEffect } from "react"
import KanbanBoard from "@/components/KanbanBoard"
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

export default function KanbanPage() {
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
        dueDate: "2024-01-15",
        project: "Work",
        xpReward: 150
      },
      {
        id: "2", 
        title: "Review team submissions",
        description: "Go through all team member submissions for the quarterly review",
        status: "inprogress",
        priority: "medium",
        dueDate: "2024-01-12",
        project: "Management",
        xpReward: 100
      },
      {
        id: "3",
        title: "Update documentation", 
        description: "Update the API documentation with recent changes",
        status: "complete",
        priority: "low",
        dueDate: "2024-01-10",
        project: "Development",
        xpReward: 75
      },
      {
        id: "4",
        title: "Design new features",
        description: "Create mockups for the upcoming features",
        status: "todo",
        priority: "medium",
        dueDate: "2024-01-20",
        project: "Design",
        xpReward: 125
      }
    ]
    
    setTasks(mockTasks)
    setLoading(false)
  }, [])

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task)
    // Handle task click - could open a modal or navigate to task details
  }

  const handleAddTask = () => {
    console.log("Add task clicked")
    // Handle add task - could open a form modal
  }

  const handleTaskUpdate = (taskId: string, newStatus: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus as Task['status'] }
          : task
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-white uppercase tracking-wide">LOADING KANBAN...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <KanbanBoard 
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  )
}
