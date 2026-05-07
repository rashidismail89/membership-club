import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

export const Countdown: React.FC = () => {
  const targetDate = new Date('2026-05-30T18:00:00Z');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now >= targetDate) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
        seconds: differenceInSeconds(targetDate, now) % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-6 mb-6">
      <div className="ticket-card px-5 py-4 flex items-center justify-between min-h-[110px]">
        {/* UCL Starball Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="grid grid-cols-4 gap-4 p-2">
            {[1,2,3,4,5,6,7,8].map(i => (
              <Trophy key={i} size={40} strokeWidth={1} />
            ))}
          </div>
        </div>

        {/* Left Section: Match Info */}
        <div className="flex-1 z-10">
          <div className="flex items-center space-x-1.5 mb-2">
            <div className="w-1 h-3 bg-arsenal-red rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-main opacity-80">UCL FINAL • 2026</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" alt="ARS" className="w-8 h-8 drop-shadow-sm" />
              <span className="text-lg font-black tracking-tighter">ARS</span>
            </div>
            <div className="text-[10px] font-bold text-text-muted px-2">VS</div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tighter opacity-70">PSG</span>
              <img src="https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" alt="PSG" className="w-8 h-8 opacity-70 grayscale-[0.5]" />
            </div>
          </div>

          <div className="flex items-center mt-3 space-x-4">
             <div className="flex items-center space-x-1">
                <Calendar size={11} className="text-text-muted" />
                <span className="text-[9px] font-bold text-text-muted uppercase">30 May</span>
             </div>
             <div className="flex items-center space-x-1">
                <MapPin size={11} className="text-text-muted" />
                <span className="text-[9px] font-bold text-text-muted uppercase">Puskás Aréna</span>
             </div>
          </div>
        </div>

        {/* Perforation Line */}
        <div className="h-16 border-l border-dashed border-card-border mx-4" />

        {/* Right Section: Countdown */}
        <div className="w-20 flex flex-col items-center justify-center z-10">
          <div className="text-center">
            <div className="text-2xl font-black tabular-nums tracking-tighter text-arsenal-red">{timeLeft.days}</div>
            <div className="text-[8px] font-bold text-text-muted uppercase tracking-[0.1em] mt-1">Days to Go</div>
          </div>
          <div className="mt-3 flex space-x-0.5">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-0.5 w-2 rounded-full ${i <= 3 ? 'bg-arsenal-red' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
