import React from 'react';

const FeaturesSection = () => {
  const events = [
    {
      title: 'Entomology International Congress of Vancouver',
      date: 'Fri, 15 Sep 2023',
      vendor: 'Set Your Vendor',
      image: 'https://images.unsplash.com/photo-1540511546273-6c6a1e5d338c?w=600&h=400&fit=crop'
    },
    {
      title: 'Success Free Career & Meditation Classes',
      date: 'Fri, 10 Nov 2023',
      vendor: 'Set Your Vendor',
      image: 'https://images.unsplash.com/photo-1523580494112-071d1694057c?w=600&h=400&fit=crop'
    },
    {
      title: 'Career Fair: Exclusive Hiring Event-New',
      date: 'Thu, 26 Oct 2023',
      vendor: 'Set Your Vendor',
      image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=600&h=400&fit=crop'
    },
    {
      title: 'Symposiums Chemotherapy Foundation Symposiums',
      date: 'Mon, 02 Dec 2024',
      vendor: 'Set Your Vendor',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
    },
    {
      title: 'Vancouver International Congress of Entomology',
      date: 'Fri, 27 Oct 2023',
      vendor: 'Set Your Vendor',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop'
    },
    {
      title: 'Modern Marketing Expo in for the Business Owner',
      date: 'Fri, 15 Sep 2023',
      vendor: 'Set Your Vendor',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50 relative">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h3 className="font-script text-3xl md:text-4xl text-brand-pink mb-2 tracking-wide transform -rotate-2">
            Upcoming Event
          </h3>
          <h2 className="text-4xl md:text-[44px] font-bold text-brand-navy tracking-tight">
            Featured Events
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group cursor-pointer border border-gray-100/50">
              
              {/* Event Image */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Event Content */}
              <div className="p-7 flex flex-col flex-grow">
                
                <h3 className="text-[17px] font-bold text-brand-navy leading-snug mb-5 min-h-[48px]">
                  {event.title}
                </h3>
                
                <div className="flex items-center text-sm font-medium text-gray-500 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {event.date}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-semibold mb-1">Organized By</span>
                    <span className="text-sm font-medium text-brand-pink">{event.vendor}</span>
                  </div>
                  
                  <button className="px-5 py-2 rounded border border-brand-navy text-brand-navy text-[13px] font-bold uppercase tracking-wider hover:bg-brand-navy hover:text-white transition-colors duration-300">
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="mt-16 text-center">
          <button className="px-8 py-3.5 rounded border border-brand-navy text-brand-navy text-sm font-bold uppercase tracking-wider hover:bg-brand-navy hover:text-white transition-colors duration-300 inline-flex items-center group">
            See More Event
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
