export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "complete";
  priority: "low" | "medium" | "high";
  dueDate: string;
  project: string;
  xpReward: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  taskCount: number;
  completedTasks: number;
  dueDate: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  xp: number;
  maxXp: number;
  level: number;
  streak: number;
}

