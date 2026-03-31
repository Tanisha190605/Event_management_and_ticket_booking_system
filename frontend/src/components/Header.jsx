import React from 'react';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 pt-8 pb-4">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white text-brand-primary flex items-center justify-center font-bold text-3xl font-script tracking-tighter italic">
              e
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">
                EventPlace
              </span>
              <span className="text-[10px] text-white/70 font-medium tracking-[0.2em] mt-1 uppercase">
                Multivendor Event
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-white uppercase tracking-wider">
            <a href="#" className="relative transition-colors duration-200">
              Home
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white rounded-full"></span>
            </a>
            
            {['Events', 'Vendor', 'Pages', 'Blog'].map((item) => (
              <a key={item} href="#" className="flex items-center gap-1 hover:text-brand-secondary transition-colors duration-200">
                {item}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            ))}
            
            <a href="#" className="hover:text-brand-secondary transition-colors duration-200">Contact</a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center">
            <button className="px-6 py-2.5 rounded border border-white text-white text-[13px] font-bold uppercase tracking-wider hover:bg-white hover:text-brand-primary transition-all duration-300">
              Buy Tickets
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
