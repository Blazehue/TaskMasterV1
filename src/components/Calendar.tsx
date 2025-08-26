"use client"

import { useState, useCallback, useOptimistic } from "react"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Grid, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"

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

interface CalendarProps {
  className?: string
  tasks?: Task[]
  onTaskClick?: (task: Task) => void
  onDateClick?: (date: Date) => void
  onAddTask?: (date: Date) => void
}

type ViewType = "month" | "week"

const DAYS_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const DAYS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
]

function DraggableTask({ task, onTaskClick }: { task: Task; onTaskClick?: (task: Task) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation()
        onTaskClick?.(task)
      }}
      className={cn(
        "text-xs p-2 font-mono font-medium cursor-grab select-none",
        "border-2 border-black bg-white text-black",
        "hover:bg-black hover:text-white transition-all duration-200",
        "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-black",
        "group relative",
        isDragging && "opacity-50 transform rotate-2 scale-105"
      )}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}`}
    >
      <div className="w-2 h-2 bg-black group-hover:bg-white absolute top-1 left-1 transition-colors" />
      <div className="truncate font-black tracking-wide text-xs uppercase">
        {task.title}
      </div>
      {/* Priority indicator bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 transition-colors ${
        task.priority === 'high' ? 'bg-red-500 group-hover:bg-red-300' :
        task.priority === 'medium' ? 'bg-yellow-500 group-hover:bg-yellow-300' :
        'bg-green-500 group-hover:bg-green-300'
      }`} />
    </div>
  )
}

