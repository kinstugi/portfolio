import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../config/api';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const userId = searchParams.get('userId');

    if (!token) {
      setError('Authentication failed. No token received.');
      setLoading(false);
      setTimeout(() => navigate('/signin'), 3000);
      return;
    }

    try {
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        userId: userId || '',
      }));

      // Check if user has a resume - if not, redirect to onboarding (if it exists)
      // For now, just redirect to dashboard
      apiClient.get('/resume/last')
        .then(() => {
          // User has a resume, go to dashboard
          navigate('/dashboard');
        })
        .catch((err) => {
          // User doesn't have a resume (404) or other error
          // For now, redirect to dashboard. Add onboarding redirect when implemented
          navigate('/dashboard');
        });
    } catch (err) {
      console.error('Error processing authentication callback:', err);
      setError('An error occurred during authentication. Please try again.');
      setLoading(false);
      setTimeout(() => navigate('/signin'), 3000);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default AuthCallback;

