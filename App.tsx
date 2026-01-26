import React, { useState } from 'react';
import { TimeProvider, useTime } from './context/TimeContext';
import { Dashboard } from './views/Dashboard';
import { Timeline } from './views/Timeline';
import { Reports } from './views/Reports';
import { ViewState } from './types';
import { LayoutGrid, History, BarChart2 } from 'lucide-react';

const DynamicBackground = () => {
  const { activeSessionId, sessions, projects } = useTime();
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeProject = activeSession ? projects.find(p => p.id === activeSession.projectId) : null;
  const activeColor = activeProject?.color || '#3b82f6';

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-1000">
      {/* Base Dark Background */}
      <div className="absolute inset-0 bg-[#050508]"></div>

      {/* Active State: Intense Gradient Mesh */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSessionId ? 'opacity-40' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeColor}40 0%, transparent 60%)`,
          filter: 'blur(80px)',
          animation: 'pulse 4s infinite ease-in-out'
        }}
      ></div>

      {/* Passive State: Floating Blobs */}
      <div className="absolute inset-0">
         <div 
            className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob transition-colors duration-1000"
            style={{ backgroundColor: activeSessionId ? activeColor : '#4c1d95' }} // Purple base, or active color
         ></div>
         <div 
            className="absolute top-[20%] right-[-10%] w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000 transition-colors duration-1000"
            style={{ backgroundColor: activeSessionId ? activeColor : '#1e3a8a' }} // Blue base, or active color
         ></div>
         <div 
            className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000 transition-colors duration-1000"
            style={{ backgroundColor: activeSessionId ? activeColor : '#0ea5e9' }} // Cyan base, or active color
         ></div>
      </div>
      
      {/* Noise Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
}

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'timeline': return <Timeline />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full text-gray-100 overflow-hidden relative">
      <DynamicBackground />

      {/* Main Content Area */}
      <main className="flex-1 p-5 overflow-hidden flex flex-col relative z-10">
        {renderView()}
      </main>

      {/* Floating Glass Navigation Pill */}
      <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pb-safe">
        <nav className="glass-panel px-6 py-4 rounded-full flex items-center gap-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-xl">
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={<LayoutGrid size={22} />} 
          />
          <NavButton 
            active={currentView === 'timeline'} 
            onClick={() => setCurrentView('timeline')} 
            icon={<History size={22} />} 
          />
          <NavButton 
            active={currentView === 'reports'} 
            onClick={() => setCurrentView('reports')} 
            icon={<BarChart2 size={22} />} 
          />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`relative p-3 rounded-full transition-all duration-500 ease-out group ${active ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
  >
    <div className={`absolute inset-0 bg-white/10 rounded-full scale-0 transition-transform duration-300 ${active ? 'scale-100' : 'group-hover:scale-75 opacity-0 group-hover:opacity-100'}`}></div>
    <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}>
      {icon}
    </div>
    {active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"></div>}
  </button>
);

const App: React.FC = () => {
  return (
    <TimeProvider>
      <div className="h-screen w-screen bg-black">
        <AppContent />
      </div>
    </TimeProvider>
  );
};

export default App;