function DroppableCell({ date, children, onDrop, isCurrentMonth, isToday }: {
  date: Date
  children: React.ReactNode
  onDrop: (date: Date) => void
  isCurrentMonth: boolean
  isToday: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
    data: {
      date,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[120px] border-black border-r-2 border-b-2 last:border-r-0 bg-white relative p-2 group cursor-pointer text-black",
        "hover:bg-gray-200 transition-all duration-200",
        !isCurrentMonth && "bg-gray-100 text-gray-500",
        isToday && "bg-black text-white font-black",
        isOver && "bg-gray-300 ring-4 ring-black ring-inset shadow-inner"
      )}
    >
      {/* Date Number */}
      <div className={cn(
        "text-sm font-black font-mono mb-2 w-6 h-6 flex items-center justify-center border-2",
        isToday ? "text-white bg-black border-black" : "text-black bg-white border-black",
        !isCurrentMonth && "border-gray-400 text-gray-500"
      )}>
        {date.getDate()}
      </div>
      
      {/* Tasks */}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

function MonthView({ 
  currentDate, 
  tasks, 
  onTaskClick, 
  onTaskDrop,
  activeTask 
}: {
  currentDate: Date
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskDrop: (taskId: string, newDate: Date) => void
  activeTask: Task | null
}) {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(firstDayOfMonth.getDate() - (firstDayOfMonth.getDay() + 6) % 7)
  
  const endDate = new Date(lastDayOfMonth)
  endDate.setDate(lastDayOfMonth.getDate() + (7 - lastDayOfMonth.getDay()) % 7)
  
  const days = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  return (
    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b-4 border-black">
        {DAYS_SHORT.map(day => (
          <div
            key={day}
            className="p-4 text-center text-sm font-black font-mono bg-black text-white border-r-2 border-gray-800 last:border-r-0 tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const dayTasks = getTasksForDate(date)
          const isCurrentMonthDay = isCurrentMonth(date)
          const isTodayDate = isToday(date)
          
          return (
            <DroppableCell
              key={index}
              date={date}
              onDrop={(date) => {/* This is handled by drag events */}}
              isCurrentMonth={isCurrentMonthDay}
              isToday={isTodayDate}
            >
              {dayTasks.map(task => (
                <DraggableTask 
                  key={task.id} 
                  task={task} 
                  onTaskClick={onTaskClick}
                />
              ))}
            </DroppableCell>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ 
  currentDate, 
  tasks, 
  onTaskClick, 
  onTaskDrop,
  activeTask 
}: {
  currentDate: Date
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskDrop: (taskId: string, newDate: Date) => void
  activeTask: Task | null
}) {
  const today = new Date()
  
  // Get start of week (Monday)
  const startOfWeek = new Date(currentDate)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)
  
  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDays.push(date)
  }
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b-4 border-black">
        {weekDays.map((date, index) => (
          <div
            key={index}
            className={cn(
              "p-4 text-center border-r-2 border-gray-800 last:border-r-0 font-mono transition-all duration-200",
              isToday(date) ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            )}
          >
            <div className="font-black text-sm tracking-widest">{DAYS_SHORT[index]}</div>
            <div className="text-2xl font-black mt-2 mb-1">{date.getDate()}</div>
            <div className="text-xs uppercase tracking-widest font-bold">
              {MONTHS[date.getMonth()].slice(0, 3)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Week Days */}
      <div className="grid grid-cols-7 min-h-[500px]">
        {weekDays.map((date, index) => {
          const dayTasks = getTasksForDate(date)
          const isTodayDate = isToday(date)
          
          return (
            <DroppableCell
              key={index}
              date={date}
              onDrop={(date) => {/* This is handled by drag events */}}
              isCurrentMonth={true}
              isToday={isTodayDate}
            >
              {dayTasks.map(task => (
                <DraggableTask 
                  key={task.id} 
                  task={task} 
                  onTaskClick={onTaskClick}
                />
              ))}
            </DroppableCell>
          )
        })}
      </div>
    </div>
  )
}

export default function Calendar({
  className,
  tasks = [],
  onTaskClick,
  onDateClick,
  onAddTask
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>("month")
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(tasks)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
  const navigatePeriod = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (viewType === "month") {
        if (direction === "prev") {
          newDate.setMonth(prev.getMonth() - 1)
        } else {
          newDate.setMonth(prev.getMonth() + 1)
        }
      } else {
        if (direction === "prev") {
          newDate.setDate(prev.getDate() - 7)
        } else {
          newDate.setDate(prev.getDate() + 7)
        }
      }
      return newDate
    })
  }
  
  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task
    if (task) {
      setActiveTask(task)
    }
  }
  
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    
    const { active, over } = event
    if (!over) return
    
    const task = active.data.current?.task
    const newDate = over.data.current?.date
    
    if (task && newDate) {
      handleTaskDrop(task.id, newDate)
    }
  }
  
  const handleTaskDrop = useCallback((taskId: string, newDate: Date) => {
    // Optimistic update
    const updatedTasks = optimisticTasks.map(task => 
      task.id === taskId 
        ? { ...task, dueDate: newDate.toISOString().split('T')[0] }
        : task
    )
    setOptimisticTasks(updatedTasks)
    
    // Here you would typically make an API call to update the task
    // For now, we'll just use the optimistic update
  }, [optimisticTasks, setOptimisticTasks])
  
  const getDisplayTitle = () => {
    if (viewType === "month") {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    } else {
      const startOfWeek = new Date(currentDate)
      const day = startOfWeek.getDay()
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
      startOfWeek.setDate(diff)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${MONTHS[startOfWeek.getMonth()]} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`
      } else {
        return `${MONTHS[startOfWeek.getMonth()].slice(0, 3)} ${startOfWeek.getDate()} - ${MONTHS[endOfWeek.getMonth()].slice(0, 3)} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`
      }
    }
  }

  return (
    <div className={cn("bg-black p-6 min-h-screen", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black font-mono tracking-wider text-white uppercase">
            {getDisplayTitle()}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex border-2 border-white bg-black">
            <button
              onClick={() => setViewType("month")}
              className={cn(
                "px-4 py-2 text-sm font-mono font-bold uppercase tracking-wide transition-all",
                viewType === "month" 
                  ? "bg-white text-black" 
                  : "bg-black text-white hover:bg-gray-800"
              )}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              MONTH
            </button>
            <button
              onClick={() => setViewType("week")}
              className={cn(
                "px-4 py-2 text-sm font-mono font-bold uppercase tracking-wide border-l-2 border-white transition-all",
                viewType === "week" 
                  ? "bg-white text-black" 
                  : "bg-black text-white hover:bg-gray-800"
              )}
            >
              <Grid className="w-4 h-4 inline mr-2" />
              WEEK
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex border-2 border-white bg-black">
            <button
              onClick={() => navigatePeriod("prev")}
              className="p-2 bg-black text-white hover:bg-white hover:text-black transition-all"
              aria-label={`Previous ${viewType}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigatePeriod("next")}
              className="p-2 bg-black text-white hover:bg-white hover:text-black border-l-2 border-white transition-all"
              aria-label={`Next ${viewType}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {viewType === "month" ? (
          <MonthView 
            currentDate={currentDate}
            tasks={optimisticTasks}
            onTaskClick={onTaskClick}
            onTaskDrop={handleTaskDrop}
            activeTask={activeTask}
          />
        ) : (
          <WeekView 
            currentDate={currentDate}
            tasks={optimisticTasks}
            onTaskClick={onTaskClick}
            onTaskDrop={handleTaskDrop}
            activeTask={activeTask}
          />
        )}
        
        <DragOverlay>
          {activeTask && (
            <div className="p-2 font-mono font-black text-xs border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2 scale-110 opacity-95 uppercase tracking-wide">
              <div className="w-2 h-2 bg-black absolute top-1 left-1" />
              {activeTask.title}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                activeTask.priority === 'high' ? 'bg-red-500' :
                activeTask.priority === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
