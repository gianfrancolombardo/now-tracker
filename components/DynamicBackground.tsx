import React from 'react';
import { useTime } from '../context/TimeContext';

export const DynamicBackground = () => {
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

            {/* Passive State: Floating Blobs - Hidden on mobile for performance */}
            <div className="absolute inset-0 hidden md:block">
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

            {/* Mobile-only static gradient for better performance */}
            <div
                className="absolute inset-0 md:hidden opacity-30 transition-colors duration-1000"
                style={{
                    background: `radial-gradient(circle at 80% 20%, ${activeSessionId ? activeColor : '#1e3a8a'} 0%, transparent 50%),
                                 radial-gradient(circle at 20% 80%, ${activeSessionId ? activeColor : '#4c1d95'} 0%, transparent 50%)`
                }}
            ></div>

            {/* Noise Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
}
