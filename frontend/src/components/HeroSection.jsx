import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // We will generate an array of dummy stars for the background
  const sparkles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));

  const fanCards = [
    { id: 1, rotate: -24, x: -360, y: 80, zIndex: 10, scale: 0.75, floatDelay: 0, img: 'https://images.unsplash.com/photo-1540511546273-6c6a1e5d338c?w=400&h=600&fit=crop', hiddenMobile: true },
    { id: 2, rotate: -12, x: -180, y: 30, zIndex: 20, scale: 0.9, floatDelay: 0.5, img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=600&fit=crop' },
    { id: 3, rotate: 0, x: 0, y: 0, zIndex: 30, scale: 1.1, floatDelay: 1, img: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=400&h=600&fit=crop', active: true },
    { id: 4, rotate: 12, x: 180, y: 30, zIndex: 20, scale: 0.9, floatDelay: 0.5, img: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=600&fit=crop' },
    { id: 5, rotate: 24, x: 360, y: 80, zIndex: 10, scale: 0.75, floatDelay: 0, img: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400&h=600&fit=crop', hiddenMobile: true }
  ];

  return (
    <section className="relative min-h-[140vh] pt-32 pb-32 overflow-hidden bg-gradient-to-br from-brand-primary via-[#6b21a8] to-brand-secondary/40 flex flex-col items-center">
      
      {/* Sparkles / Stars Background */}
      {sparkles.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white mix-blend-screen"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Decorative Vector Shapes Background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-bl from-brand-secondary/20 to-brand-primary/0 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute bottom-1/4 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-brand-pink/20 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4"
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 mt-20 md:mt-24 flex flex-col items-center justify-start flex-grow">
        
        {/* Top Centered Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl text-center flex flex-col items-center"
        >
          <h3 className="font-script text-4xl md:text-5xl lg:text-6xl text-brand-teal mb-4 tracking-wide drop-shadow-lg">
            Find Your Next Experience
          </h3>
          
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-white leading-[1.05] mb-12 tracking-tight">
            Discover & Promote <br className="hidden md:block"/>
            Upcoming Event
          </h1>

          {/* Search Bar Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
            className="bg-white rounded-xl p-3 flex flex-col md:flex-row items-center shadow-2xl relative z-20 w-full max-w-[800px]"
          >
            <div className="flex-1 flex items-center px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 hidden md:block group-focus-within:text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search Event" className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm font-medium text-left"/>
            </div>

            <div className="flex-1 flex items-center px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full cursor-pointer hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="flex-1 text-gray-400 text-sm font-medium text-left">Search Location</span>
            </div>

            <div className="px-2 w-full md:w-auto mt-3 md:mt-0">
              <Link to="/events" className="w-full md:w-16 h-12 md:h-14 rounded-full bg-brand-navy flex items-center justify-center text-white hover:bg-brand-primary hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(76,29,149,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </motion.div>

        </motion.div>

        {/* Center Floating 3D Fan Carousel */}
        <div className="relative w-full max-w-[1000px] h-[500px] md:h-[650px] mt-16 md:mt-32 flex items-center justify-center isolate">
           
           {/* Center pulsing glow behind cards */}
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-secondary rounded-full blur-[100px] md:blur-[150px] -z-10"
           />

           {fanCards.map((card, idx) => {
              // On mobile, hide extreme outer cards (x:360/-360) and keep only central 3. Let's conditionally apply CSS to hide on mobile.
              const mobileHideClass = card.hiddenMobile ? 'hidden md:block' : 'block';
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 150, x: 0, rotate: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    y: card.y, 
                    x: card.x, 
                    rotate: card.rotate,
                    scale: card.scale
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.6 + (idx * 0.1),
                    type: "spring", stiffness: 60, damping: 15
                  }}
                  className={`absolute ${mobileHideClass}`}
                  style={{ zIndex: card.zIndex }}
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: card.floatDelay }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: -card.rotate * 0.3, // gently counteract the spread tilt
                      y: -30,
                      transition: { duration: 0.4, type: "spring", stiffness: 300 }
                    }}
                    className={`w-[220px] h-[300px] md:w-[280px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer ${
                      card.active ? 'border-2 border-brand-secondary shadow-[0_0_50px_rgba(56,189,248,0.5)]' : 'border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-brand-navy/50'
                    }`}
                  >
                    {/* Hover Glow Mask */}
                    <div className="absolute inset-0 bg-brand-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 mix-blend-overlay"></div>
                    
                    <img src={card.img} alt={`Carousel card ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                    
                    {card.active && (
                      <div className="absolute bottom-6 left-5 right-5 z-30">
                        <div className="w-8 h-1 bg-brand-secondary rounded-full mb-3 shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                        <p className="text-white text-sm md:text-base font-bold leading-tight">Featured Collection #42</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
           })}
           
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
