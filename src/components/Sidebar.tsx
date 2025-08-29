import { 
  LayoutDashboard, 
  FolderOpen, 
  Kanban, 
  Calendar, 
  User, 
  LogOut 
} from "lucide-react"

import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
  activeView: string
  onViewChange: (view: "dashboard" | "projects" | "kanban" | "calendar" | "profile") => void
  user?: any
  userStats?: any
}

type ViewType = "dashboard" | "projects" | "kanban" | "calendar" | "profile";

const navigationItems: { name: ViewType; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    name: "dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "projects",
    icon: FolderOpen,
  },
  {
    name: "kanban",
    icon: Kanban,
  },
  {
    name: "calendar",
    icon: Calendar,
  },
  {
    name: "profile",
    icon: User,
  },
]

export default function Sidebar({ className, activeView, onViewChange }: SidebarProps) {
  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-sidebar border-r border-black dark:border-sidebar-border",
      className
    )}>
      {/* Navigation Items */}
      <nav className="flex-1 py-6">
        <ul className="space-y-0">
          {navigationItems.map((item) => {
            const isActive = activeView === item.name.toLowerCase()
            const Icon = item.icon
            
            return (
              <li key={item.name}>
                <button
                  onClick={() => onViewChange(item.name)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors duration-150 border-b border-black dark:border-sidebar-border group w-full text-left",
                    isActive 
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-white text-black hover:bg-black hover:text-white dark:bg-sidebar dark:text-sidebar-foreground dark:hover:bg-white dark:hover:text-black"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-black dark:border-sidebar-border">
        <div className="p-6 border-b border-black dark:border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-none flex items-center justify-center">
              <User className="h-4 w-4 text-white dark:text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black dark:text-sidebar-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-black/60 dark:text-sidebar-foreground/60 truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-black dark:text-sidebar-foreground hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-150">
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}