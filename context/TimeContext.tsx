import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Session, TimeContextType } from '../types';
import { generateId } from '../utils';

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};

// Initial default projects if none exist
const DEFAULT_PROJECTS: Project[] = [
  { id: 'p1', name: 'Work', emoji: '💼', color: '#3b82f6' },
  { id: 'p2', name: 'Study', emoji: '📚', color: '#8b5cf6' },
  { id: 'p3', name: 'Exercise', emoji: '🏋️', color: '#ef4444' },
];

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Sync with local storage
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Determine active session on mount
  useEffect(() => {
    const active = sessions.find(s => s.endTime === null);
    if (active) {
      setActiveSessionId(active.id);
    }
  }, [sessions]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: generateId(), isArchived: false };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (projectId: string) => {
    // 1. Stop active session if it belongs to this project
    const active = sessions.find(s => s.id === activeSessionId && s.projectId === projectId);
    if(active) {
       updateSession(active.id, { endTime: Date.now() });
       setActiveSessionId(null);
    }

    // 2. Soft Delete: Mark as archived instead of removing
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isArchived: true } : p));
  };

  const toggleProject = useCallback((projectId: string) => {
    setSessions(prevSessions => {
      const now = Date.now();
      const currentActive = prevSessions.find(s => s.endTime === null);

      let newSessions = [...prevSessions];

      // If there is an active session
      if (currentActive) {
        // Stop the current active session
        newSessions = newSessions.map(s => 
          s.id === currentActive.id ? { ...s, endTime: now } : s
        );

        // If we clicked the SAME project, we just stop (toggle off)
        if (currentActive.projectId === projectId) {
          setActiveSessionId(null);
          return newSessions;
        }
      }

      // Start new session
      const newSession: Session = {
        id: generateId(),
        projectId,
        startTime: now,
        endTime: null,
      };
      
      newSessions.push(newSession);
      setActiveSessionId(newSession.id);
      return newSessions;
    });
  }, []);

  const updateSession = (sessionId: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));
    // If we closed the active session manually via update
    if (updates.endTime !== undefined && updates.endTime !== null && sessionId === activeSessionId) {
      setActiveSessionId(null);
    }
  };

  const deleteSession = (sessionId: string) => {
    if (sessionId === activeSessionId) setActiveSessionId(null);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const getActiveDuration = useCallback(() => {
    if (!activeSessionId) return 0;
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session) return 0;
    return Date.now() - session.startTime;
  }, [activeSessionId, sessions]);

  return (
    <TimeContext.Provider value={{
      projects,
      sessions,
      activeSessionId,
      addProject,
      updateProject,
      toggleProject,
      updateSession,
      deleteSession,
      deleteProject,
      getActiveDuration
    }}>
      {children}
    </TimeContext.Provider>
  );
};