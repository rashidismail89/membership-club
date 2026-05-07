import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { MapPin, Search, MessageCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

const COUNTRIES = ['All', 'UK', 'Kenya', 'Tanzania', 'USA', 'Nigeria', 'Sweden'];

export const GunnersNearby: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.country?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || u.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="flex flex-col h-full bg-app-bg px-5 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
            <h2 className="text-[18px] font-black text-text-main tracking-tighter leading-none uppercase">Fan Base</h2>
            <div className="flex items-center space-x-1.5 px-2 py-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-text-main text-[11px] font-bold tracking-tight uppercase opacity-50">{users.length} Online</span>
            </div>
        </div>
        <p className="text-[#888888] text-[12px] font-medium">Connect with verified Gooners</p>
      </div>
      
      {/* Search & Filters */}
      <div className="space-y-5 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] opacity-50" />
          <input 
            type="text" 
            placeholder="Search verified members..."
            className="w-full bg-[#F0F0F0] border-none rounded-[25px] py-4 pl-12 pr-6 text-[14px] focus:outline-none transition-all font-medium text-text-main placeholder:text-[#888888]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {COUNTRIES.map(country => (
                <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={cn(
                        "px-5 py-2 rounded-full text-[12px] font-bold transition-all border whitespace-nowrap",
                        selectedCountry === country 
                        ? "bg-text-main text-white border-text-main" 
                        : "bg-[#F0F0F0] text-text-muted border-transparent hover:border-text-main/10"
                    )}
                >
                    {country}
                </button>
            ))}
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 space-y-3 pb-32 overflow-y-auto no-scrollbar">
        {filteredUsers.map((user) => (
          <div key={user.uid} className="flex items-center justify-between p-3 bg-white border border-[#EEEEEE] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="w-[50px] h-[50px] rounded-full p-0.5 border border-[#EEEEEE] relative flex-shrink-0">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt={user.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[16px] font-medium text-text-main tracking-tight leading-none mb-1.5">{user.name}</h4>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center text-[11px] text-[#888888] font-medium">
                      <MapPin size={11} className="mr-1 opacity-40" />
                      {user.country}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#EEEEEE]" />
                    <span className="text-[10px] font-bold text-arsenal-red uppercase tracking-wider">Verified</span>
                </div>
              </div>
            </div>
            <div className="flex items-center pr-2">
                <button className="text-[#888888] opacity-30 group-hover:opacity-100 group-hover:text-arsenal-red transition-all">
                    <MessageCircle size={20} strokeWidth={1.5} />
                </button>
            </div>
          </div>
        ))}
        
        {filteredUsers.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <div className="w-14 h-14 rounded-full bg-card-border flex items-center justify-center mb-4">
                  <Search size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#888888]">No Gooners found</p>
           </div>
        )}
      </div>
    </div>
  );
};
