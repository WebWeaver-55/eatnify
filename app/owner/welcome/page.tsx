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
        // Get user email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        
        console.log('Fetching owner data for:', userEmail);
        
        if (!userEmail) {
          console.log('No user email found, redirecting to login');
          router.push('/login');
          return;
        }

        const { data: userData, error } = await supabase
          .from('users')
          .select('restaurant_name, plan, email')
          .eq('email', userEmail)
          .single();

        console.log('User data fetched:', { userData, error });

        if (error || !userData) {
          console.error('Error fetching user data:', error);
          router.push('/login');
          return;
        }

        setRestaurantName(userData.restaurant_name || '');
        setUserPlan(userData.plan || 'starter');
        
        console.log('User plan set to:', userData.plan || 'starter');
        
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
      icon: <ChefHat className="w-20 h-20" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      title: "Welcome to Eatnify",
      description: "Your all-in-one restaurant management platform. Let's get you started on transforming your restaurant experience.",
      features: ["Menu Management", "Order Tracking", "Analytics Dashboard"]
    },
    {
      icon: <Sparkles className="w-20 h-20" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      title: "Manage Your Menu Easily",
      description: "Create, update, and organize your menu in seconds. Add photos, descriptions, and pricing with just a few clicks.",
      features: ["Drag & Drop Interface", "Real-time Updates", "Photo Gallery"]
    },
    {
      icon: <TrendingUp className="w-20 h-20" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      title: "AI-Powered Insights",
      description: "Get intelligent menu suggestions, optimize pricing, and gain insights to grow your restaurant business.",
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
      const userEmail = localStorage.getItem('userEmail');
      
      console.log('Updating restaurant name for:', userEmail);
      console.log('Restaurant name:', restaurantName.trim());
      
      // Update restaurant name and first_login status in users table
      const { data, error } = await supabase
        .from('users')
        .update({
          restaurant_name: restaurantName.trim(),
          first_login: false
        })
        .eq('email', userEmail)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Current user plan:', userPlan);
      console.log('Redirecting to:', `/owner/dashboard/${userPlan}`);
      
      // Redirect to plan-specific dashboard
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-400 border-r-purple-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with logo */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-6 text-center">
            <div className="inline-block">
              <h1 className="text-4xl font-bold text-white tracking-wider">EATNIFY</h1>
              <p className="text-blue-100 text-sm mt-1">Restaurant Management Suite</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-3 pt-8 pb-6 px-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-12 bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg' 
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="px-8 sm:px-12 lg:px-16 py-8">
            <div className="min-h-[400px] flex flex-col items-center">
              {/* Icon with gradient background */}
              <div className={`relative mb-8 group cursor-pointer`}>
                <div className={`absolute -inset-4 bg-gradient-to-r ${currentSlideData.color} rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                <div className={`relative bg-gradient-to-r ${currentSlideData.color} p-6 rounded-2xl shadow-2xl text-white transform group-hover:scale-110 transition-transform duration-300`}>
                  {currentSlideData.icon}
                </div>
              </div>

              {/* Title and description */}
              <h2 className="text-4xl font-bold text-white mb-4 text-center">
                {currentSlideData.title}
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed text-center max-w-2xl mb-8">
                {currentSlideData.description}
              </p>

              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
                {currentSlideData.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-r ${currentSlideData.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium text-sm">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Restaurant name input (last slide) */}
              {currentSlide === slides.length - 1 && (
                <div className="w-full max-w-md animate-fadeIn">
                  <label className="block text-white font-semibold mb-3 text-lg">
                    🏪 What's your restaurant name?
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g., The Golden Spoon"
                    className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 transition-all text-white placeholder-white/50 text-lg font-medium"
                  />
                  <p className="text-white/60 text-sm mt-2">Your plan: <span className="font-semibold text-white">{userPlan}</span></p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="px-8 sm:px-12 lg:px-16 pb-8 flex justify-between items-center gap-4">
            {currentSlide > 0 ? (
              <button
                onClick={handlePrev}
                className="px-6 py-3 text-white/80 hover:text-white font-medium transition-all hover:bg-white/10 rounded-xl"
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
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-3 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleGetStarted}
                  disabled={submitting || !restaurantName.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-3 font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 transform"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }
        
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
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OwnerWelcomePage;