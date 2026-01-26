import React, { useState, useMemo } from 'react';
import { useTime } from '../context/TimeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getStartOfDay, getStartOfMonth, getStartOfWeek, formatDurationHuman } from '../utils';
import { BarChart2 } from 'lucide-react';

type FilterType = 'day' | 'week' | 'month';

export const Reports: React.FC = () => {
  const { sessions, projects } = useTime();
  const [filter, setFilter] = useState<FilterType>('day');

  // Calculate Data
  const stats = useMemo(() => {
    const now = new Date();
    let startTimeLimit = 0;

    if (filter === 'day') startTimeLimit = getStartOfDay(now);
    else if (filter === 'week') startTimeLimit = getStartOfWeek(now);
    else if (filter === 'month') startTimeLimit = getStartOfMonth(now);

    const relevantSessions = sessions.filter(s => 
      s.endTime !== null && s.startTime >= startTimeLimit
    );

    const totalDuration = relevantSessions.reduce((acc, s) => acc + ((s.endTime || 0) - s.startTime), 0);
    
    // Group by project
    const projectStatsMap: Record<string, number> = {};
    relevantSessions.forEach(s => {
      const duration = (s.endTime || 0) - s.startTime;
      projectStatsMap[s.projectId] = (projectStatsMap[s.projectId] || 0) + duration;
    });

    const projectStats = Object.entries(projectStatsMap)
      .map(([id, duration]) => {
        const proj = projects.find(p => p.id === id);
        return {
          id,
          name: proj?.name || 'Unknown',
          color: proj?.color || '#ccc',
          emoji: proj?.emoji || '❓',
          value: duration,
          percentage: totalDuration > 0 ? Math.round((duration / totalDuration) * 100) : 0
        };
      })
      .sort((a, b) => b.value - a.value);

    return { totalDuration, projectStats };
  }, [sessions, projects, filter]);

  return (
    <div className="h-full flex flex-col pb-24 pt-4">
       <div className="mb-6 flex flex-col items-center">
        {/* Filter Tabs */}
        <div className="flex bg-gray-900/80 p-1 rounded-2xl w-full max-w-sm border border-white/5 backdrop-blur-sm">
          {(['day', 'week', 'month'] as FilterType[]).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all duration-300 ${
                filter === t 
                  ? 'bg-gray-700 text-white shadow-lg border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'day' ? 'Today' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar animate-fade-in">
        {/* Insight Card */}
        <div className="glass-panel rounded-3xl p-8 text-white shadow-2xl mb-6 text-center relative overflow-hidden group">
             {/* Subtle animated gradient background */}
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-purple-600/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
                <h2 className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Total Focus Time</h2>
                <div className="text-5xl font-black tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {formatDurationHuman(stats.totalDuration)}
                </div>
            </div>
        </div>

        {stats.totalDuration > 0 ? (
            <>
                {/* Chart */}
                <div className="h-64 w-full relative mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={stats.projectStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {stats.projectStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 10px ${entry.color}50)` }} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => formatDurationHuman(value)}
                        contentStyle={{ 
                            borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)' 
                        }}
                        itemStyle={{ color: '#e5e7eb' }}
                    />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                    <span className="text-3xl font-bold text-white">{stats.projectStats.length}</span>
                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Projects</span>
                </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-500 ml-2 text-[10px] uppercase tracking-widest mb-3">Activity Breakdown</h3>
                    {stats.projectStats.map((stat, idx) => (
                        <div key={stat.id} className="glass-panel p-4 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-inner"
                                    style={{ backgroundColor: `${stat.color}15`, color: stat.color, border: `1px solid ${stat.color}30` }}
                                >
                                    {stat.emoji}
                                </div>
                                <div className="flex flex-col flex-1 min-w-[100px]">
                                    <span className="font-bold text-gray-200 text-sm">{stat.name}</span>
                                    <div className="w-24 h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${stat.percentage}%`, backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-white text-sm">{formatDurationHuman(stat.value)}</div>
                                <div className="text-[10px] text-gray-500 font-bold font-mono">{stat.percentage}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <div className="text-center text-gray-600 mt-12 flex flex-col items-center">
                <BarChart2 size={40} className="mb-4 opacity-20" />
                <p className="text-xs uppercase tracking-widest">No activity</p>
            </div>
        )}
      </div>
    </div>
  );
};