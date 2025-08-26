"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface DashboardProps {
  className?: string
  userStats?: UserStats
  tasks?: Task[]
  onTaskClick?: (task: Task) => void
}

export default function Dashboard({ 
  className,
  userStats = { xp: 750, maxXp: 1000, level: 5, streak: 7 },
  tasks = [],
  onTaskClick
}: DashboardProps) {
  const weeklyData = [
    { day: 'Mon', completed: 8, total: 10 },
    { day: 'Tue', completed: 6, total: 8 },
    { day: 'Wed', completed: 12, total: 12 },
    { day: 'Thu', completed: 5, total: 9 },
    { day: 'Fri', completed: 7, total: 8 },
    { day: 'Sat', completed: 3, total: 5 },
    { day: 'Sun', completed: 4, total: 6 }
  ]

  const completedTasks = tasks.filter(task => task.status === 'complete')
  const totalTasks = tasks.length
  const totalXp = completedTasks.reduce((sum, task) => sum + task.xpReward, 0)

  const achievements = [
    { id: 1, title: "Speed Demon", description: "Complete 10 tasks in one day", earned: true },
    { id: 2, title: "Streak Master", description: "7-day completion streak", earned: true },
    { id: 3, title: "Team Player", description: "Collaborate on 5 projects", earned: false },
    { id: 4, title: "Early Bird", description: "Complete tasks before 9 AM", earned: true }
  ]

  const upcomingTasks = tasks
    .filter(task => task.status !== 'complete')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 transition-colors hover:bg-accent group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="h-8 w-8 text-muted-foreground">📝</div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 transition-colors hover:bg-accent group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold">{completedTasks.length}</p>
            </div>
            <div className="h-8 w-8 text-muted-foreground">✅</div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 transition-colors hover:bg-accent group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
              <p className="text-3xl font-bold">{userStats.streak}</p>
            </div>
            <div className="h-8 w-8 text-muted-foreground">🔥</div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 transition-colors hover:bg-accent group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total XP</p>
              <p className="text-3xl font-bold">{totalXp.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 text-muted-foreground">🏆</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Task Completion Chart */}
        <div className="lg:col-span-2 bg-card border border-border p-6">
          <h3 className="text-lg font-bold mb-6">Weekly Progress</h3>
          <div className="space-y-4">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-8 text-sm font-medium">{day.day}</div>
                <div className="flex-1 bg-muted h-6 border border-border">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(day.completed / day.total) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground w-16">
                  {day.completed}/{day.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XP Progress & Level */}
        <div className="space-y-4">
          <div className="bg-card border border-border p-6">
            <h3 className="text-lg font-bold mb-4">Level Progress</h3>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground font-bold text-xl border">
                {userStats.level}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Current Level</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>XP Progress</span>
                <span>{userStats.xp}/{userStats.maxXp}</span>
              </div>
              <div className="bg-muted h-2 border border-border">
                <div className="bg-primary h-full" style={{ width: `${(userStats.xp / userStats.maxXp) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{userStats.maxXp - userStats.xp} XP to next level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="bg-card border border-border p-6">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No tasks yet</div>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-start gap-3 p-2 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => onTaskClick?.(task)}
                >
                  <div className="mt-0.5">
                    {task.status === 'complete' ? (
                      <span className="text-green-600">✅</span>
                    ) : (
                      <span className="text-muted-foreground">⏱️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{task.project}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-card border border-border p-6">
          <h3 className="text-lg font-bold mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No upcoming tasks</div>
            ) : (
              upcomingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-2 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => onTaskClick?.(task)}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</p>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium border ${
                    task.priority === 'high' ? 'bg-red-500/20 text-red-500 border-red-500' :
                    task.priority === 'medium' ? 'bg-primary/20 text-primary border-primary' :
                    'bg-muted text-muted-foreground border-border'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-card border border-border p-6">
          <h3 className="text-lg font-bold mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-3 text-center border transition-colors ${
                  achievement.earned 
                    ? 'bg-primary/20 border-primary hover:bg-primary/30' 
                    : 'bg-muted border-border opacity-50'
                }`}
              >
                <div className="mb-2">
                  <span className="text-2xl">{achievement.earned ? '⭐' : '⚪'}</span>
                </div>
                <p className="text-xs font-medium">{achievement.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}