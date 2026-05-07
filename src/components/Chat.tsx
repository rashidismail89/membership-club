import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { Send, User as UserIcon, Plus } from 'lucide-react';
import { Message } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'global_chat'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'global_chat');
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'global_chat'), {
        senderId: auth.currentUser.uid,
        messageBody: newMessage,
        senderName: auth.currentUser.displayName,
        senderPhoto: auth.currentUser.photoURL,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'global_chat');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-white relative">
      {/* Header & Presence */}
      <div className="p-5 border-b border-card-border bg-white/80 backdrop-blur-xl z-20">
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <h2 className="text-[18px] font-black text-text-main tracking-tighter leading-none uppercase">Global Hub</h2>
                <div className="flex items-center mt-1.5 space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest opacity-60">12,482 Gooners Online</p>
                </div>
            </div>
            <div className="flex -space-x-2.5">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=goon${i}`} alt="u" />
                    </div>
                 ))}
            </div>
        </div>
      </div>

      {/* Message Flow */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar bg-white">
        {messages.map((m: any, idx) => {
          const isMe = m.senderId === auth.currentUser?.uid;
          const showAvatar = idx === 0 || messages[idx-1].senderId !== m.senderId;

          return (
            <div key={m.id} className={cn(
                "flex items-end space-x-2",
                isMe ? "flex-row-reverse space-x-reverse" : "flex-row"
            )}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full border border-[#EEEEEE] bg-white flex-shrink-0 overflow-hidden mb-0.5">
                  {m.senderPhoto ? (
                    <img src={m.senderPhoto} alt="S" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-full h-full p-2 text-[#888888] opacity-30" />
                  )}
                </div>
              )}
              
              <div className={cn(
                "max-w-[78%] flex flex-col",
                isMe ? "items-end" : "items-start"
              )}>
                {showAvatar && (
                    <div className={cn(
                        "flex items-center space-x-1.5 mb-1",
                        isMe ? "flex-row-reverse space-x-reverse mr-1" : "ml-1"
                    )}>
                        <span className="text-[11px] font-bold text-text-main opacity-80">{m.senderName?.split(' ')[0]}</span>
                        <span className="text-[10px]">🇬🇧</span>
                    </div>
                )}
                <div className={cn(
                    "px-4 py-2.5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] text-sm font-medium leading-relaxed",
                    isMe 
                    ? "bg-[#EF0107] text-white rounded-2xl rounded-tr-[2px]" 
                    : "bg-[#F2F2F2] text-text-main rounded-2xl rounded-tl-[2px]"
                )}>
                    {m.messageBody}
                </div>
                {showAvatar && (
                    <span className="text-[9px] text-[#AAAAAA] font-bold tracking-tight mt-1 px-1">
                        {m.timestamp && format(m.timestamp.toDate(), 'HH:mm')}
                    </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Interactive Input Bar */}
      <div className="px-4 pt-3 pb-8 bg-white border-t border-[#EEEEEE]">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
            <button type="button" className="w-11 h-11 rounded-full bg-[#F8F8F8] flex items-center justify-center text-[#888888] hover:bg-[#F2F2F2] transition-all">
                <Plus size={20} />
            </button>
            <div className="flex-1 bg-[#F8F8F8] rounded-[25px] px-5 py-3 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Say something to the army..."
                    className="flex-1 bg-transparent text-[14px] focus:outline-none text-text-main placeholder:text-[#888888]/50"
                />
            </div>
            <button type="submit" className="w-11 h-11 bg-white border border-[#EEEEEE] rounded-full flex items-center justify-center text-arsenal-red shadow-sm hover:scale-105 active:scale-95 transition-all">
                <Send size={18} strokeWidth={1.5} />
            </button>
        </form>
      </div>
    </div>
  );
};
