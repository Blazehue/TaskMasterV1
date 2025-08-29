import { useState, useEffect } from "react"
import { Plus, Calendar, Filter, ChevronDown, Loader2 } from "lucide-react"
import ProjectForm from "./ProjectForm"
import { Project } from "@/types"

interface ProjectGridProps {
  onProjectClick?: (project: Project) => void
  className?: string
}

export default function ProjectGrid({ 
  onProjectClick,
  className = "" 
}: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"title" | "category" | "createdAt">("createdAt")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { api } = await import('@/lib/data')
      const data = await api.projects.getAll()
      setProjects(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const categories = Array.from(new Set(projects.map(p => p.category).filter((category): category is string => category !== null)))

  const filteredAndSortedProjects = projects
    .filter(project => 
      filterCategory === "all" || project.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "category":
          return (a.category || "").localeCompare(b.category || "")
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0
    return Math.round((completed / total) * 100)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleProjectSuccess = () => {
    fetchProjects() // Refresh the projects list
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-muted-foreground">Loading projects...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center p-12 ${className}`}>
        <div className="text-destructive mb-4">Error: {error}</div>
        <button 
          onClick={fetchProjects}
          className="px-4 py-2 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-background border border-border text-sm px-3 py-1 rounded-none focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "title" | "category" | "createdAt")}
              className="bg-background border border-border text-sm px-3 py-1 rounded-none focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredAndSortedProjects.length} projects
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Add Project Card */}
        <div 
          onClick={() => setIsFormOpen(true)}
          className="group aspect-[4/3] border-2 border-dashed border-black bg-white hover:bg-black hover:text-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 p-6 font-mono"
        >
          <Plus className="w-8 h-8 text-black group-hover:text-white transition-colors" />
          <span className="text-sm font-bold uppercase tracking-wide text-black group-hover:text-white transition-colors">
            ADD PROJECT
          </span>
        </div>

        {/* Project Cards */}
        {filteredAndSortedProjects.map((project) => {
          const progressPercentage = getProgressPercentage(project.completedTasks, project.taskCount)
          
          return (
            <div
              key={project.id}
              onClick={() => onProjectClick?.(project)}
              className="group aspect-[4/3] border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-200 cursor-pointer p-4 flex flex-col font-mono relative overflow-hidden"
            >
              {/* Corner accent */}
              <div className="w-3 h-3 bg-black group-hover:bg-white absolute top-2 left-2 transition-colors" />
              
              {/* Header */}
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <h3 className="font-black text-sm leading-tight line-clamp-2 uppercase tracking-wide text-black group-hover:text-white">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-600 group-hover:text-gray-300 line-clamp-3 font-medium">
                    {project.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-3">
                {/* Task Count */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wide text-black group-hover:text-white">TASKS</span>
                  <span className="font-black text-black group-hover:text-white">
                    {project.completedTasks}/{project.taskCount}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wide text-black group-hover:text-white">PROGRESS</span>
                    <span className="font-black text-black group-hover:text-white">{progressPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 group-hover:bg-gray-700 border border-black">
                    <div 
                      className="h-full bg-black group-hover:bg-white transition-all duration-200"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Category & Due Date */}
                <div className="flex items-center justify-between">
                  {/* Category */}
                  {project.category && (
                    <div className="text-xs px-2 py-1 border border-black bg-white group-hover:bg-black group-hover:text-white font-bold uppercase tracking-wide text-black">
                      {project.category}
                    </div>
                  )}

                  {/* Due Date */}
                  {project.dueDate && (
                    <div className="flex items-center gap-1 text-xs font-bold text-black group-hover:text-white">
                      <Calendar className="w-3 h-3" />
                      <span className="uppercase tracking-wide">{formatDate(project.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleProjectSuccess}
      />
    </div>
  )
}