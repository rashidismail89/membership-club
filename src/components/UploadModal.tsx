import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Image as ImageIcon, Send, MapPin, Loader2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { cn } from '../lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !preview) return;

    setIsUploading(true);
    try {
      // In a real app, we would upload to Firebase Storage
      // Here we store the base64 preview as the thumbnail/videoURL for demo purposes
      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Gooner',
        userPhoto: auth.currentUser.photoURL,
        thumbnail: preview,
        videoURL: preview, // For images, we just show the same
        caption: caption,
        location: location || 'London',
        likesCount: 0,
        createdAt: serverTimestamp(),
      });

      setFile(null);
      setPreview(null);
      setCaption('');
      setLocation('');
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'posts');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-card-border flex items-center justify-between bg-white pt-12">
              <h2 className="text-[22px] font-black tracking-tighter">CREATE</h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-card-bg text-text-main"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar pb-32">
              <form onSubmit={handleUpload} className="space-y-8">
                {!preview ? (
                  <div className="aspect-[9/16] w-full border-2 border-dashed border-card-border rounded-3xl flex flex-col items-center justify-center space-y-4 bg-card-bg transition-colors hover:border-arsenal-red/30 group relative">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-text-muted group-hover:text-arsenal-red transition-all">
                      <ImageIcon size={32} />
                    </div>
                    <div className="text-center px-6">
                      <p className="text-sm font-black uppercase tracking-widest text-text-main">Record a Reel</p>
                      <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-bold opacity-60">High-fidelity 9:16 Video Preferred</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden shadow-2xl bg-black">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-70" />
                    <button 
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white border border-white/20"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Share the match day vibes..."
                      className="w-full bg-card-bg border border-card-border rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-arsenal-red/20 transition-all min-h-[120px] resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Location</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Emirates Stadium, London"
                        className="w-full bg-card-bg border border-card-border rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-arsenal-red/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button
                    type="submit"
                    disabled={!preview || isUploading}
                    className={cn(
                      "w-full py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center space-x-2",
                      preview && !isUploading
                        ? "bg-arsenal-red text-white shadow-xl shadow-arsenal-red/30 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-card-bg text-text-muted border border-card-border cursor-not-allowed opacity-50"
                    )}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Post Now</span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={onClose}
                    className="w-full py-4 text-arsenal-red font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-70 transition-opacity"
                  >
                    Cancel Post
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
