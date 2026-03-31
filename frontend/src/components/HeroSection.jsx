import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden bg-gradient-to-br from-brand-primary via-[#6b21a8] to-brand-secondary/40">
      
      {/* Decorative Vector Shapes Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-brand-secondary/30 to-brand-primary/0 rounded-full blur-3xl opacity-70 pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
      <div className="absolute top-1/2 right-0 w-[600px] h-full object-cover">
        {/* Simulating the large teal arrow/curve shape */}
        <div className="absolute right-0 top-1/4 w-[600px] h-[400px] bg-brand-secondary/80 rounded-l-full transform rotate-12 -translate-y-1/2 opacity-70 blur-xl mix-blend-screen pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 h-full flex flex-col justify-center">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Text Content */}
          <div className="flex-1 max-w-3xl">
            <h3 className="font-script text-4xl md:text-5xl text-brand-teal mb-4 tracking-wide transform -rotate-2 origin-left drop-shadow-lg">
              Find Your Next Experience
            </h3>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.15] mb-12 tracking-tight">
              Discover & Promote <br />
              Upcoming Event
            </h1>

            {/* Search Bar Container */}
            <div className="bg-white rounded-xl p-3 flex flex-col md:flex-row items-center shadow-2xl relative z-20 w-full max-w-[900px]">
              
              {/* Search Event Input */}
              <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search Event" 
                  className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="flex-1 text-gray-400 text-sm font-medium">Search Location</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Category Input */}
              <div className="flex-[0.8] flex items-center px-4 py-2 w-full cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="flex-1 text-gray-400 text-sm font-medium">Category</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Search Button */}
              <div className="px-2 w-full md:w-auto mt-2 md:mt-0">
                <button className="w-full md:w-14 h-12 md:h-14 rounded-full bg-brand-navy flex items-center justify-center text-white hover:bg-brand-primary transition-colors shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

            </div>
          </div>

          {/* Right Floating Images (Dummy placeholder via unsplash to match aesthetic) */}
          <div className="hidden lg:block relative w-[450px] h-[500px]">
             {/* Abstract circle containing user */}
             <div className="absolute top-[20px] right-[50px] w-48 h-48 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] overflow-hidden border-4 border-transparent shadow-2xl z-20">
               <img src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=500&h=500&fit=crop" alt="User 1" className="w-full h-full object-cover" />
             </div>
             
             {/* Secondary abstract circle containing user */}
             <div className="absolute bottom-[50px] right-[0px] w-64 h-64 rounded-full overflow-hidden border-4 border-[#eab308] border-opacity-50 shadow-2xl z-10 bg-yellow-400/20 mix-blend-luminosity">
               <img src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=500&h=500&fit=crop" alt="User 2" className="w-full h-full object-cover mix-blend-overlay" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
