import { Project, Task } from "@/types"

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    taskCount: 8,
    completedTasks: 5,
    dueDate: "2024-02-15",
    category: "Design",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Build a cross-platform mobile app for iOS and Android",
    taskCount: 12,
    completedTasks: 2,
    dueDate: "2024-03-30",
    category: "Development",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Launch Q1 marketing campaign across all channels",
    taskCount: 6,
    completedTasks: 6,
    dueDate: "2024-01-31",
    category: "Marketing",
    createdAt: "2023-12-01",
    updatedAt: "2024-01-31"
  }
]

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    status: "todo",
    priority: "high",
    dueDate: "2024-01-15",
    project: "Website Redesign",
    xpReward: 150
  },
  {
    id: "2",
    title: "Review team submissions",
    description: "Go through all team member submissions for the quarterly review",
    status: "inprogress",
    priority: "medium",
    dueDate: "2024-01-12",
    project: "Marketing Campaign",
    xpReward: 100
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the API documentation with recent changes",
    status: "complete",
    priority: "low",
    dueDate: "2024-01-10",
    project: "Mobile App Development",
    xpReward: 75
  }
]

// Local storage keys
const PROJECTS_KEY = 'taskmaster_projects'
const TASKS_KEY = 'taskmaster_tasks'

// Helper functions for localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Initialize data from localStorage or use mock data
let projects: Project[] = getFromStorage(PROJECTS_KEY, mockProjects)
let tasks: Task[] = getFromStorage(TASKS_KEY, mockTasks)

// Projects API
export const projectsAPI = {
  async getAll(): Promise<Project[]> {
    return projects
  },

  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    projects.push(newProject)
    setToStorage(PROJECTS_KEY, projects)
    return newProject
  },

  async update(id: number, updates: Partial<Project>): Promise<Project> {
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    setToStorage(PROJECTS_KEY, projects)
    return projects[index]
  },

  async delete(id: number): Promise<void> {
    projects = projects.filter(p => p.id !== id)
    setToStorage(PROJECTS_KEY, projects)
  }
}

// Tasks API
export const tasksAPI = {
  async getAll(): Promise<Task[]> {
    return tasks
  },

  async getUpcoming(limit: number = 10): Promise<Task[]> {
    const now = new Date()
    const upcoming = tasks
      .filter(task => task.status !== 'complete')
      .filter(task => {
        if (!task.dueDate) return true
        const dueDate = new Date(task.dueDate)
        return dueDate >= now
      })
      .sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
      .slice(0, limit)
    
    return upcoming
  },

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    }
    tasks.push(newTask)
    setToStorage(TASKS_KEY, tasks)
    return newTask
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    tasks[index] = {
      ...tasks[index],
      ...updates
    }
    setToStorage(TASKS_KEY, tasks)
    return tasks[index]
  },

  async delete(id: string): Promise<void> {
    tasks = tasks.filter(t => t.id !== id)
    setToStorage(TASKS_KEY, tasks)
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    return this.update(id, { status })
  }
}

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Wrapper functions that simulate API behavior
export const api = {
  projects: {
    async getAll() {
      await delay(300) // Simulate network delay
      return projectsAPI.getAll()
    },
    async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
      await delay(500)
      return projectsAPI.create(project)
    },
    async update(id: number, updates: Partial<Project>) {
      await delay(400)
      return projectsAPI.update(id, updates)
    },
    async delete(id: number) {
      await delay(300)
      return projectsAPI.delete(id)
    }
  },
  tasks: {
    async getAll() {
      await delay(300)
      return tasksAPI.getAll()
    },
    async getUpcoming(limit?: number) {
      await delay(300)
      return tasksAPI.getUpcoming(limit)
    },
    async create(task: Omit<Task, 'id'>) {
      await delay(500)
      return tasksAPI.create(task)
    },
    async update(id: string, updates: Partial<Task>) {
      await delay(400)
      return tasksAPI.update(id, updates)
    },
    async delete(id: string) {
      await delay(300)
      return tasksAPI.delete(id)
    },
    async updateStatus(id: string, status: Task['status']) {
      await delay(300)
      return tasksAPI.updateStatus(id, status)
    }
  }
}
