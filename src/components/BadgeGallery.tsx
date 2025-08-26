"use client"

import React, { useState } from 'react'
import { 
  Trophy, 
  Target, 
  Zap, 
  Calendar, 
  CheckCircle, 
  Star, 
  Award, 
  Crown, 
  Flame, 
  TrendingUp,
  Shield,
  Gem,
  Lock,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  earned: boolean
  progress?: number
  maxProgress?: number
  special?: boolean
}

interface BadgeGalleryProps {
  className?: string
}

const badges: Badge[] = [
  // Streak Milestones
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Complete tasks for 7 consecutive days',
    icon: Flame,
    category: 'Streaks',
    earned: true
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Complete tasks for 30 consecutive days',
    icon: Calendar,
    category: 'Streaks',
    earned: true
  },
  {
    id: 'streak-100',
    name: 'Century Champion',
    description: 'Complete tasks for 100 consecutive days',
    icon: Crown,
    category: 'Streaks',
    earned: false,
    progress: 45,
    maxProgress: 100
  },
  
  // Task Completion
  {
    id: 'tasks-10',
    name: 'Getting Started',
    description: 'Complete your first 10 tasks',
    icon: CheckCircle,
    category: 'Completion',
    earned: true
  },
  {
    id: 'tasks-100',
    name: 'Centurion',
    description: 'Complete 100 tasks',
    icon: Target,
    category: 'Completion',
    earned: true
  },
  {
    id: 'tasks-500',
    name: 'Task Master',
    description: 'Complete 500 tasks',
    icon: Trophy,
    category: 'Completion',
    earned: false,
    progress: 287,
    maxProgress: 500
  },
  
  // Level Achievements
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: Star,
    category: 'Levels',
    earned: true
  },
  {
    id: 'level-10',
    name: 'Expert',
    description: 'Reach level 10',
    icon: Award,
    category: 'Levels',
    earned: false,
    progress: 8,
    maxProgress: 10
  },
  {
    id: 'level-25',
    name: 'Legendary',
    description: 'Reach level 25',
    icon: Gem,
    category: 'Levels',
    earned: false,
    special: true
  },
  
  // Special Achievements
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Complete all planned tasks in a week',
    icon: Shield,
    category: 'Special',
    earned: true,
    special: true
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 50 tasks before 9 AM',
    icon: Zap,
    category: 'Special',
    earned: false,
    progress: 23,
    maxProgress: 50
  },
  {
    id: 'productivity-beast',
    name: 'Productivity Beast',
    description: 'Complete 20 tasks in a single day',
    icon: TrendingUp,
    category: 'Special',
    earned: false,
    special: true
  }
]

export default function BadgeGallery({ className }: BadgeGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'earned' | 'unearned'>('all')
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  const filteredBadges = badges.filter(badge => {
    if (filter === 'earned') return badge.earned
    if (filter === 'unearned') return !badge.earned
    return true
  })

  const categories = Array.from(new Set(filteredBadges.map(badge => badge.category)))

  return (
    <div className={className}>
      {/* Filter Controls */}
      <div className="flex items-center gap-2 mb-8">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
          className="h-8"
        >
          All
        </Button>
        <Button
          variant={filter === 'earned' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('earned')}
          className="h-8"
        >
          Earned
        </Button>
        <Button
          variant={filter === 'unearned' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('unearned')}
          className="h-8"
        >
          Locked
        </Button>
      </div>

      {/* Badge Categories */}
      {categories.map(category => {
        const categoryBadges = filteredBadges.filter(badge => badge.category === category)
        
        return (
          <div key={category} className="mb-12">
            {/* Category Header */}
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6 border-b border-border pb-2">
              {category}
            </h3>
            
            {/* Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categoryBadges.map(badge => {
                const IconComponent = badge.icon
                const isHovered = hoveredBadge === badge.id
                
                return (
                  <div
                    key={badge.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredBadge(badge.id)}
                    onMouseLeave={() => setHoveredBadge(null)}
                  >
                    {/* Badge Card */}
                    <div className={`
                      aspect-square border-2 bg-card p-4 transition-all duration-200 cursor-pointer
                      ${badge.earned 
                        ? 'border-border hover:border-primary' 
                        : 'border-border/50 grayscale opacity-60 hover:opacity-80'
                      }
                      ${badge.special && badge.earned ? 'border-primary' : ''}
                      ${isHovered ? 'scale-105 shadow-lg' : ''}
                    `}>
                      {/* Icon */}
                      <div className="flex items-center justify-center h-16 mb-3">
                        {badge.earned ? (
                          <IconComponent className={`w-8 h-8 ${badge.special ? 'text-primary' : 'text-foreground'}`} />
                        ) : (
                          <div className="relative">
                            <IconComponent className="w-8 h-8 text-muted-foreground" />
                            <Lock className="w-4 h-4 absolute -bottom-1 -right-1 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Badge Name */}
                      <h4 className={`text-xs font-semibold text-center leading-tight ${
                        badge.earned ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {badge.name}
                      </h4>
                      
                      {/* Progress Bar */}
                      {badge.progress !== undefined && badge.maxProgress && !badge.earned && (
                        <div className="mt-2">
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground text-center mt-1">
                            {badge.progress}/{badge.maxProgress}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                        <div className="bg-popover border border-border px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
                          <div className="text-sm font-medium text-popover-foreground">
                            {badge.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {badge.description}
                          </div>
                          {badge.progress !== undefined && badge.maxProgress && !badge.earned && (
                            <div className="text-xs text-primary mt-1">
                              Progress: {badge.progress}/{badge.maxProgress}
                            </div>
                          )}
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No badges found for the selected filter.
          </div>
        </div>
      )}
    </div>
  )
}