import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    { value: '42', label: 'Years Experience' },
    { value: '204', label: 'Events Hosted' },
    { value: '24M', label: 'Tickets Sold' },
    { value: '112', label: 'Verified Vendors' }
  ];

  return (
    <section className="bg-brand-dark py-16 border-t border-brand-primary/20 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-32 bg-brand-primary/20 blur-[80px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="md:w-1/3 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Some reasons to <br className="hidden md:block"/>
              <span className="text-brand-pink font-script text-3xl">Choose Us</span>
            </h3>
            <p className="text-gray-400 text-sm">
              We provide the most robust platform for creators to scale their events globally with zero hassle.
            </p>
          </div>

          <div className="md:w-2/3 flex flex-wrap items-center justify-center md:justify-around gap-8 w-full">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-secondary to-brand-primary mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(76,29,149,0.5)] cursor-default">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;
