import React from 'react';
import { loginWithGoogle } from '../lib/firebase';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-20 px-8 relative overflow-hidden">
      {/* Subtle Stadium Watermark Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <img 
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" 
          alt="stadium" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* UEFA Starball Pattern Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
        <svg width="500" height="500" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L61 35 L97 35 L68 57 L79 92 L50 70 L21 92 L32 57 L3 35 L39 35 Z" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="w-28 h-28 rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center justify-center mb-12 border border-slate-50">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" 
            alt="Arsenal Crest" 
            className="w-16 h-16 drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
                <div className="h-px w-6 bg-arsenal-red/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-arsenal-red">Budapest 2026</span>
                <div className="h-px w-6 bg-arsenal-red/30" />
            </div>
            <h1 className="text-[32px] font-black tracking-tighter text-text-main leading-[1.1]">
                MEMBERSHIP<br/>
                <span className="text-text-muted font-normal opacity-30">CLUB</span>
            </h1>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full max-w-xs z-10"
      >
        <button 
          onClick={loginWithGoogle}
          className="w-full bg-white border border-[#E0E0E0] text-text-main py-5 px-8 rounded-2xl font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-center space-x-4 active:scale-[0.97] transition-all hover:bg-slate-50 group hover:border-[#D0D0D0]"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
            <span className="uppercase tracking-[0.1em]">Sign Up with Google</span>
            <ChevronRight size={16} className="text-[#D0D0D0] group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="flex flex-col items-center space-y-10 z-10"
      >
        <div className="flex items-center space-x-8">
            <img 
                src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" 
                alt="Arsenal" 
                className="w-10 h-10 grayscale opacity-[0.05]" 
                referrerPolicy="no-referrer"
            />
            <div className="w-px h-6 bg-slate-100" />
            <span className="text-[10px] font-medium tracking-[0.3em] text-[#C0C0C0] uppercase">Est. 1886</span>
        </div>
        
        <div className="flex flex-col items-center space-y-1">
            <span className="text-[11px] font-serif italic text-[#D0D0D0] tracking-[0.2em] uppercase">
                Victoria Concordia Crescit
            </span>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
        </div>
      </motion.div>
    </div>
  );
};
