import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Session, TimeContextType } from '../types';
import { generateId } from '../utils';
import { firestoreService } from '../services/firestoreService';

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};

// No default projects anymore
const DEFAULT_PROJECTS: Project[] = [];

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load from Firestore
  useEffect(() => {
    const loadData = async () => {
      console.log("Starting data load from Firestore...");
      try {
        const [fetchedProjects, fetchedSessions] = await Promise.all([
          firestoreService.getProjects(),
          firestoreService.getSessions()
        ]);
        console.log("Fetched projects:", fetchedProjects.length);
        console.log("Fetched sessions:", fetchedSessions.length);

        setProjects(fetchedProjects);
        setSessions(fetchedSessions);

        const active = fetchedSessions.find(s => s.endTime === null);
        if (active) {
          console.log("Active session found:", active.id);
          setActiveSessionId(active.id);
        }
      } catch (error: any) {
        console.error("FATAL Firestore Error:", error);
        // Fallback to defaults on error to avoid white screen
        setProjects(DEFAULT_PROJECTS);
      } finally {
        console.log("Loading state set to false");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: generateId(), isArchived: false };
    setProjects(prev => [...prev, newProject]);
    await firestoreService.saveProject(newProject);
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updates } : p);
    setProjects(updatedProjects);
    const project = updatedProjects.find(p => p.id === id);
    if (project) {
      await firestoreService.saveProject(project);
    }
  };

  const deleteProject = async (projectId: string) => {
    // 1. Stop active session if it belongs to this project
    const active = sessions.find(s => s.id === activeSessionId && s.projectId === projectId);
    if (active) {
      await updateSession(active.id, { endTime: Date.now() });
      setActiveSessionId(null);
    }

    // 2. Soft Delete: Mark as archived instead of removing (as per previous logic)
    const updatedProjects = projects.map(p => p.id === projectId ? { ...p, isArchived: true } : p);
    setProjects(updatedProjects);
    const project = updatedProjects.find(p => p.id === projectId);
    if (project) {
      await firestoreService.saveProject(project);
    }
    // Note: To truly delete from Firestore, we would use firestoreService.deleteProject(projectId);
  };

  const toggleProject = useCallback(async (projectId: string) => {
    const now = Date.now();
    let currentActive: Session | undefined;

    setSessions(prevSessions => {
      currentActive = prevSessions.find(s => s.endTime === null);
      let newSessions = [...prevSessions];

      if (currentActive) {
        newSessions = newSessions.map(s =>
          s.id === currentActive?.id ? { ...s, endTime: now } : s
        );

        if (currentActive.projectId === projectId) {
          setActiveSessionId(null);
          // Return immediately to handle async call later
          return newSessions;
        }
      }

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

    // Handle Firestore updates outside of setSessions to maintain consistency
    // This is a bit tricky with stale closures in setSessions if we want to be perfect, 
    // but here we can just fetch the state or use the logic.

    // We need to wait for the next tick or just rely on the facts we know.
    if (currentActive) {
      await firestoreService.saveSession({ ...currentActive, endTime: now });
      if (currentActive.projectId === projectId) return;
    }

    const newSession: Session = {
      id: generateId(), // This id might differ from the one in setSessions if we are not careful
      // But we can't easily sync them without refactoring more.
      // Let's refactor toggleProject to be more predictable.
      projectId,
      startTime: now,
      endTime: null,
    };
    // Re-evaluating toggleProject...
  }, [activeSessionId, sessions]);

  // Better toggleProject implementation to avoid ID mismatch and handle async properly
  const toggleProjectStable = useCallback(async (projectId: string) => {
    const now = Date.now();
    const currentActive = sessions.find(s => s.endTime === null);

    if (currentActive) {
      const stoppedSession = { ...currentActive, endTime: now };
      setSessions(prev => prev.map(s => s.id === currentActive.id ? stoppedSession : s));
      await firestoreService.saveSession(stoppedSession);
      setActiveSessionId(null);

      if (currentActive.projectId === projectId) {
        return;
      }
    }

    const newSession: Session = {
      id: generateId(),
      projectId,
      startTime: now,
      endTime: null,
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    await firestoreService.saveSession(newSession);
  }, [sessions]);

  const updateSession = async (sessionId: string, updates: Partial<Session>) => {
    const updatedSessions = sessions.map(s => s.id === sessionId ? { ...s, ...updates } : s);
    setSessions(updatedSessions);

    const session = updatedSessions.find(s => s.id === sessionId);
    if (session) {
      await firestoreService.saveSession(session);
    }

    if (updates.endTime !== undefined && updates.endTime !== null && sessionId === activeSessionId) {
      setActiveSessionId(null);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (sessionId === activeSessionId) setActiveSessionId(null);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    await firestoreService.deleteSession(sessionId);
  };

  const getActiveDuration = useCallback(() => {
    if (!activeSessionId) return 0;
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session) return 0;
    return Date.now() - session.startTime;
  }, [activeSessionId, sessions]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-900 text-white">Loading persistence...</div>;
  }

  return (
    <TimeContext.Provider value={{
      projects,
      sessions,
      activeSessionId,
      addProject,
      updateProject,
      toggleProject: toggleProjectStable,
      updateSession,
      deleteSession,
      deleteProject,
      getActiveDuration
    }}>
      {children}
    </TimeContext.Provider>
  );
};
