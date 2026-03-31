import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EventDetailsPage = () => {
  const { id } = useParams();

  // Mock data for the specific event ID
  const event = {
    title: 'Success Free Career & Meditation Classes',
    date: 'Fri, 10 Nov 2023 at 6:00 PM',
    location: 'Vancouver Convention Centre, Canada',
    vendor: 'Zen Life Institute',
    description: 'Join us for a transformative evening of career guidance coupled with deep mindfulness meditation. Discover how finding your inner peace can accelerate your professional growth and help you avoid burnout in today\'s fast-paced corporate environment.',
    price: '$45.00',
    coverImage: 'https://images.unsplash.com/photo-1523580494112-071d1694057c?w=1200&h=500&fit=crop'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      
      {/* Absolute Header - requires transparent bg on top of hero */}
      <Header />

      <main className="flex-grow">
        
        {/* Massive Hero Cover Image */}
        <div className="relative h-[500px] w-full bg-brand-navy">
          <img 
            src={event.coverImage} 
            alt={event.title} 
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-primary/40"></div>
          
          <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-6 pb-12">
            <div className="flex items-center text-brand-secondary font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="bg-brand-secondary/20 px-3 py-1 rounded text-white border border-brand-secondary/30 backdrop-blur-sm">
                Wellness & Career
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight max-w-4xl leading-tight">
              {event.title}
            </h1>
            <p className="text-xl text-gray-300 font-medium">By {event.vendor}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
          
          {/* Main Column */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">About this event</h3>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {event.description}
            </p>
            <p className="text-gray-600 leading-relaxed mb-12 text-lg">
              Our expert speakers will share actionable strategies to map out your career trajectory while teaching fundamental meditation techniques that can be done at your desk. Whether you're feeling stuck in your current role or preparing for a major transition, this session is designed to center your mind and clarify your goals.
            </p>

            <h3 className="text-xl font-bold text-brand-navy mb-6">Location</h3>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">{event.location}</h4>
                <p className="text-gray-500 text-sm mt-1">1055 Canada Pl, Vancouver, BC V6C 0C3</p>
                <button className="text-brand-primary text-sm font-semibold mt-3 hover:underline">View on Map</button>
              </div>
            </div>
          </div>

          {/* Sticky Checkout Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-xl shadow-brand-navy/5 border border-gray-100">
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Price starting at</p>
                <h2 className="text-4xl font-bold text-brand-navy">{event.price}</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="font-medium">Mobile eTicket</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-lg bg-brand-primary text-white font-bold text-lg hover:bg-brand-dark transition-colors duration-300 shadow-lg shadow-brand-primary/30 mb-4">
                Tickets Options
              </button>
              
              <div className="text-center">
                <Link to="/auth" className="text-sm font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                  Login to save to favorites
                </Link>
              </div>
            </div>
          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
};

export default EventDetailsPage;
