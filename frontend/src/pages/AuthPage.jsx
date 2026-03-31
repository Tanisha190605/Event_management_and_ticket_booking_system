import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy authentication success routing
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex text-brand-navy font-sans bg-white relative">
      
      {/* Return to home absolute link */}
      <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white font-bold hover:text-brand-secondary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      {/* Left Artistic Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-primary via-[#6b21a8] to-brand-secondary/40 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Shapes identical to Hero Section */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/40 rounded-full blur-3xl opacity-60 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-pink/30 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="flex justify-center mb-6">
             <div className="w-16 h-16 rounded-full bg-white text-brand-primary flex items-center justify-center font-bold text-4xl font-script tracking-tighter italic shadow-2xl">
              e
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">EventPlace Network</h2>
          <p className="text-lg text-white/80 max-w-md mx-auto font-medium">
            Join the world's most vibrant community of creators and attendees. Manage tickets, build your audience, and host unforgettable experiences.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/30">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-brand-navy/5 border border-gray-100">
          
          <h2 className="text-3xl font-bold text-brand-navy mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey with EventPlace today.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium placeholder-gray-400"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium placeholder-gray-400"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                {isLogin && <a href="#" className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">Forgot password?</a>}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium placeholder-gray-400"
                required
              />
            </div>

            <button type="submit" className="w-full py-3.5 rounded-lg bg-brand-navy text-white font-bold tracking-wide hover:bg-brand-primary transition-colors duration-300 shadow-lg shadow-brand-navy/20 mt-2">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm font-medium text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="font-bold text-brand-primary hover:text-brand-dark transition-colors"
              >
                {isLogin ? 'Create one now' : 'Sign in here'}
              </button>
            </p>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default AuthPage;
