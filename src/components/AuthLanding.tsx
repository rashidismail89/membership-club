import React, { useState } from 'react';
import { loginWithGoogle, signUpWithEmail, loginWithEmail } from '../lib/firebase';
import { ChevronRight, Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const AuthLanding: React.FC = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        setError('Unauthorized Domain: Please add this domain to your Firebase Auth whitelist.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In. Please add it in the Firebase Console.');
      } else {
        setError(err.message || 'Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-16 px-8 relative overflow-hidden">
      {/* Subtle Stadium Watermark Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <img 
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" 
          alt="stadium" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Header crest */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-white shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center justify-center mb-8">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" 
              alt="Arsenal Crest" 
              className="w-12 h-12"
              referrerPolicy="no-referrer"
            />
        </div>
      </motion.div>

      <div className="w-full max-w-sm flex flex-col items-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-px w-4 bg-arsenal-red/30" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-arsenal-red">Budapest 2026</span>
              <div className="h-px w-4 bg-arsenal-red/30" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-text-main leading-tight mb-2">
            JOIN THE HUB
          </h1>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.1em] opacity-40">
            Exclusive Membership Club
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showEmailForm ? (
            <motion.div 
              key="google-main"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full space-y-6"
            >
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-[#E0E0E0] text-text-main py-5 px-8 rounded-full font-black text-xs shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center justify-center space-x-4 active:scale-[0.97] transition-all hover:bg-slate-50 group hover:border-[#D0D0D0]"
              >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="uppercase tracking-[0.2em]">Sign Up with Google</span>
                        <ChevronRight size={16} className="text-[#D0D0D0] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
              </button>

              <div className="flex items-center justify-center">
                 <button 
                  onClick={() => setShowEmailForm(true)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-40 hover:opacity-100 transition-opacity"
                 >
                   Other options
                 </button>
              </div>
            </motion.div>
          ) : (
            <motion.form 
                key="email-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full space-y-4"
            >
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-arsenal-red/20 transition-all font-sans"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-arsenal-red/20 transition-all font-sans"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                <input 
                  required
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-arsenal-red/20 transition-all font-sans"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-[10px] text-arsenal-red font-black text-center uppercase tracking-wider bg-arsenal-red/5 py-2 rounded-lg">{error}</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-text-main text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-text-main/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                    <>
                    <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    <ChevronRight size={16} />
                    </>
                )}
              </button>

              <div className="flex flex-col items-center space-y-4 pt-4">
                <button 
                    type="button"
                    onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                    className="text-[10px] font-black uppercase tracking-[0.15em] text-arsenal-red"
                >
                    {mode === 'signup' ? 'Switch to Login' : 'Switch to Sign Up'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted opacity-40"
                >
                  Back to Google
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col items-center space-y-6 z-10"
      >
        <div className="flex flex-col items-center space-y-1">
            <span className="text-[10px] font-serif italic text-text-muted/30 tracking-[0.3em] uppercase">
                Victoria Concordia Crescit
            </span>
            <div className="w-12 h-[1px] bg-slate-100" />
        </div>
      </motion.div>
    </div>
  );
};
