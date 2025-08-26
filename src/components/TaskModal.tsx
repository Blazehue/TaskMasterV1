"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Flag, Folder, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export interface Task {
  id?: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  project: string
  xpReward: number
  status?: "todo" | "inprogress" | "complete"
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  onDelete?: (taskId: string) => void
  task?: Task | null
  projects?: string[]
}

const DEFAULT_TASK: Task = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  project: "",
  xpReward: 100,
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "bg-muted" },
  { value: "medium", label: "Medium", color: "bg-primary" },
  { value: "high", label: "High", color: "bg-destructive" },
] as const

const XP_PRESETS = [50, 100, 150, 200, 250, 300]

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  projects = ["Personal", "Work", "Side Project"],
}: TaskModalProps) {
  const [formData, setFormData] = useState<Task>(DEFAULT_TASK)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = Boolean(task?.id)

  useEffect(() => {
    if (isOpen) {
      setFormData(task || DEFAULT_TASK)
      setErrors({})
      // Focus management
      const firstInput = document.querySelector('[data-autofocus]') as HTMLInputElement
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100)
      }
    }
  }, [isOpen, task])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }
    if (!formData.project.trim()) {
      newErrors.project = "Project is required"
    }
    if (formData.xpReward < 1 || formData.xpReward > 1000) {
      newErrors.xpReward = "XP must be between 1 and 1000"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleDelete = () => {
    if (task?.id && onDelete) {
      onDelete(task.id)
      onClose()
    }
  }

  const updateField = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const getDifficultyLabel = (xp: number): string => {
    if (xp <= 75) return "Easy"
    if (xp <= 150) return "Medium"
    if (xp <= 250) return "Hard"
    return "Expert"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit Task" : "Create Task"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4" />
              <span>{formData.xpReward} XP</span>
              <span>•</span>
              <span>{getDifficultyLabel(formData.xpReward)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-accent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              data-autofocus
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter task title..."
              className={`bg-background border-border ${errors.title ? "border-destructive" : ""}`}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the task details..."
              rows={3}
              className="bg-background border-border resize-none"
            />
          </div>

          {/* Due Date & Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateField("dueDate", e.target.value)}
                  className={`bg-background border-border ${errors.dueDate ? "border-destructive" : ""}`}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {PRIORITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("priority", option.value)}
                    className={`flex-1 px-3 py-2 text-sm border border-border transition-colors
                      ${formData.priority === option.value 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background hover:bg-accent"
                      }`}
                  >
                    <Flag className="w-3 h-3 mx-auto mb-1" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project & XP Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <div className="relative">
                <select
                  id="project"
                  value={formData.project}
                  onChange={(e) => updateField("project", e.target.value)}
                  className={`w-full px-3 py-2 bg-background border border-border text-foreground appearance-none ${errors.project ? "border-destructive" : ""}`}
                >
                  <option value="">Select project...</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
                <Folder className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.project && (
                <p className="text-sm text-destructive">{errors.project}</p>
              )}
            </div>

            {/* XP Reward */}
            <div className="space-y-2">
              <Label htmlFor="xpReward">XP Reward</Label>
              <div className="space-y-2">
                <Input
                  id="xpReward"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.xpReward}
                  onChange={(e) => updateField("xpReward", parseInt(e.target.value) || 0)}
                  className={`bg-background border-border ${errors.xpReward ? "border-destructive" : ""}`}
                />
                <div className="flex gap-1 flex-wrap">
                  {XP_PRESETS.map((xp) => (
                    <button
                      key={xp}
                      type="button"
                      onClick={() => updateField("xpReward", xp)}
                      className={`px-2 py-1 text-xs border border-border transition-colors
                        ${formData.xpReward === xp 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background hover:bg-accent"
                        }`}
                    >
                      {xp}
                    </button>
                  ))}
                </div>
              </div>
              {errors.xpReward && (
                <p className="text-sm text-destructive">{errors.xpReward}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div>
            {isEditing && onDelete && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}