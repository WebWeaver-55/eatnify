import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const ProtectedOwnerLayout = ({ children, skipWelcomeCheck = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in (replace with your auth logic)
        const user = await checkUserAuth(); // Your Supabase auth check
        
        if (!user) {
          router.push('/login');
          return;
        }

        // Check payment status
        const { data: ownerData } = await supabase
          .from('users')
          .select('payment_status, first_login, plan')
          .eq('user_id', user.id)
          .single();

        if (!ownerData || ownerData.payment_status !== 'success') {
          router.push('/access-denied');
          return;
        }

        // If first login and not on welcome page, redirect to welcome
        if (!skipWelcomeCheck && ownerData.first_login) {
          router.push('/owner/welcome');
          return;
        }

        // All checks passed
        setAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, skipWelcomeCheck]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedOwnerLayout;

// Helper function - replace with your actual Supabase auth
async function checkUserAuth() {
  // Example:
  // const { data: { user } } = await supabase.auth.getUser();
  // return user;
  
  // For demo purposes:
  return { id: 'demo-user-id' };
}