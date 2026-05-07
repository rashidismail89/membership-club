import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import { Post } from '../types';
import { cn } from '../lib/utils';

interface VideoReelProps {
  post: Post;
  isActive: boolean;
}

export const VideoReel: React.FC<VideoReelProps> = ({ post, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-screen snap-start bg-black flex items-center justify-center overflow-hidden group">
      <video
        ref={videoRef}
        src={post.videoURL}
        poster={post.thumbnail}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      
      {/* Immersive Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* Info Section (Bottom Left) */}
      <div className="absolute bottom-32 left-5 right-20 text-white pointer-events-none z-20">
        <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full border border-white/40 bg-white/10 backdrop-blur-md overflow-hidden flex-shrink-0 shadow-lg">
                <img src={post.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">@{post.userName || 'Member'}</h3>
                    <div className="w-1 h-1 rounded-full bg-arsenal-red" />
                    <div className="flex items-center text-[10px] text-white/90 font-medium drop-shadow-md">
                        <MapPin size={10} className="mr-1 opacity-70" />
                        {post.location || 'Budapest'}
                    </div>
                </div>
            </div>
        </div>
        <p className="text-[13px] font-medium text-white/95 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-3 max-w-[85%]">{post.caption}</p>
      </div>

      {/* Sidebar Controls (Bottom Right) */}
      <div className="absolute bottom-32 right-4 flex flex-col space-y-6 z-20">
        {[
            { icon: <Heart className={cn("w-7 h-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]", liked && "fill-current text-arsenal-red")} strokeWidth={1.5} />, label: post.likesCount + (liked ? 1 : 0), active: liked, onClick: () => setLiked(!liked) },
            { icon: <MessageCircle className="w-7 h-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] text-white" strokeWidth={1.5} />, label: '84' },
            { icon: <Share2 className="w-7 h-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] text-white" strokeWidth={1.5} />, label: 'Share' }
        ].map((item, idx) => (
            <button 
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center group active:scale-90 transition-transform cursor-pointer"
            >
                <div className="p-2 transition-all">
                    {item.icon}
                </div>
                <span className="text-[10px] font-bold mt-0.5 text-white uppercase tracking-widest drop-shadow-lg opacity-90">{item.label}</span>
            </button>
        ))}
      </div>
    </div>
  );
};
