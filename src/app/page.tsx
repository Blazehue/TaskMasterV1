"use client"

import TaskManagementApp from "@/components/TaskManagementApp"
import Navigation from "@/components/Navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <TaskManagementApp />
    </div>
  )
}
