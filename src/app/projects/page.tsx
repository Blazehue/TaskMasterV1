"use client"

import ProjectGrid from "@/components/ProjectGrid"
import Navigation from "@/components/Navigation"

export default function ProjectsPage() {
  const handleProjectClick = (project: any) => {
    console.log("Project clicked:", project)
    // Handle project click - could navigate to project details or open a modal
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black font-mono tracking-wider text-white uppercase mb-4">
            PROJECTS
          </h1>
          <p className="text-lg font-mono text-gray-300 uppercase tracking-wide">
            MANAGE YOUR PROJECTS AND UPCOMING TASKS
          </p>
        </div>
        
        <ProjectGrid onProjectClick={handleProjectClick} />
      </div>
    </div>
  )
}
