import React, { useState } from 'react';
import { TimeProvider, useTime } from './context/TimeContext';
import { Dashboard } from './views/Dashboard';
import { Timeline } from './views/Timeline';
import { Reports } from './views/Reports';
import { ViewState } from './types';
import { LayoutGrid, History, BarChart2, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './views/Login';
import { DynamicBackground } from './components/DynamicBackground';



const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

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

      {/* Subtle Logout Button */}
      {user && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={logout}
            className="text-white/20 hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/5"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}

      {/* Floating Glass Navigation Pill */}
      <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pb-safe">
        <nav className="glass-panel px-6 py-4 rounded-full flex items-center gap-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 md:backdrop-blur-xl backdrop-blur-none">
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
    <AuthProvider>
      <TimeProvider>
        <div className="h-screen w-screen bg-black">
          <AppContent />
        </div>
      </TimeProvider>
    </AuthProvider>
  );
};

export default App;