"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, AlertTriangle } from 'lucide-react';

export default function GrowthDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user is logged in
        const userEmail = localStorage.getItem('userEmail');
        const isLoggedIn = localStorage.getItem('userLoggedIn');

        if (!userEmail || isLoggedIn !== 'true') {
          console.log('Not logged in, redirecting to login');
          router.push('/login');
          return;
        }

        // Get user data from database
        const { data: user, error } = await supabase
          .from('users')
          .select('email, plan, restaurant_name, payment_status')
          .eq('email', userEmail)
          .single();

        console.log('User data:', user);

        if (error || !user) {
          console.error('Error fetching user:', error);
          router.push('/login');
          return;
        }

        // Check if payment is successful
        if (user.payment_status !== 'success') {
          router.push('/pricing');
          return;
        }

        // Check if user has access to growth plan
        if (user.plan !== 'growth') {
          console.log(`User has ${user.plan} plan, cannot access growth dashboard`);
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // User is authorized
        setUserData(user);
        setAuthorized(true);
        setLoading(false);

      } catch (error) {
        console.error('Access check error:', error);
        router.push('/login');
      }
    };

    checkAccess();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the Growth dashboard.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">
              This dashboard is only available for Growth plan users.
            </p>
          </div>
          <button
            onClick={() => router.push('/owner')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {userData?.restaurant_name || 'Your Restaurant'}
              </h1>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Growth Plan
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userLoggedIn');
                router.push('/login');
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Menu Items</h3>
            <p className="text-4xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-blue-600">$0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Growth Dashboard!</h2>
          <p className="text-gray-600">
            Unlock advanced features with your Growth plan.
          </p>
        </div>
      </div>
    </div>
  );
}