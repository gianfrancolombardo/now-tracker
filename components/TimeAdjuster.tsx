import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TimeAdjusterProps {
  label: string;
  timestamp: number;
  onChange: (newTimestamp: number) => void;
  max?: number;
  min?: number;
}

export const TimeAdjuster: React.FC<TimeAdjusterProps> = ({ label, timestamp, onChange, max, min }) => {
  const date = new Date(timestamp);
  
  const adjust = (unit: 'hours' | 'minutes', amount: number) => {
    const newDate = new Date(date);
    if (unit === 'hours') {
      newDate.setHours(newDate.getHours() + amount);
    } else {
      newDate.setMinutes(newDate.getMinutes() + amount);
    }
    
    // Constraint check
    const newTs = newDate.getTime();
    if (max && newTs > max) return;
    if (min && newTs < min) return;
    
    onChange(newTs);
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center p-4 bg-gray-950 rounded-2xl border border-gray-800">
      <span className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{label}</span>
      
      <div className="flex items-center gap-4">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <button onClick={() => adjust('hours', 1)} className="p-2 text-gray-500 hover:text-brand-400 active:scale-90 transition-transform">
            <ChevronUp size={24} />
          </button>
          <span className="text-4xl font-mono font-bold text-gray-100 w-16 text-center">
            {pad(date.getHours())}
          </span>
          <button onClick={() => adjust('hours', -1)} className="p-2 text-gray-500 hover:text-brand-400 active:scale-90 transition-transform">
            <ChevronDown size={24} />
          </button>
        </div>

        <span className="text-4xl font-bold text-gray-700 pb-2">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <button onClick={() => adjust('minutes', 1)} className="p-2 text-gray-500 hover:text-brand-400 active:scale-90 transition-transform">
            <ChevronUp size={24} />
          </button>
          <span className="text-4xl font-mono font-bold text-gray-100 w-16 text-center">
            {pad(date.getMinutes())}
          </span>
          <button onClick={() => adjust('minutes', -1)} className="p-2 text-gray-500 hover:text-brand-400 active:scale-90 transition-transform">
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};