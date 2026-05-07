import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GreetingSwitcherProps {
  userName?: string;
}

const GREETINGS = [
  "Welcome", "Karibu"
];

export const GreetingSwitcher: React.FC<GreetingSwitcherProps> = ({ userName = "Gunner" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 flex items-center px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={GREETINGS[index]}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <h2 className="text-[18px] font-black text-text-main tracking-tighter leading-none">
            {GREETINGS[index]}, <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-arsenal-red to-[#B38728] drop-shadow-sm">{userName}</span>
          </h2>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
