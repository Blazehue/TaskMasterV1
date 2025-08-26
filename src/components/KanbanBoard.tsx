"use client"

import React, { useState, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Plus, Grip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

type Id = string | number
type ColumnType = "todo" | "doing" | "done"

interface Column {
  id: Id
  title: string
  type: ColumnType
}

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

interface KanbanTask {
  id: Id
  columnId: Id
  title: string
  description?: string
  originalTask?: Task
}

interface KanbanBoardProps {
  className?: string
  tasks?: Task[]
  onTaskClick?: (task: Task) => void
  onAddTask?: () => void
  onTaskUpdate?: (taskId: string, newStatus: string) => void
}

const DEFAULT_COLUMNS: Column[] = [
  {
    id: "backlog",
    title: "BACKLOG",
    type: "todo",
  },
  {
    id: "todo",
    title: "TO-DO",
    type: "todo",
  },
  {
    id: "doing", 
    title: "DOING",
    type: "doing",
  },
  {
    id: "done",
    title: "DONE",
    type: "done",
  },
]

const convertTasksToKanbanTasks = (tasks: Task[]): KanbanTask[] => {
  return tasks.map(task => ({
    id: task.id,
    columnId: task.status === "todo" ? "todo" : task.status === "inprogress" ? "doing" : task.status === "complete" ? "done" : "backlog",
    title: task.title,
    description: task.description,
    originalTask: task
  }))
}

function TaskCard({ task, isOverlay, onTaskClick }: { task: KanbanTask; isOverlay?: boolean; onTaskClick?: (task: Task) => void }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const [mouseIsOver, setMouseIsOver] = useState(false)

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-card p-2.5 h-[100px] min-h-[100px] items-center flex text-left border-2 border-primary cursor-grab relative"
      />
    )
  }

  if (isOverlay) {
    return (
      <div className="bg-card p-2.5 h-[100px] min-h-[100px] items-center flex text-left border-2 border-primary cursor-grab relative">
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {task.title}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        setMouseIsOver(false)
        if (task.originalTask && onTaskClick) {
          onTaskClick(task.originalTask)
        }
      }}
      className={`
        p-3 h-[100px] min-h-[100px] items-center flex text-left cursor-grab relative
        border-2 border-black bg-white text-black
        hover:bg-black hover:text-white hover:border-white
        transition-all duration-200 ease-in-out
        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px]
        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
        active:transform active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        group
      `}
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}. Press Enter or Space to open, or use arrow keys to move between tasks.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (task.originalTask && onTaskClick) {
            onTaskClick(task.originalTask)
          }
        }
      }}
    >
      <div className="w-3 h-3 bg-black group-hover:bg-white absolute top-2 left-2 transition-colors" />
      <Grip 
        className="w-5 h-5 absolute top-2 right-2 opacity-40 group-hover:opacity-100 transition-opacity" 
        aria-label="Drag handle"
      />
      <p className="my-auto h-[90%] w-full pr-10 overflow-y-auto overflow-x-hidden whitespace-pre-wrap font-mono text-sm font-medium leading-tight">
        {task.title}
      </p>
      
      {/* Priority indicator */}
      {task.originalTask?.priority && (
        <div className={`absolute bottom-2 left-2 w-2 h-2 transition-colors ${
          task.originalTask.priority === 'high' ? 'bg-red-500 group-hover:bg-red-300' :
          task.originalTask.priority === 'medium' ? 'bg-yellow-500 group-hover:bg-yellow-300' :
          'bg-green-500 group-hover:bg-green-300'
        }`} />
      )}
    </div>
  )
}

function ColumnContainer({ column, tasks, onTaskClick }: { column: Column; tasks: KanbanTask[]; onTaskClick?: (task: Task) => void }) {
  const [editMode, setEditMode] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const tasksIds = tasks.map((task) => task.id)

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-muted opacity-40 border-2 border-primary w-[350px] h-[500px] max-h-[500px] flex flex-col"
      ></div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white w-[350px] h-[600px] max-h-[600px] flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        className="bg-black text-white text-md h-[60px] cursor-grab p-4 font-black flex items-center justify-between font-mono uppercase tracking-wider"
      >
        <div className="flex gap-3 items-center">
          <div className="w-7 h-7 bg-white text-black flex justify-center items-center text-xs font-black border border-white">
            {tasks.length}
          </div>
          {!editMode && (
            <span className="text-sm font-black tracking-wider">
              {column.title}
            </span>
          )}
          {editMode && (
            <Input
              className="bg-white text-black focus:outline-none border-2 border-white px-2 font-mono uppercase tracking-wide text-sm"
              value={column.title}
              onChange={(e) => e.target.value}
              autoFocus
              onBlur={() => {
                setEditMode(false)
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return
                setEditMode(false)
              }}
            />
          )}
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-4 overflow-x-hidden overflow-y-auto bg-white">
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-500 font-mono text-sm uppercase tracking-wide border-2 border-dashed border-gray-400 py-8">
            DROP TASKS HERE
          </div>
        )}
      </div>
      
      {/* Column footer */}
      <button
        className="flex gap-2 items-center justify-center border-t-2 border-black p-4 bg-white hover:bg-black hover:text-white transition-all duration-200 font-mono uppercase tracking-wider text-sm font-black group text-black"
        onClick={() => {
          // Add task functionality can be added here
        }}
        aria-label={`Add new task to ${column.title} column`}
      >
        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
        ADD TASK
      </button>
    </div>
  )
}

