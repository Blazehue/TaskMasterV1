"use client"

import { useState } from "react"
import { Edit, Trash2, Clock, Flag, CheckCircle, Circle, Play } from "lucide-react"
import { motion } from "motion/react"

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  xpReward?: number
}

interface TaskCardProps {
  task: Task
  className?: string
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: Task["status"]) => void
  isDragging?: boolean
  dragHandleProps?: any
}

const priorityConfig = {
  low: { color: "text-muted-foreground", bgColor: "bg-muted" },
  medium: { color: "text-orange-500", bgColor: "bg-orange-500/10" },
  high: { color: "text-red-500", bgColor: "bg-red-500/10" }
}

const statusConfig = {
  pending: { icon: Circle, color: "text-muted-foreground" },
  "in-progress": { icon: Play, color: "text-blue-500" },
  completed: { icon: CheckCircle, color: "text-green-500" }
}

export default function TaskCard({
  task,
  className = "",
  onEdit,
  onDelete,
  onStatusChange,
  isDragging = false,
  dragHandleProps
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const StatusIcon = statusConfig[task.status].icon

  const formatDueDate = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    if (diffDays > 0) return `Due in ${diffDays} days`
    return `Overdue by ${Math.abs(diffDays)} days`
  }

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== "completed"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        relative group cursor-pointer select-none
        ${isDragging ? "border-2 border-foreground shadow-lg" : "border border-foreground"}
        ${isHovered 
          ? "bg-foreground text-background" 
          : "bg-background text-foreground"
        }
        transition-all duration-200 ease-out
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...dragHandleProps}
    >
      {/* Status indicator bar */}
      <div 
        className={`absolute top-0 left-0 w-full h-1 ${
          task.status === "completed" 
            ? "bg-green-500" 
            : task.status === "in-progress" 
            ? "bg-blue-500" 
            : "bg-muted"
        }`} 
      />

      <div className="p-4 space-y-3">
        {/* Header with status and actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <StatusIcon 
              className={`w-4 h-4 flex-shrink-0 ${
                isHovered ? "text-background" : statusConfig[task.status].color
              }`} 
            />
            <h3 className={`font-semibold text-sm leading-tight truncate ${
              task.status === "completed" ? "line-through opacity-75" : ""
            }`}>
              {task.title}
            </h3>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  isHovered ? "hover:bg-background" : "hover:bg-foreground"
                }`}
              >
                <Edit className="w-3 h-3" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  isHovered ? "hover:bg-background" : "hover:bg-foreground"
                }`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-xs leading-relaxed ${
            isHovered ? "text-background/80" : "text-muted-foreground"
          }`}>
            {task.description}
          </p>
        )}

        {/* Footer with metadata */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {/* Priority indicator */}
            <div className="flex items-center gap-1">
              <Flag className={`w-3 h-3 ${
                isHovered ? "text-background/60" : priorityConfig[task.priority].color
              }`} />
              <span className={`capitalize ${
                isHovered ? "text-background/80" : "text-muted-foreground"
              }`}>
                {task.priority}
              </span>
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${
                  isOverdue 
                    ? (isHovered ? "text-background" : "text-red-500")
                    : (isHovered ? "text-background/60" : "text-muted-foreground")
                }`} />
                <span className={`${
                  isOverdue 
                    ? (isHovered ? "text-background font-medium" : "text-red-500 font-medium")
                    : (isHovered ? "text-background/80" : "text-muted-foreground")
                }`}>
                  {formatDueDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>

          {/* XP Badge */}
          {task.xpReward && (
            <div className={`px-2 py-0.5 text-xs font-medium border ${
              isHovered 
                ? "bg-background text-foreground border-background" 
                : "bg-foreground text-background border-foreground"
            }`}>
              +{task.xpReward} XP
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}