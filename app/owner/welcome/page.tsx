"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChefHat, Sparkles, TrendingUp, ArrowRight, Check, Loader2 } from 'lucide-react';

const OwnerWelcomePage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userPlan, setUserPlan] = useState('starter');

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        
        console.log('Welcome page - Fetching data for:', userEmail);
        
        if (!userEmail) {
          console.log('No email found, redirecting to login');
          router.push('/login');
          return;
        }

        const { data: userData, error } = await supabase
          .from('users')
          .select('restaurant_name, plan, email, first_login')
          .eq('email', userEmail)
          .single();

        console.log('Welcome page - User data:', userData);
        console.log('Welcome page - first_login value:', userData?.first_login);

        if (error || !userData) {
          console.error('Error fetching user data:', error);
          router.push('/login');
          return;
        }

        // If first_login is false, redirect to dashboard immediately
        if (userData.first_login === false) {
          console.log('User already completed welcome, redirecting to dashboard');
          const plan = userData.plan || 'starter';
          router.push(`/owner/dashboard/${plan}`);
          return;
        }

        setRestaurantName(userData.restaurant_name || '');
        setUserPlan(userData.plan || 'starter');
        
      } catch (error) {
        console.error('Error in fetchOwnerData:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [router, supabase]);

  const slides = [
    {
      icon: <ChefHat className="w-16 h-16 sm:w-20 sm:h-20" />,
      color: "from-blue-500 to-blue-600",
      title: "Welcome to Eatnify",
      description: "Your all-in-one restaurant management platform. Transform your restaurant experience with powerful tools.",
      features: ["Menu Management", "Order Tracking", "Analytics Dashboard"]
    },
    {
      icon: <Sparkles className="w-16 h-16 sm:w-20 sm:h-20" />,
      color: "from-blue-500 to-blue-600",
      title: "Manage Your Menu",
      description: "Create, update, and organize your menu effortlessly. Add photos, descriptions, and pricing in seconds.",
      features: ["Drag & Drop", "Real-time Updates", "Photo Gallery"]
    },
    {
      icon: <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20" />,
      color: "from-blue-500 to-blue-600",
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions, optimize pricing, and gain insights to grow your restaurant business.",
      features: ["Smart Analytics", "Price Optimization", "Customer Insights"]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGetStarted = async () => {
    if (!restaurantName.trim()) {
      alert('Please enter your restaurant name');
      return;
    }

    setSubmitting(true);
    try {
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
      
      console.log('=== UPDATING USER DATA ===');
      console.log('Email:', userEmail);
      console.log('Restaurant name:', restaurantName.trim());
      console.log('Setting first_login to: false');
      
      const { data, error } = await supabase
        .from('users')
        .update({
          restaurant_name: restaurantName.trim(),
          first_login: false
        })
        .eq('email', userEmail)
        .select();

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Update error:', error);
        alert(`Failed to update: ${error.message}`);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No rows updated');
        alert('Failed to update user data. Please try again.');
        return;
      }

      console.log('Successfully updated. New first_login value:', data[0].first_login);
      console.log('Redirecting to dashboard:', userPlan);
      
      // Small delay to ensure database update is complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push(`/owner/dashboard/${userPlan}`);
      
    } catch (error) {
      console.error('Error updating owner data:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white/80 text-base">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 sm:p-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide">EATNIFY</h1>
            <p className="text-blue-50 text-xs sm:text-sm mt-1">Restaurant Management Suite</p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3 pt-6 sm:pt-8 pb-4 sm:pb-6 px-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                  index === currentSlide 
                    ? 'w-8 sm:w-12 bg-blue-500 shadow-lg shadow-blue-500/50' 
                    : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/40 active:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8">
            <div className="min-h-[350px] sm:min-h-[400px] flex flex-col items-center">
              <div className="relative mb-6 sm:mb-8">
                <div className={`absolute -inset-3 sm:-inset-4 bg-gradient-to-r ${currentSlideData.color} rounded-2xl sm:rounded-3xl blur-xl opacity-30`}></div>
                <div className={`relative bg-gradient-to-r ${currentSlideData.color} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl text-white`}>
                  {currentSlideData.icon}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 text-center px-2">
                {currentSlideData.title}
              </h2>
              <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-2xl mb-6 sm:mb-8 px-2">
                {currentSlideData.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mb-6 sm:mb-8">
                {currentSlideData.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 active:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`bg-gradient-to-r ${currentSlideData.color} p-1.5 sm:p-2 rounded-md sm:rounded-lg flex-shrink-0`}>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-white font-medium text-xs sm:text-sm">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>

              {currentSlide === slides.length - 1 && (
                <div className="w-full max-w-md animate-fadeIn">
                  <label className="block text-white font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                    🏪 What's your restaurant name?
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g., The Golden Spoon"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder-white/40 text-base sm:text-lg font-medium outline-none"
                  />
                  <p className="text-white/50 text-xs sm:text-sm mt-2">Your plan: <span className="font-semibold text-white/80">{userPlan}</span></p>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 sm:px-8 md:px-12 lg:px-16 pb-6 sm:pb-8">
            <div className="flex justify-between items-center gap-3 sm:gap-4">
              {currentSlide > 0 ? (
                <button
                  onClick={handlePrev}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-white/70 hover:text-white active:text-white font-medium transition-all hover:bg-white/10 active:bg-white/10 rounded-lg sm:rounded-xl touch-manipulation min-h-[44px]"
                >
                  ← Back
                </button>
              ) : (
                <div></div>
              )}
              
              <div className="ml-auto">
                {currentSlide < slides.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-blue-600 active:from-blue-700 active:to-blue-600 transition-all flex items-center gap-2 sm:gap-3 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 touch-manipulation min-h-[44px] text-sm sm:text-base"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleGetStarted}
                    disabled={submitting || !restaurantName.trim()}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-blue-600 active:from-blue-700 active:to-blue-600 transition-all flex items-center gap-2 sm:gap-3 font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-xl hover:shadow-blue-500/40 touch-manipulation min-h-[44px] text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="hidden sm:inline">Setting up...</span>
                        <span className="sm:hidden">Wait...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Go to Dashboard</span>
                        <span className="sm:hidden">Get Started</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        @media (max-width: 640px) {
          button {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerWelcomePage;