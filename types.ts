export interface Project {
  id: string;
  name: string;
  emoji: string;
  color: string; // Tailwind bg class or hex
  isArchived?: boolean; // Soft delete flag
}

export interface Session {
  id: string;
  projectId: string;
  startTime: number; // Timestamp
  endTime: number | null; // Null implies currently active
}

export type ViewState = 'dashboard' | 'timeline' | 'reports';

export interface TimeContextType {
  projects: Project[];
  sessions: Session[];
  activeSessionId: string | null;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  toggleProject: (projectId: string) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  deleteSession: (sessionId: string) => void;
  deleteProject: (projectId: string) => void;
  getActiveDuration: () => number;
}