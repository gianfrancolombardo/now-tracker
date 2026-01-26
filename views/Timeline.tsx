import React, { useState } from 'react';
import { useTime } from '../context/TimeContext';
import { formatTime, formatDate, formatDuration, formatDurationHuman } from '../utils';
import { Modal } from '../components/Modal';
import { TimeAdjuster } from '../components/TimeAdjuster';
import { Trash2, History, Timer } from 'lucide-react';
import { Session } from '../types';

export const Timeline: React.FC = () => {
  const { sessions, projects, updateSession, deleteSession } = useTime();
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const history = sessions
    .filter(s => s.endTime !== null)
    .sort((a, b) => b.startTime - a.startTime);

  const handleEditSave = () => {
    if (editingSession && editingSession.endTime) {
      if (editingSession.startTime > editingSession.endTime) {
        alert("End time cannot be before start time");
        return;
      }
      updateSession(editingSession.id, {
        startTime: editingSession.startTime,
        endTime: editingSession.endTime
      });
      setEditingSession(null);
    }
  };

  const handleDelete = () => {
    if (editingSession) {
        if(confirm('Delete this session permanently?')) {
            deleteSession(editingSession.id);
            setEditingSession(null);
        }
    }
  };

  return (
    <div className="h-full flex flex-col pb-24 pt-4">
       <div className="flex items-center gap-3 mb-6 px-2">
         <div className="p-2 bg-gray-800/50 rounded-xl border border-white/5">
            <History className="text-gray-300" size={20} />
         </div>
         <h1 className="text-xl font-bold text-white tracking-wide uppercase">History</h1>
       </div>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-600 animate-fade-in glass-panel rounded-3xl mx-2">
          <Timer size={32} className="mb-4 opacity-30" />
          <p className="text-sm font-medium">No sessions recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto no-scrollbar pr-1 animate-fade-in">
          {history.map((session, index) => {
            const project = projects.find(p => p.id === session.projectId);
            if (!project) return null;

            return (
              <div 
                key={session.id}
                onClick={() => setEditingSession(session)}
                className="group glass-panel p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/5 active:scale-[0.98] transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg border border-white/5"
                    style={{ backgroundColor: `${project.color}20`, color: project.color }}
                  >
                    {project.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{project.name}</h3>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                      {formatDate(session.startTime)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-white font-mono tracking-tight">
                     {formatDurationHuman((session.endTime || 0) - session.startTime)}
                  </div>
                  <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                    {formatTime(session.startTime)} - {formatTime(session.endTime!)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingSession && (
        <Modal 
          isOpen={!!editingSession} 
          onClose={() => setEditingSession(null)}
          title="Edit Session"
        >
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <TimeAdjuster 
                label="Start Time"
                timestamp={editingSession.startTime}
                onChange={(ts) => setEditingSession({ ...editingSession, startTime: ts })}
                max={editingSession.endTime!}
              />
              <TimeAdjuster 
                label="End Time"
                timestamp={editingSession.endTime!}
                onChange={(ts) => setEditingSession({ ...editingSession, endTime: ts })}
                min={editingSession.startTime}
              />
            </div>

            <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-2xl flex justify-between items-center shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                <span className="text-brand-400 font-medium text-xs uppercase tracking-wide">Duration</span>
                <span className="text-2xl font-bold text-brand-300 font-mono">
                    {formatDuration((editingSession.endTime || 0) - editingSession.startTime)}
                </span>
            </div>

            <div className="flex gap-3">
               <button 
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-900/10 text-red-400 border border-red-500/20 rounded-2xl font-bold hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button 
                onClick={handleEditSave}
                className="flex-[2] py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all active:scale-95 border-t border-white/20"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};