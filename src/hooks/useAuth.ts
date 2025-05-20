import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth(options: { 
  redirectIfAuthenticated?: string;
  redirectIfUnauthenticated?: string;
} = {}) {
  const { 
    redirectIfAuthenticated, 
    redirectIfUnauthenticated 
  } = options;
  
  const { 
    isAuthenticated, 
    login, 
    signup, 
    logout,
    user,
    token,
    isLoading,
    error,
    clearError
  } = useAuthStore();
  
  const router = useRouter();
  
  useEffect(() => {
    if (redirectIfAuthenticated && isAuthenticated()
    ) {
      router.push(redirectIfAuthenticated);
    } else if (redirectIfUnauthenticated && !isAuthenticated()) {
      router.push(redirectIfUnauthenticated);
    }
  }, [isAuthenticated, redirectIfAuthenticated, redirectIfUnauthenticated, router]);
  
  return { 
    isAuthenticated, 
    login, 
    signup, 
    logout,
    user,
    token,
    isLoading,
    error,
    clearError
  };
}

export default useAuth;