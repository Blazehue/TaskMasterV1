import { useState, useCallback, useOptimistic } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Task } from "@/types"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

type ViewType = "month" | "week"

const DAYS_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
]

interface CalendarProps {
  className?: string
  tasks?: Task[]
  onTaskClick?: (task: Task) => void
}

function DraggableTask({ task, onTaskClick }: { task: Task; onTaskClick?: (task: Task) => void }) {
  return (
    <div
      className="p-2 mb-2 bg-blue-100 border border-blue-300 rounded cursor-pointer hover:bg-blue-200 transition-colors"
      onClick={() => onTaskClick?.(task)}
    >
      <div className="font-medium text-sm">{task.title}</div>
      <div className="text-xs text-gray-600">{task.project}</div>
    </div>
  )
}

function DroppableCell({ 
  date, 
  children, 
  isCurrentMonth, 
  isToday 
}: {
  date: Date
  children: React.ReactNode
  isCurrentMonth: boolean
  isToday: boolean
}) {
  return (
    <div
      className={cn(
        "p-2 border-r border-b border-gray-300 min-h-[120px] transition-colors",
        isCurrentMonth ? "bg-white" : "bg-gray-50",
        isToday ? "bg-blue-50 border-blue-300" : ""
      )}
    >
      <div className={cn(
        "text-sm font-medium mb-2",
        isCurrentMonth ? "text-gray-900" : "text-gray-400",
        isToday ? "text-blue-600 font-bold" : ""
      )}>
        {date.getDate()}
      </div>
      {children}
    </div>
  )
}

function MonthView({ 
  currentDate, 
  tasks, 
  onTaskClick
}: {
  currentDate: Date
  tasks: Task[]
  onTaskClick?: (task: Task) => void
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
  onTaskClick
}: {
  currentDate: Date
  tasks: Task[]
  onTaskClick?: (task: Task) => void
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
  onTaskClick
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>("month")
  const [optimisticTasks] = useOptimistic(tasks)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = useCallback(() => {
    // Handle drag start
  }, [])

  const handleDragOver = useCallback(() => {
    // Handle drag over
  }, [])

  const handleDragEnd = useCallback(() => {
    // Handle drag end
  }, [])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="border-2 border-black hover:bg-black hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={goToToday}
            className="border-2 border-black hover:bg-black hover:text-white"
          >
            TODAY
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="border-2 border-black hover:bg-black hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <h2 className="text-2xl font-black font-mono">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
            <SelectTrigger className="w-32 border-2 border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-black hover:bg-black hover:text-white"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-black hover:bg-black hover:text-white"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={[]}
          strategy={verticalListSortingStrategy}
        >
          {viewType === "month" ? (
            <MonthView
              currentDate={currentDate}
              tasks={optimisticTasks}
              onTaskClick={onTaskClick}
            />
          ) : (
            <WeekView
              currentDate={currentDate}
              tasks={optimisticTasks}
              onTaskClick={onTaskClick}
            />
          )}
        </SortableContext>
        
        <DragOverlay />
      </DndContext>
    </div>
  )
}
