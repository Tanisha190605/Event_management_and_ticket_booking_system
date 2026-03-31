import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full ${
        scrolled 
          ? 'py-3 bg-brand-dark/95 backdrop-blur-md shadow-2xl shadow-brand-dark/50 border-b border-white/10' 
          : 'py-6 lg:py-8 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex items-center justify-between">
          
          {/* Enhanced Interactive Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <motion.div 
              className={`flex items-center justify-center transition-all duration-300 relative ${scrolled ? 'scale-90' : 'scale-100'}`}
              whileHover={{ rotate: 180, scale: 1.15 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              {/* Outer glowing ring behind logo */}
              <motion.div 
                className="absolute inset-0 bg-brand-pink/50 rounded-xl blur-md"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 shadow-[0_0_15px_rgba(236,72,153,0.5)] rounded-xl">
                <rect width="44" height="44" rx="14" fill="url(#brandGradient)" />
                <motion.circle 
                  cx="22" cy="22" r="10" 
                  stroke="white" strokeWidth="2" strokeDasharray="4 6" 
                  style={{ originX: "50%", originY: "50%" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  opacity="0.9"
                />
                <motion.path 
                  d="M22 14L28 26H16L22 14Z" 
                  fill="white" 
                  style={{ originX: "50%", originY: "50%" }}
                  animate={{ scale: [1, 1.25, 1], y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ec4899" />
                    <stop offset="1" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <div className="flex flex-col overflow-hidden">
              <span className={`font-bold text-white tracking-tight transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                Event<span className="text-brand-secondary">Place</span>
              </span>
              <span className={`text-[9.5px] text-white/70 font-bold tracking-[0.25em] uppercase transition-all duration-300 ${scrolled ? 'h-0 opacity-0 mt-0' : 'h-3 opacity-100 mt-0.5'}`}>
                Multivendor Event
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-white uppercase tracking-wider">
            <Link to="/" className="relative transition-colors duration-200 group">
              Home
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-brand-secondary rounded-full transition-all duration-300 group-hover:w-full ${scrolled ? 'w-full' : 'w-4'}`}></span>
            </Link>
            
            <Link to="/events" className="flex items-center gap-1 hover:text-brand-secondary transition-colors duration-200">
              Events
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <Link to="/dashboard" className="flex items-center gap-1 hover:text-brand-secondary transition-colors duration-200">
              Vendor
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            {['Pages', 'Blog'].map((item) => (
              <a key={item} href="#" className="flex items-center gap-1 hover:text-brand-secondary transition-colors duration-200">
                {item}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            ))}
            
            <a href="#" className="hover:text-brand-secondary transition-colors duration-200">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/auth" className={`text-[13px] font-bold text-white uppercase tracking-wider transition-colors hidden md:block hover:text-brand-pink`}>
              Login
            </Link>
            <Link to="/events" className={`px-6 rounded border text-[13px] font-bold uppercase tracking-wider transition-all duration-300 shadow-lg ${scrolled ? 'py-2 border-brand-pink bg-brand-pink text-white hover:bg-transparent hover:text-brand-pink' : 'py-2.5 border-white text-white hover:bg-white hover:text-brand-primary'}`}>
              Buy Tickets
            </Link>
          </div>

        </div>
      </div>
    </motion.header>
  );
};

export default Header;
