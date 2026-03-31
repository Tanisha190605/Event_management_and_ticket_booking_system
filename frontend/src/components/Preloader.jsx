import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reveal underlying application after 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {children}
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-dark overflow-hidden"
          >
            {/* Animated glowing organic background blob */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 90, 0]
              }}
              transition={{
                duration: 4,
                ease: "linear",
                repeat: Infinity
              }}
              className="absolute w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Main Interactive Logo Core */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                borderRadius: ["30%", "50%", "30%"]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity
              }}
              className="relative z-10 w-24 h-24 bg-gradient-to-tr from-brand-pink to-brand-secondary shadow-[0_0_50px_rgba(236,72,153,0.6)] flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:rounded-full before:border-4 before:border-white/20 before:animate-ping"
            >
               <span className="text-white font-script text-4xl font-bold tracking-tighter pr-1">e</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 font-sans font-bold text-white tracking-widest uppercase text-sm"
            >
              Loading <span className="animate-pulse text-brand-secondary">Experience</span>...
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Preloader;
