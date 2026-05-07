import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { ChevronRight, ShieldCheck } from 'lucide-react';

interface CompleteProfileProps {
  user: User;
  onComplete: () => void;
}

export const CompleteProfile: React.FC<CompleteProfileProps> = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    phone: '+255',
    country: 'Tanzania',
    gender: 'Male'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        ...formData,
        isProfileComplete: true,
        photoURL: user.photoURL,
        name: user.displayName,
        email: user.email
      }, { merge: true });
      onComplete();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-app-bg flex flex-col px-6 pt-12 overflow-y-auto no-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md mx-auto w-full"
      >
        <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 flex items-center justify-center p-3 bg-white border border-card-border shadow-sm rounded-2xl text-arsenal-red">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-text-main">Final Step</h1>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Secure Your Membership</p>
            </div>
        </div>

        <div className="premium-card p-4 flex items-center space-x-4 mb-10">
            <img src={user.photoURL || ''} alt="User" className="w-12 h-12 rounded-full border border-card-border" referrerPolicy="no-referrer" />
            <div>
                <p className="text-sm font-bold text-text-main">{user.displayName}</p>
                <p className="text-xs text-text-muted">{user.email}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Phone Number</label>
                <input 
                    required
                    type="tel" 
                    placeholder="+255 000 000 000"
                    className="w-full bg-white border border-card-border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-arsenal-red/20 transition-all font-medium text-text-main placeholder:text-text-muted/30 shadow-sm"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Country</label>
                <div className="relative">
                    <select 
                        className="w-full bg-white border border-card-border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-arsenal-red/20 transition-all font-medium text-text-main appearance-none shadow-sm"
                        value={formData.country}
                        onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    >
                        <option>Tanzania</option>
                        <option>Kenya</option>
                        <option>Uganda</option>
                        <option>Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted opacity-40">
                         <ChevronRight size={14} className="rotate-90" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Gender</label>
                <div className="flex space-x-3">
                    {['Male', 'Female'].map(g => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                            className={`flex-1 py-4 rounded-xl text-xs font-bold transition-all border ${
                                formData.gender === g 
                                ? 'bg-arsenal-red border-arsenal-red text-white shadow-lg shadow-arsenal-red/10' 
                                : 'bg-white border-card-border text-text-muted hover:border-text-main/20'
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                disabled={loading}
                type="submit"
                className="w-full bg-text-main text-white font-bold py-5 rounded-2xl flex items-center justify-center space-x-3 mt-10 hover:bg-arsenal-red transition-all active:scale-[0.98] shadow-xl shadow-text-main/5"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span className="text-sm uppercase tracking-widest">Register Now</span>
                        <ChevronRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>

        <p className="text-[10px] text-text-muted text-center mt-12 px-6 leading-relaxed opacity-60">
            By registering, you agree to our <span className="underline font-bold">Terms</span>. We'll secure your trip to Budapest 2026.
        </p>
      </motion.div>
    </div>
  );
};
