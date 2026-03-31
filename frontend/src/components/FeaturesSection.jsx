import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const events = [
    { id: 1, title: 'Entomology International Congress of Vancouver', date: 'Fri, 15 Sep 2023', vendor: 'MedLab Inc', image: 'https://images.unsplash.com/photo-1540511546273-6c6a1e5d338c?w=600&h=400&fit=crop' },
    { id: 2, title: 'Success Free Career & Meditation Classes', date: 'Fri, 10 Nov 2023', vendor: 'Zen Life', image: 'https://images.unsplash.com/photo-1523580494112-071d1694057c?w=600&h=400&fit=crop' },
    { id: 3, title: 'Career Fair: Exclusive Hiring Event-New', date: 'Thu, 26 Oct 2023', vendor: 'TechHires', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=600&h=400&fit=crop' },
    { id: 4, title: 'Symposiums Chemotherapy Foundation Symposiums', date: 'Mon, 02 Dec 2024', vendor: 'Oncology Group', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop' },
    { id: 5, title: 'Vancouver International Congress of Entomology', date: 'Fri, 27 Oct 2023', vendor: 'Science Direct', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop' },
    { id: 6, title: 'Modern Marketing Expo in for the Business Owner', date: 'Fri, 15 Sep 2023', vendor: 'MarketMasters', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&h=400&fit=crop' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="py-24 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="font-script text-3xl md:text-5xl text-brand-pink mb-2 tracking-wide transform -rotate-2 origin-center inline-block">
            Upcoming Event
          </h3>
          <h2 className="text-4xl md:text-[44px] font-bold text-brand-navy tracking-tight mt-2">
            Featured Events
          </h2>
        </motion.div>

        {/* Events Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Link to={`/event/${event.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-500 flex flex-col group border border-gray-100 hover:border-brand-pink h-full transform hover:-translate-y-2 relative z-10 hover:z-20">
                
                {/* Event Image */}
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                </div>

                {/* Event Content */}
                <div className="p-7 flex flex-col flex-grow">
                  
                  <h3 className="text-[17px] font-bold text-brand-navy leading-snug mb-5 min-h-[48px] group-hover:text-brand-primary transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center text-sm font-medium text-gray-500 mb-6 group-hover:text-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-brand-pink/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Organized By</span>
                      <span className="text-sm font-bold text-brand-pink">{event.vendor}</span>
                    </div>
                    
                    <span className="px-5 py-2 rounded border-2 border-brand-navy text-brand-navy text-[12px] font-bold uppercase tracking-wider group-hover:bg-brand-navy group-hover:text-white transition-all duration-300 shadow-sm">
                      Buy Now
                    </span>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <Link to="/events" className="px-10 py-4 rounded bg-white border-2 border-brand-navy text-brand-navy font-bold uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all duration-300 inline-flex items-center group shadow-xl hover:shadow-2xl hover:shadow-brand-navy/20">
            See More Events
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;
