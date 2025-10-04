"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const OwnerEntryPage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [status, setStatus] = useState('Checking authentication...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    const checkAndRedirect = async () => {
      try {
        setStatus('Verifying login...');
        setProgress(20);
        
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('userLoggedIn') : null;
        
        console.log('=== ENTRY PAGE CHECK ===');
        console.log('User email:', userEmail);
        console.log('Is logged in:', isLoggedIn);
        
        if (!userEmail || isLoggedIn !== 'true') {
          console.log('Not logged in, redirecting to login');
          setStatus('Not authenticated. Redirecting to login...');
          setTimeout(() => router.push('/login'), 1000);
          return;
        }

        setStatus('Loading your account...');
        setProgress(40);
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('email, payment_status, first_login, plan, restaurant_name')
          .eq('email', userEmail)
          .single();

        console.log('Database response:', { userData, error });
        console.log('first_login value:', userData?.first_login, 'Type:', typeof userData?.first_login);

        if (error || !userData) {
          console.error('User data fetch error:', error);
          setStatus('Account not found. Redirecting...');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userLoggedIn');
          }
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        setProgress(60);

        console.log('Payment status:', userData.payment_status);
        if (userData.payment_status !== 'success') {
          console.log('Payment not successful, redirecting to pricing');
          setStatus('Payment verification needed...');
          setProgress(80);
          setTimeout(() => router.push('/pricing'), 1500);
          return;
        }

        setProgress(80);
        setStatus('Almost there...');
        setProgress(100);
        
        // IMPORTANT: Check if first_login is exactly true
        // If it's false or null, user has already completed welcome
        console.log('Checking first_login status...');
        
        if (userData.first_login === true) {
          console.log('✓ First login detected (value is true) - Going to welcome page');
          setStatus('Welcome! Setting up your account...');
          setTimeout(() => router.push('/owner/welcome'), 800);
        } else {
          console.log('✓ Returning user (first_login is', userData.first_login, ') - Going to dashboard');
          const plan = userData.plan || 'starter';
          setStatus('Taking you to your dashboard...');
          setTimeout(() => router.push(`/owner/dashboard/${plan}`), 1000);
        }
        
      } catch (error) {
        console.error('Redirect error:', error);
        setStatus('Something went wrong. Please try again...');
        setProgress(0);
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userLoggedIn');
          }
          router.push('/login');
        }, 2000);
      }
    };

    checkAndRedirect();

    return () => clearInterval(progressInterval);
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-2xl">
                <span className="text-white font-bold text-2xl sm:text-3xl tracking-wide">EATNIFY</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-white/5 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 sm:mb-3">
            Welcome Back
          </h2>

          <p className="text-white/70 text-center text-base sm:text-lg mb-5 sm:mb-6 min-h-[24px] sm:min-h-[28px]">
            {status}
          </p>

          <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 mb-5 sm:mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/30"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-center space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
            <p className="text-white/50 text-center text-xs sm:text-sm">
              Securing your session...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerEntryPage;