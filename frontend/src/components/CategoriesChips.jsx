import React from 'react';
import { motion } from 'framer-motion';

const CategoriesChips = () => {
  const categories = [
    { name: 'Digital Art', icon: '🎨' },
    { name: 'Music and Audio', icon: '🎵' },
    { name: 'Business', icon: '💼' },
    { name: 'Technology', icon: '💻' },
    { name: 'Virtual Real Estate', icon: '🏘️' },
    { name: 'Gaming Assets', icon: '🎮' },
    { name: 'Photography', icon: '📷' },
    { name: 'Fashion', icon: '👗' }
  ];

  return (
    <section className="bg-gray-50 pt-20 pb-8 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Top category we have</h4>
          <div className="w-12 h-1 bg-brand-primary/30 rounded-full"></div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {categories.map((cat, idx) => (
            <motion.button 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-bold text-brand-navy hover:border-brand-primary hover:text-brand-primary hover:shadow-[0_0_15px_rgba(76,29,149,0.15)] hover:-translate-y-1 transition-all duration-300"
            >
               <span className="text-lg">{cat.icon}</span>
               {cat.name}
            </motion.button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesChips;
