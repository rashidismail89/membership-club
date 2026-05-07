import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sponsor } from '../types';
import { Plane } from 'lucide-react';

interface AdRotatorProps {
  sponsors: Sponsor[];
}

export const AdRotator: React.FC<AdRotatorProps> = ({ sponsors }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (sponsors.length === 0) return;
    
    // Preload images for seamless transitions
    sponsors.forEach(sponsor => {
      const img = new Image();
      img.src = sponsor.bannerImageURL;
    });

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sponsors.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sponsors]);

  if (sponsors.length === 0) return null;

  const currentSponsor = sponsors[index];

  return (
    <div className="w-full aspect-[16/9] relative overflow-hidden bg-card-bg rounded-2xl border border-card-border shadow-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSponsor?.id || 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full relative"
        >
          {/* Background Image with Fallback */}
          <img 
            src={currentSponsor?.bannerImageURL} 
            alt={currentSponsor?.name} 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallbacks: Record<string, string> = {
                'Pepsi': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=1000',
                'Emirates': 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&q=80&w=1000',
                'Airtel': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000'
              };
              target.src = fallbacks[currentSponsor?.name || ''] || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1000';
            }}
          />
          {/* Premium Gradient Overlay - Adjusted for visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent z-10" />
          
          <div className="relative h-full p-7 flex flex-col justify-between z-20">
            <div className="flex justify-between items-start">
               <div className="flex flex-col space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-arsenal-red">Official Partner</span>
                  <h3 className="text-2xl font-black tracking-tighter text-text-main leading-none">{currentSponsor?.name.toUpperCase()}</h3>
                  <h4 className="text-[13px] font-bold tracking-tight text-text-main opacity-90">{currentSponsor?.tagline}</h4>
               </div>
               <div className="w-9 h-9 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 flex items-center justify-center text-text-main shadow-sm">
                  <Plane size={16} strokeWidth={2.5} />
               </div>
            </div>

            <div className="flex flex-col space-y-4">
               <p className="text-[10px] text-[#888888] font-bold leading-tight max-w-[180px]">
                 Unlock exclusive Pepsi perks for the final.
               </p>
               
               <div className="flex items-end justify-between">
                   <div className="flex flex-col space-y-2">
                       <div className="px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-arsenal-red transition-all cursor-pointer shadow-xl shadow-black/10 text-center">
                           Explore
                       </div>
                       {/* Red progress indicator line */}
                       <div className="w-12 h-[3px] bg-arsenal-red rounded-full" />
                   </div>
                   <span className="text-[8px] font-bold text-[#888888] opacity-50 uppercase tracking-[0.3em] mb-1">Sponsored</span>
               </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-4 left-6 flex space-x-1.5 z-30">
        {sponsors.map((_, i) => (
            <div 
                key={i} 
                className={`h-0.5 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-arsenal-red' : 'w-1 bg-card-border'}`}
            />
        ))}
      </div>
    </div>
  );
};
