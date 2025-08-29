import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import ProjectGrid from "@/components/ProjectGrid";
import KanbanBoard from "@/components/KanbanBoard";
import Calendar from "@/components/Calendar";
import BadgeGallery from "@/components/BadgeGallery";
import TaskModal from "@/components/TaskModal";
import { Task } from "@/types";

type ViewType = "dashboard" | "projects" | "kanban" | "calendar" | "profile";

interface UserStats {
  xp: number;
  maxXp: number;
  level: number;
  streak: number;
}

interface User {
  name: string;
  initials: string;
}

export default function TaskManagementApp() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [userStats] = useState<UserStats>({
    xp: 750,
    maxXp: 1000,
    level: 5,
    streak: 7
  });
  const [user] = useState<User>({
    name: "Alex Johnson",
    initials: "AJ"
  });
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Draft and finalize the Q1 project proposal for client review",
      status: "todo",
      priority: "high",
      dueDate: "2024-01-15",
      project: "Work",
      xpReward: 150
    },
    {
      id: "2",
      title: "Review team submissions",
      description: "Go through all team member submissions for the quarterly review",
      status: "inprogress",
      priority: "medium",
      dueDate: "2024-01-12",
      project: "Management",
      xpReward: 100
    },
    {
      id: "3",
      title: "Update documentation",
      description: "Update the API documentation with recent changes",
      status: "complete",
      priority: "low",
      dueDate: "2024-01-10",
      project: "Development",
      xpReward: 75
    }
  ]);
  


  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTaskSave = async (task: Task) => {
    try {
      const { api } = await import('@/lib/data');
      
      if (selectedTask && selectedTask.id) {
        // Update existing task
        const updatedTask = await api.tasks.update(task.id, task);
        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      } else {
        // Create new task
        const newTask = await api.tasks.create(task);
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
    
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const { api } = await import('@/lib/data');
      await api.tasks.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };



  const handleAddTask = () => {
    const newTask: Task = {
      id: "",
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0],
      project: "",
      xpReward: 100
    };
    setSelectedTask(newTask);
    setIsTaskModalOpen(true);
  };
  
  // Handle task status updates from Kanban board
  const handleTaskStatusUpdate = (taskId: string, newStatus: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus as Task['status'] }
          : task
      )
    );
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard userStats={userStats} tasks={tasks} onTaskClick={handleTaskClick} />;
      case "projects":
        return <ProjectGrid />;
      case "kanban":
        return <KanbanBoard tasks={tasks} onTaskClick={handleTaskClick} onAddTask={handleAddTask} onTaskUpdate={handleTaskStatusUpdate} />;
      case "calendar":
        return <Calendar tasks={tasks} onTaskClick={handleTaskClick} />;
      case "profile":
        return <BadgeGallery />;
      default:
        return <Dashboard userStats={userStats} tasks={tasks} onTaskClick={handleTaskClick} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        user={user}
        userStats={userStats}
      />
      <div className="flex-1 flex flex-col">
        <Header 
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
        />
        <main className="flex-1 bg-background">
          {renderMainContent()}
        </main>
      </div>
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleTaskSave}
        onDelete={selectedTask?.id ? handleTaskDelete : undefined}
      />
    </div>
  );
};