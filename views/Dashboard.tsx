import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Zap, Play } from 'lucide-react';
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

  // Only show active (non-archived) projects
  const visibleProjects = projects.filter(p => !p.isArchived);

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
      <div className="grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar pb-64 pt-4 animate-fade-in content-start">
        {visibleProjects.map(project => {
          const isActive = project.id === activeProject?.id;
          
          return (
            <button
              key={project.id}
              onClick={() => toggleProject(project.id)}
              className={`
                group relative flex flex-col items-center justify-between p-5 h-44 rounded-[2rem] transition-all duration-500
                glass-panel
                ${isActive 
                  ? 'border-t border-l border-white/20 shadow-2xl z-10' 
                  : 'hover:bg-gray-800/30 hover:border-white/10 active:scale-95'
                }
              `}
              style={{
                background: isActive ? `linear-gradient(145deg, ${project.color}15, rgba(0,0,0,0))` : undefined,
                borderColor: isActive ? `${project.color}50` : undefined,
                boxShadow: isActive ? `0 0 30px -10px ${project.color}30, inset 0 0 20px ${project.color}10` : undefined
              }}
            >
              {/* Header / Edit Action */}
              <div className="w-full flex justify-between items-start h-6">
                 {/* Empty left side for balance or future indicator */}
                 <div className="w-6"></div>
                 
                 {/* Right Side: Active Dot or Edit Button */}
                 {isActive ? (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_white] mt-1"></div>
                 ) : (
                    <div 
                      onClick={(e) => handleEditClick(e, project)}
                      className="p-2 -mr-2 -mt-2 text-gray-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
                    >
                      <Pencil size={14} />
                    </div>
                 )}
              </div>

              {/* Icon */}
              <div className={`text-5xl transition-transform duration-500 drop-shadow-2xl ${isActive ? 'scale-110 animate-bounce-small' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`}>
                {project.emoji}
              </div>
              
              {/* Label */}
              <div className="w-full text-center">
                 <span className={`text-base font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {project.name}
                 </span>
              </div>
            </button>
          );
        })}

        <button
          onClick={handleAddNew}
          className="flex flex-col items-center justify-center h-44 rounded-[2rem] border border-dashed border-gray-800 text-gray-600 hover:text-brand-400 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-300 active:scale-95 group"
        >
          <div className="p-4 rounded-full bg-gray-900 group-hover:bg-gray-800 transition-colors mb-2 shadow-inner">
            <Plus size={24} />
          </div>
          <span className="font-medium text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100">Add Project</span>
        </button>
      </div>

      {/* Active Timer - HUD Style */}
      <div className={`absolute bottom-24 left-0 right-0 z-30 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${activeProject ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        {activeProject && (
          <div className="mx-4 relative group">
             {/* Main Glass Panel */}
             <div className="glass-panel rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                 
                 {/* Background Glow */}
                 <div 
                    className="absolute inset-0 opacity-20 transition-opacity duration-1000 animate-pulse-slow" 
                    style={{ background: `radial-gradient(circle at 50% 120%, ${activeProject.color}, transparent 60%)` }}
                 />

                 <div className="relative z-10 flex flex-col items-center">
                    {/* Project Label */}
                    <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-black/20 border border-white/5">
                        <span className="text-sm">{activeProject.emoji}</span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">{activeProject.name}</span>
                    </div>

                    {/* Digital Time */}
                    <div 
                      className="text-7xl font-mono font-medium tracking-tighter text-white tabular-nums leading-[0.9] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                      {formatDuration(elapsed)}
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="mt-3 text-[10px] font-bold text-brand-400 flex items-center gap-2 uppercase tracking-widest opacity-80">
                         <Zap size={10} className="fill-brand-400" /> Current Session
                    </div>
                 </div>

                 {/* Stop Interaction */}
                 <button 
                    onClick={() => toggleProject(activeProject.id)}
                    className="absolute inset-0 w-full h-full cursor-pointer z-20 active:bg-white/5 transition-colors"
                    aria-label="Stop Timer"
                 />
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