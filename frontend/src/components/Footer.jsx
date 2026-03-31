import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -ml-[400px] w-[800px] h-[400px] bg-brand-500 rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Event<span className="text-gray-400">Sphere</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6 font-medium">
              We empower creators to build experiences that bring people together. The modern toolkit for ticketing, marketing, and managing events.
            </p>
            <div className="flex items-center gap-4">
              {/* Dummy Social Icons */}
              {['Twitter', 'GitHub', 'LinkedIn'].map((label, i) => (
                <div key={i} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                  <span className="text-xs font-medium">{label.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'Integrations', 'Changelog'].map(link => (
                <li key={link}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              {['Community', 'Help Center', 'API Documentation', 'Blog'].map(link => (
                <li key={link}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {['About', 'Careers', 'Contact', 'Partners'].map(link => (
                <li key={link}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-gray-500">
            &copy; {new Date().getFullYear()} EventSphere Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
