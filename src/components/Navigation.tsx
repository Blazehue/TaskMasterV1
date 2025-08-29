import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderOpen, Calendar, Columns3 } from "lucide-react"

const navigationItems = [
  {
    name: "DASHBOARD",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "PROJECTS", 
    href: "/projects",
    icon: FolderOpen
  },
  {
    name: "KANBAN",
    href: "/kanban", 
    icon: Columns3
  },
  {
    name: "CALENDAR",
    href: "/calendar",
    icon: Calendar
  }
]

export default function Navigation({ className }: { className?: string }) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className={cn("bg-black border-b-4 border-white", className)}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-black font-mono tracking-wider text-white uppercase">
            TASKMASTER PRO
          </Link>
          
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                              (pathname === "/" && item.href === "/dashboard")
              
              return (
                                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                    "px-4 py-2 text-sm font-mono font-bold uppercase tracking-wide transition-all duration-200",
                    "border-2 border-white bg-black text-white",
                    "hover:bg-white hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                    "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
                    "flex items-center gap-2",
                    isActive && "bg-white text-black"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
