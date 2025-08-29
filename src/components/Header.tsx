import { User, Settings, Trophy, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  className?: string
  userStats?: {
    xp: number
    maxXp: number
    level: number
    streak: number
  }
  user?: {
    name: string
    avatar?: string
    initials: string
  }
  onThemeToggle?: () => void
  onSettingsClick?: () => void
  onProfileClick?: () => void
  isDarkMode?: boolean
}

export default function Header({ 
  className = "",
  userStats = { xp: 750, maxXp: 1000, level: 12, streak: 7 },
  user = { name: "User", initials: "U" },
  onThemeToggle,
  onSettingsClick,
  onProfileClick
}: HeaderProps) {
  const xpPercentage = (userStats.xp / userStats.maxXp) * 100

  return (
    <header className={`w-full border-b border-border bg-header-background ${className}`}>
      <div className="flex h-16 items-center justify-between px-6">
        {/* App Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-header-text">TaskFlow</h1>
        </div>

        {/* Center Stats */}
        <div className="flex items-center gap-6">
          {/* XP Progress Bar */}
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="relative h-2 w-32 bg-muted">
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {userStats.xp}/{userStats.maxXp}
                </span>
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center bg-foreground text-background font-semibold text-sm">
              {userStats.level}
            </div>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            <div className="flex h-8 items-center justify-center bg-muted px-3 text-sm font-medium">
              {userStats.streak}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* User Avatar & Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-10 w-10 p-0 hover:bg-muted transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onThemeToggle}>
                <Settings className="mr-2 h-4 w-4" />
                Toggle Theme
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}