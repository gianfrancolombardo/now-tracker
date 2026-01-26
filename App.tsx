import React, { useState } from 'react';
import { TimeProvider } from './context/TimeContext';
import { Dashboard } from './views/Dashboard';
import { Timeline } from './views/Timeline';
import { Reports } from './views/Reports';
import { ViewState } from './types';
import { LayoutGrid, History, BarChart2 } from 'lucide-react';

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
      {/* Ambient Background Layers */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-brand-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-5 overflow-hidden flex flex-col relative z-10">
        {renderView()}
      </main>

      {/* Floating Glass Navigation Pill */}
      <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pb-safe">
        <nav className="glass-panel px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl shadow-black/50">
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
    className={`relative p-3 rounded-full transition-all duration-500 ease-out group ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
  >
    <div className={`absolute inset-0 bg-white/10 rounded-full scale-0 transition-transform duration-300 ${active ? 'scale-100' : 'group-hover:scale-50 opacity-0 group-hover:opacity-100'}`}></div>
    <div className="relative z-10">
      {icon}
    </div>
    {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-400 rounded-full shadow-[0_0_8px_#38bdf8]"></div>}
  </button>
);

const App: React.FC = () => {
  return (
    <TimeProvider>
      <div className="h-screen w-screen bg-gray-950">
        <AppContent />
      </div>
    </TimeProvider>
  );
};

export default App;