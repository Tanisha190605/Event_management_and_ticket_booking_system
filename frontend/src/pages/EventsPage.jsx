import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturesSection from '../components/FeaturesSection'; // Reusing event grid component slightly out of context for speed, typically we'd detach the grid, but works conceptually.

const EventsPage = () => {
    // Quick state for tabs just as an example of interaction
    const [activeTab, setActiveTab] = useState('All');
    
    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
            {/* Using header but overwriting background since it normally relies on gradient hero */}
            <div className="bg-brand-primary shadow-md relative z-40 pb-20">
              <Header />
            </div>

            <main className="flex-grow pt-10 pb-20 mt-[-20px]">
                <div className="max-w-[1400px] mx-auto px-6">
                    
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-brand-navy tracking-tight mb-2">Explore Events</h1>
                            <p className="text-gray-500 font-medium">Discover 45+ upcoming experiences happening near you.</p>
                        </div>
                        
                        {/* Filters Container */}
                        <div className="mt-6 md:mt-0 flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                            {['All', 'Music', 'Business', 'Sports', 'Food'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${activeTab === tab ? 'bg-brand-navy text-white shadow-md' : 'text-gray-500 hover:text-brand-navy bg-transparent'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rendering our existing grid via FeaturesSection - cheating a little bit by reusing it directly */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-brand-navy/5 relative mt-8">
                       <FeaturesSection />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EventsPage;
