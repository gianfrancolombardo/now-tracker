import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Zap } from 'lucide-react';
import { useTime } from '../context/TimeContext';
import { ProjectModal } from '../components/ProjectModal';
import { formatDuration } from '../utils';
import { Project } from '../types';

export const Dashboard: React.FC = () => {
  const { projects, toggleProject, activeSessionId, sessions, getActiveDuration } = useTime();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Update elapsed time
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeSessionId) {
      setElapsed(getActiveDuration());
      interval = setInterval(() => {
        setElapsed(getActiveDuration());
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeSessionId, getActiveDuration]);

  // Find active project
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeProject = projects.find(p => p.id === activeSession?.projectId);

  // Calculate durations for sorting
  const projectDurations = React.useMemo(() => {
    const durations: Record<string, number> = {};
    sessions.forEach(session => {
      const duration = (session.endTime || Date.now()) - session.startTime;
      durations[session.projectId] = (durations[session.projectId] || 0) + duration;
    });
    return durations;
  }, [sessions]);

  // Only show active (non-archived) projects, sorted by usage
  const visibleProjects = projects
    .filter(p => !p.isArchived)
    .sort((a, b) => {
      const durationA = projectDurations[a.id] || 0;
      const durationB = projectDurations[b.id] || 0;
      return durationB - durationA;
    });

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Grid Area */}
      {/* Grid Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-64 pt-6 px-5 animate-fade-in">
        {visibleProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full scale-150 hidden md:block"></div>
              <div className="relative glass-panel-active p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                <Zap size={64} className="text-brand-400 fill-brand-400/20 animate-pulse-slow" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Ready to focus?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xs leading-relaxed">
              Create your first project to start tracking your flow and productivity.
            </p>

            <button
              onClick={handleAddNew}
              className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
            >
              <Plus size={18} />
              Start Your Journey
              <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 content-start transition-all duration-500 ${visibleProjects.length > 5 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {visibleProjects.map((project, index) => {
              const isActive = project.id === activeProject?.id;

              return (
                <button
                  key={project.id}
                  onClick={() => toggleProject(project.id)}
                  className={`
                    group relative flex flex-col items-center justify-between p-5 h-44 rounded-[2.5rem] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) overflow-visible
                    ${isActive ? 'glass-panel-active transform scale-105 z-20' : 'glass-panel hover:bg-white/5 active:scale-95'}
                  `}
                  style={{
                    borderColor: isActive ? project.color : undefined,
                    boxShadow: isActive ? `0 10px 30px -5px ${project.color}60, inset 0 0 15px ${project.color}30` : undefined,
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both'
                  }}
                >
                  {/* Glowing background for active state - tighter and more contained */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-[2.5rem] blur-lg opacity-40 -z-10 bg-gradient-to-br from-transparent to-white/5"
                      style={{ backgroundColor: `${project.color}30` }}
                    ></div>
                  )}

                  {/* Header / Live Indicator - Adjusted position */}
                  <div className="w-full flex justify-between items-start h-6 relative z-20">
                    <div className="w-6"></div>
                    {isActive ? (
                      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-sm -mr-1 -mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></div>
                        <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Live</span>
                      </div>
                    ) : (
                      <div
                        onClick={(e) => handleEditClick(e, project)}
                        className="p-2 -mr-3 -mt-3 text-gray-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
                      >
                        <Pencil size={14} />
                      </div>
                    )}
                  </div>

                  {/* Icon - Overflow visible ensures no clipping */}
                  <div className={`text-6xl transition-all duration-700 pointer-events-none ${isActive ? 'scale-115 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'group-hover:scale-110 opacity-50 group-hover:opacity-100'}`}>
                    {project.emoji}
                  </div>

                  {/* Label */}
                  <div className="w-full text-center relative z-20 mt-2">
                    <span className={`text-[11px] font-black tracking-[0.25em] uppercase transition-all duration-500 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {project.name}
                    </span>
                  </div>
                </button>
              );
            })}

            <button
              onClick={handleAddNew}
              className="flex flex-col items-center justify-center h-44 rounded-[2.5rem] border border-dashed border-white/10 text-gray-400 hover:text-brand-400 hover:border-brand-500/40 hover:bg-brand-500/5 transition-all duration-500 active:scale-95 group glass-panel overflow-hidden"
            >
              <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors mb-2 shadow-inner border border-white/5">
                <Plus size={24} />
              </div>
              <span className="font-bold text-[9px] uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">Add Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Timer - Adjusted padding to match container */}
      <div className={`absolute bottom-28 left-0 right-0 z-30 px-5 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${activeProject ? 'translate-y-0 opacity-100 blur-none' : 'translate-y-20 opacity-0 blur-sm pointer-events-none'}`}>
        {activeProject && (
          <div className="relative group">
            {/* Pulsing Outer Glow */}
            <div
              className="absolute inset-0 blur-[40px] opacity-20 transition-all duration-1000"
              style={{ backgroundColor: activeProject.color }}
            ></div>

            {/* Main Glass Panel */}
            <div className="glass-panel-active rounded-[3.5rem] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden md:backdrop-blur-3xl backdrop-blur-none border border-white/20">

              <div className="relative z-10 flex flex-col items-center">
                {/* Project Label */}
                <div
                  className="flex items-center gap-2 mb-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md shadow-inner transition-colors duration-500"
                  style={{ borderColor: `${activeProject.color}40` }}
                >
                  <span className="text-lg">{activeProject.emoji}</span>
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{activeProject.name}</span>
                </div>

                {/* Digital Time */}
                <div
                  className={`font-mono font-medium tracking-tighter text-white tabular-nums leading-[0.8] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] my-4 transition-all duration-500 ${formatDuration(elapsed).length > 5 ? 'text-[4rem]' : 'text-[6rem]'}`}
                >
                  {formatDuration(elapsed)}
                </div>

                {/* Status Indicator */}
                <div className="mt-2 text-[10px] font-black text-white/60 flex items-center gap-2 uppercase tracking-[0.4em]">
                  <Zap size={10} className="fill-white/60 animate-pulse" /> Focus Mode
                </div>
              </div>

              {/* Stop Interaction */}
              <button
                onClick={() => toggleProject(activeProject.id)}
                className="absolute inset-0 w-full h-full cursor-pointer z-20 active:bg-white/10 transition-colors flex items-end justify-center pb-4 group"
                aria-label="Stop Timer"
              >
                <div className="text-[10px] font-black text-white/0 group-hover:text-white/40 transition-all uppercase tracking-widest mb-1 translate-y-2 group-hover:translate-y-0">
                  Tap to end session
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={projectToEdit}
      />
    </div>
  );
};