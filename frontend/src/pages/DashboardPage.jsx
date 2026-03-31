import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('My Purchased Tickets');

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-brand-navy">
      <div className="bg-brand-primary pb-10">
        <Header />
      </div>

      <main className="flex-grow pt-10 pb-20 max-w-[1400px] mx-auto px-6 w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-white p-6 rounded-2xl shadow-xl shadow-brand-navy/5 border border-gray-100 flex flex-col">
           <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100/50">
             <div className="w-12 h-12 rounded-full bg-brand-pink text-white font-bold text-xl flex items-center justify-center mb-3">
               JS
             </div>
             <h3 className="font-bold">John Smith</h3>
             <p className="text-sm text-gray-500">john.smith@example.com</p>
           </div>

           <nav className="flex-grow space-y-1">
             {['Overview', 'My Purchased Tickets', 'Manage Events', 'Vendor Earnings', 'Settings'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${activeTab === tab ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                 {tab}
               </button>
             ))}
           </nav>

           <div className="mt-8 pt-6 border-t border-gray-100">
             <Link to="/" className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
               Sign Out
             </Link>
           </div>
        </aside>


        {/* Main Content Area */}
        <div className="flex-grow">
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-brand-navy/5 border border-gray-100 min-h-[500px]">
            <h2 className="text-3xl font-bold mb-8 font-script text-brand-pink tracking-wide">{activeTab}</h2>
            
            {activeTab === 'My Purchased Tickets' && (
              <div className="space-y-4">
                <div className="border border-gray-100 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center shadow-sm">
                  <div className="w-full md:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1540511546273-6c6a1e5d338c?w=200&h=200&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-lg mb-1">Entomology International Congress</h4>
                    <p className="text-gray-500 text-sm mb-3">Fri, 15 Sep 2023 • Vancouver Convention Centre</p>
                    <div className="flex gap-2">
                       <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Confirmed</span>
                       <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded">Qty: 2</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    <button className="px-5 py-2 border border-brand-primary text-brand-primary rounded font-bold text-xs uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-colors">
                      View Ticket
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'My Purchased Tickets' && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-700 text-lg">No data available yet</h4>
                <p className="text-gray-500 font-medium">This section is currently under construction.</p>
              </div>
            )}

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