export default function KanbanBoard({ className = "", tasks = [], onTaskClick, onAddTask, onTaskUpdate }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS)
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(() => convertTasksToKanbanTasks(tasks))
  
  const [activeColumn, setActiveColumn] = useState<Column | null>(null)
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)

  // Update kanban tasks when props tasks change
  React.useEffect(() => {
    setKanbanTasks(convertTasksToKanbanTasks(tasks))
  }, [tasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Function to update task status in backend
  const updateTaskStatus = useCallback(async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      // You might want to show a toast notification here
    }
  }, [])

  return (
    <div className={`bg-black min-h-screen w-full overflow-x-auto overflow-y-hidden p-6 ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-black font-mono tracking-wider text-white uppercase mb-2">
          KANBAN BOARD
        </h1>
        <p className="text-sm font-mono text-gray-300 uppercase tracking-wide">
          DRAG TASKS BETWEEN COLUMNS TO UPDATE STATUS
        </p>
      </div>
      
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <div className="flex gap-6 pb-6">
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={verticalListSortingStrategy}
          >
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={kanbanTasks.filter((task) => task.columnId === col.id)}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              tasks={kanbanTasks.filter((task) => task.columnId === activeColumn.id)}
              onTaskClick={onTaskClick}
            />
          )}

          {activeTask && (
            <div className="p-3 h-[100px] border-2 border-black bg-white text-black font-mono text-sm font-medium shadow-lg transform rotate-2 opacity-90">
              <div className="w-3 h-3 bg-black absolute top-2 left-2" />
              <p className="my-auto h-[90%] w-full pr-10 overflow-y-auto overflow-x-hidden whitespace-pre-wrap leading-tight">
                {activeTask.title}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
      type: "todo",
    }

    setColumns([...columns, columnToAdd])
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id)
    setColumns(filteredColumns)

    const newTasks = kanbanTasks.filter((t) => t.columnId !== id)
    setKanbanTasks(newTasks)
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col
      return { ...col, title }
    })

    setColumns(newColumns)
  }

  function createTask(columnId: Id) {
    const newTask: KanbanTask = {
      id: generateId(),
      columnId,
      title: `Task ${kanbanTasks.length + 1}`,
    }

    setKanbanTasks([...kanbanTasks, newTask])
  }

  function deleteTask(id: Id) {
    const newTasks = kanbanTasks.filter((task) => task.id !== id)
    setKanbanTasks(newTasks)
  }

  function updateTask(id: Id, title: string) {
    const newTasks = kanbanTasks.map((task) => {
      if (task.id !== id) return task
      return { ...task, title }
    })

    setKanbanTasks(newTasks)
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column)
      return
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task)
      return
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveAColumn = active.data.current?.type === "Column"
    if (!isActiveAColumn) return

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId)

      const overColumnIndex = columns.findIndex((col) => col.id === overId)

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"

    if (!isActiveATask) return

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setKanbanTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          // Update column and reorder
          const newColumnId = tasks[overIndex].columnId
          tasks[activeIndex].columnId = newColumnId
          
          // Update backend and parent component
          const newStatus = getStatusFromColumnId(newColumnId.toString())
          updateTaskStatus(activeId.toString(), newStatus)
          onTaskUpdate?.(activeId.toString(), newStatus)
          
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === "Column"

    // Dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setKanbanTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const oldColumnId = tasks[activeIndex].columnId
        
        if (oldColumnId !== overId) {
          tasks[activeIndex].columnId = overId
          
          // Update backend and parent component
          const newStatus = getStatusFromColumnId(overId.toString())
          updateTaskStatus(activeId.toString(), newStatus)
          onTaskUpdate?.(activeId.toString(), newStatus)
        }
        
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }
  
  // Helper function to convert column ID to task status
  function getStatusFromColumnId(columnId: string): string {
    switch (columnId) {
      case 'backlog':
        return 'backlog'
      case 'todo':
        return 'todo'
      case 'doing':
        return 'inprogress'
      case 'done':
        return 'complete'
      default:
        return 'todo'
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001)
}