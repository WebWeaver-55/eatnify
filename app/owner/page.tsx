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
    // Simulate progress bar
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
        // Step 1: Check localStorage for login status
        setStatus('Verifying login...');
        setProgress(20);
        const userEmail = localStorage.getItem('userEmail');
        const isLoggedIn = localStorage.getItem('userLoggedIn');
        
        console.log('Checking login:', { userEmail, isLoggedIn });
        
        if (!userEmail || isLoggedIn !== 'true') {
          console.log('Not logged in, redirecting to login');
          setStatus('Not authenticated. Redirecting to login...');
          setTimeout(() => router.push('/login'), 1000);
          return;
        }

        // Step 2: Get user data from 'users' table
        setStatus('Loading your account...');
        setProgress(40);
        const { data: userData, error } = await supabase
          .from('users')
          .select('email, payment_status, first_login, plan')
          .eq('email', userEmail)
          .single();

        console.log('Database check:', { userData, error });

        if (error || !userData) {
          console.error('User data fetch error:', error);
          setStatus('Account not found. Redirecting...');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userLoggedIn');
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        setProgress(60);

        // Step 3: Verify payment
        console.log('Payment status:', userData.payment_status);
        if (userData.payment_status !== 'success') {
          console.log('Payment not successful, redirecting to pricing');
          setStatus('Payment verification needed...');
          setProgress(80);
          setTimeout(() => router.push('/pricing'), 1500);
          return;
        }

        setProgress(80);

        // Step 4: Check first login
        setStatus('Almost there...');
        console.log('First login:', userData.first_login);
        
        setProgress(100);
        
        if (userData.first_login === true) {
          console.log('First login detected, redirecting to welcome');
          setStatus('Welcome! Setting up your account...');
          setTimeout(() => router.push('/owner/welcome'), 800);
        } else {
          // Redirect to plan-specific dashboard
          const plan = userData.plan || 'starter';
          console.log('Redirecting to dashboard:', plan);
          setStatus('Taking you to your dashboard...');
          setTimeout(() => router.push(`/owner/dashboard/${plan}`), 800);
        }
      } catch (error) {
        console.error('Redirect error:', error);
        setStatus('Something went wrong. Please try again...');
        setProgress(0);
        setTimeout(() => {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userLoggedIn');
          router.push('/login');
        }, 2000);
      }
    };

    checkAndRedirect();

    return () => clearInterval(progressInterval);
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-2xl px-8 py-4 shadow-2xl">
                <span className="text-white font-bold text-3xl tracking-wider">EATNIFY</span>
              </div>
            </div>
          </div>

          {/* Spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-400 border-r-purple-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-white/10 rounded-full"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white text-center mb-3">
            Welcome Back
          </h2>

          {/* Status message */}
          <p className="text-blue-200 text-center text-lg mb-6 min-h-[28px]">
            {status}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Additional info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/60 text-center text-sm">
              Securing your session...
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
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
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default OwnerEntryPage;