import React, { useState, useEffect } from 'react';
import { db, auth } from './lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/error-handler';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Home as HomeIcon, 
  Play as ReelsIcon, 
  Users as DiscoverIcon, 
  MessageSquare as ChatIcon, 
  User as ProfileIcon,
  ChevronRight,
  Trophy,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Countdown } from './components/Countdown';
import { GreetingSwitcher } from './components/GreetingSwitcher';
import { AdRotator } from './components/AdRotator';
import { VideoReel } from './components/VideoReel';
import { GunnersNearby } from './components/GunnersNearby';
import { Chat } from './components/Chat';
import { AuthLanding } from './components/AuthLanding';
import { CompleteProfile } from './components/CompleteProfile';
import { UploadModal } from './components/UploadModal';
import { Post, Sponsor, UserProfile } from './types';
import { cn } from './lib/utils';
import { Plus } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserProfile[]>([]);
  const [totalMembers, setTotalMembers] = useState(12482);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch profile
        const docRef = doc(db, 'users', u.uid);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setProfile(data);
                setShowOnboarding(!data.isProfileComplete);
            } else {
                setShowOnboarding(true);
            }
        } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
            setShowOnboarding(true);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Real-time Sponsor Hook
    const unsubSponsors = onSnapshot(collection(db, 'sponsors'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Sponsor[];
      if (data.length === 0) {
        setSponsors([
            { 
                id: '1', 
                name: 'Emirates', 
                tagline: 'Fly Better to Budapest', 
                bannerImageURL: '/input_file_2.png', 
                linkURL: '#', 
                priority: 1 
            },
            { 
                id: '2', 
                name: 'Pepsi', 
                tagline: 'Stay Refreshed in the Summer', 
                bannerImageURL: '/input_file_0.png', 
                linkURL: '#', 
                priority: 1 
            },
            { 
                id: '3', 
                name: 'Airtel', 
                tagline: 'Stay Connected Overseas', 
                bannerImageURL: '/input_file_1.png', 
                linkURL: '#', 
                priority: 1 
            }
        ]);
      } else {
        setSponsors(data);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'sponsors');
    });

    // Real-time Users Hook (Active + Total)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        const allUsers = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
        setTotalMembers(allUsers.length > 50 ? allUsers.length : 12482);
        // Prioritize users with photos and basic completeness for "Active" display
        setActiveUsers(allUsers.slice(0, 10));
    }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
    });

    // Real-time Posts Hook
    const unsubPosts = onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10)), (snap) => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
        if (data.length === 0) {
          setPosts([
            { 
                id: '1', 
                userId: 'user1', 
                userName: 'Ahmed K.',
                userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
                videoURL: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-kicking-the-ball-in-the-field-1215-large.mp4', 
                thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
                caption: 'Train ride to Budapest starting NOW! COYG! 🔴⚪️',
                location: 'London',
                likesCount: 1240,
                createdAt: new Date()
            },
            { 
                id: '2', 
                userId: 'user2', 
                userName: 'Sofia M.',
                userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
                videoURL: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-the-stadium-1214-large.mp4', 
                thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
                caption: 'Checking in from Puskás Aréna! It is beautiful. #RoadToBudapest',
                location: 'Budapest',
                likesCount: 850,
                createdAt: new Date()
            }
          ]);
        } else {
          setPosts(data);
        }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    });

    return () => { unsubSponsors(); unsubPosts(); unsubUsers(); };
  }, [user]);

  const handleProfileComplete = async () => {
    if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
            }
        } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
    }
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-arsenal-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <AuthLanding />;
  if (showOnboarding) return <CompleteProfile user={user} onComplete={handleProfileComplete} />;

  return (
    <div className={cn(
      "min-h-screen flex flex-col md:max-w-md md:mx-auto relative select-none transition-colors duration-500",
      activeTab === 'reels' ? "bg-black" : "bg-app-bg text-text-main"
    )}>
      
      <main className={cn(
        "flex-1 overflow-y-auto no-scrollbar",
        activeTab !== 'reels' ? "pb-32" : "h-screen"
      )}>
        {activeTab === 'home' && (
          <div className="flex flex-col pt-8 overflow-hidden">
            <GreetingSwitcher userName={user.displayName?.split(' ')[0] || 'Gunner'} />
            
            <div className="mt-6">
                <Countdown />
            </div>

            <div className="px-6 mb-8 -mt-2">
                <AdRotator sponsors={sponsors} />
            </div>
            
             {/* Stats Section - De-bulked */}
             <div className="px-6 mb-10">
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Members', value: totalMembers >= 1000 ? `${(totalMembers / 1000).toFixed(1)}K` : totalMembers },
                        { label: 'Countries', value: '84' },
                        { label: 'Reels', value: posts.length > 5 ? `${posts.length}+` : posts.length }
                    ].map((stat) => (
                        <div key={stat.label} className="premium-card py-4 flex flex-col items-center justify-center text-center">
                            <span className="text-lg font-black tracking-tight">{stat.value}</span>
                            <span className="text-text-muted text-[8px] font-bold uppercase tracking-[0.15em] mt-0.5">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* New Posts - Dynamic Pull */}
            <div className="px-6 mb-10">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-muted opacity-60">New Reels</h3>
                </div>
                <div className="flex space-x-3 overflow-x-auto no-scrollbar">
                    {posts.slice(0, 5).map(post => (
                        <div 
                            key={post.id} 
                            onClick={() => setActiveTab('reels')}
                            className="w-36 flex-shrink-0 aspect-[9/16] premium-card relative overflow-hidden group cursor-pointer"
                        >
                            <img 
                                src={post.thumbnail || `https://images.unsplash.com/photo-1574629810360-7efbbe195018`} 
                                alt="Reel" 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <h4 className="font-bold text-[10px] text-white tracking-tight truncate drop-shadow-sm">{post.userName || 'Member'}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fans Section - Real Presence */}
            <div className="px-6 pb-12">
                 <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-muted opacity-60">Top Gooners</h3>
                </div>
                <div className="flex space-x-4 overflow-x-auto no-scrollbar">
                    {activeUsers.map((u, i) => (
                        <div key={u.uid || i} className="flex flex-col items-center flex-shrink-0 space-y-2">
                             <div className="w-12 h-12 rounded-full p-0.5 bg-white border border-card-border relative">
                                <img 
                                    src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} 
                                    alt="User" 
                                    className="w-full h-full rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                             </div>
                             <span className="text-[9px] font-bold text-text-muted">{u.name?.split(' ')[0] || 'Gooner'}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'discover' && <GunnersNearby />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'reels' && (
          <div 
            className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
            onScroll={(e) => {
              const target = e.currentTarget;
              const index = Math.round(target.scrollTop / target.clientHeight);
              if (index !== activeReelIndex) {
                setActiveReelIndex(index);
              }
            }}
          >
            {posts.map((post, index) => {
              const isVisible = Math.abs(index - activeReelIndex) <= 1;
              if (!isVisible) return <div key={post.id} className="h-screen w-full snap-start" />;
              
              return (
                <VideoReel 
                  key={post.id} 
                  post={post} 
                  isActive={activeTab === 'reels' && index === activeReelIndex} 
                />
              );
            })}
          </div>
        )}

        {activeTab === 'profile' && (
            <div className="p-6 pb-24">
                <div className="flex flex-col items-center mb-10 mt-6">
                     <div className="w-24 h-24 rounded-full p-0.5 bg-white mb-4 border border-card-border shadow-sm">
                        <img 
                            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                            alt="Profile" 
                            className="w-full h-full rounded-full" 
                            referrerPolicy="no-referrer"
                        />
                     </div>
                     <h3 className="text-xl font-bold tracking-tight">{user.displayName}</h3>
                     <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mt-1">Official Member</p>
                </div>

                <div className="space-y-3">
                    {[
                        { icon: <Trophy size={16} />, label: 'Membership Status', value: 'Founding Member' },
                        { icon: <MapPin size={16} />, label: 'Location', value: profile?.country || 'UK' },
                        { icon: <MessageCircle size={16} />, label: 'Global Chat Rank', value: '#1,242' }
                    ].map((item, i) => (
                        <div key={i} className="premium-card p-4 flex items-center justify-between group cursor-pointer hover:border-arsenal-red/10 transition-all">
                            <div className="flex items-center space-x-3">
                                <div className="text-text-muted opacity-40 group-hover:text-arsenal-red group-hover:opacity-100 transition-all">
                                    {item.icon}
                                </div>
                                <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">{item.label}</span>
                            </div>
                            <span className="text-xs font-bold text-text-main">{item.value}</span>
                        </div>
                    ))}
                    <button 
                        onClick={() => auth.signOut()}
                        className="w-full premium-card p-4 text-center text-arsenal-red font-bold text-xs uppercase tracking-[0.2em] mt-10 hover:bg-arsenal-red/5 transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        )}
      </main>

      <nav className={cn(
        "fixed bottom-4 left-4 right-4 h-16 flex items-center justify-around px-2 z-[50] md:max-w-md md:left-1/2 md:-translate-x-1/2 transition-all duration-500 rounded-[28px] shadow-[0_15px_50px_rgba(0,0,0,0.1)]",
        activeTab === 'reels' ? "glass-nav-reels" : "glass-nav"
      )}>
        <NavButton active={activeTab === 'home'} icon={<HomeIcon />} label="Hub" onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'chat'} icon={<ChatIcon />} label="Chat" onClick={() => setActiveTab('chat')} />
        
        {/* Upload Button */}
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="w-12 h-12 bg-arsenal-red rounded-full flex items-center justify-center text-white shadow-lg shadow-arsenal-red/20 -mt-8 hover:scale-110 active:scale-95 transition-all outline outline-4 outline-white"
        >
          <Plus size={24} strokeWidth={3} />
        </button>

        <NavButton active={activeTab === 'discover'} icon={<DiscoverIcon />} label="Fans" onClick={() => setActiveTab('discover')} />
        <NavButton active={activeTab === 'profile'} icon={<ProfileIcon />} label="Me" onClick={() => setActiveTab('profile')} />
      </nav>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
}

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
        "flex flex-col items-center justify-center space-y-0.5 transition-all duration-300 relative py-1 px-1 w-14 group",
        active ? "text-arsenal-red" : "text-text-muted hover:text-text-main"
    )}
  >
    <div className={cn(
        "p-1.5 rounded-2xl transition-all duration-500 transform group-active:scale-95",
        active ? "bg-arsenal-red/10" : ""
    )}>
        {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className={cn("text-[8px] font-black uppercase tracking-[0.1em] transition-all", active ? "opacity-100" : "opacity-30 translate-y-1 scale-90")}>{label}</span>
  </button>
);
