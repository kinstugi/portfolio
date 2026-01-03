import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../config/api';

function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        userId: response.data.userId,
      }));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      
      // Handle different error scenarios
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (err.response?.status === 401 || err.response?.status === 404) {
        errorMessage = 'Login failed. Please check your credentials and try again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === 'Network Error' || !err.response) {
        errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
      }
      
      console.log('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">MyCVgo</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Home</Link>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Blog</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Pricing</a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Language Dropdown */}
              <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-gray-900 transition-colors">
                <span className="text-gray-700 font-medium">English</span>
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Sign In Button */}
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                Sign In
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 rounded-lg transition-colors shadow-md"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Sign In Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="test@email.com"
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/password-reset" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={() => {
                // Redirect to backend Google OAuth endpoint
                window.location.href = 'http://localhost:5005/api/auth/google';
              }}
              className="w-full px-4 py-3 bg-white border-2 border-purple-200 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Mail me a sign-in code Link */}
            <div className="text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Mail me a sign-in code
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Cookie Policy
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2026 MyCVgo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SignInPage;

