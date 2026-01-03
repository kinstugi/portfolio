import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

function PasswordResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    console.log('Password reset requested for:', email);
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

      {/* Main Content - Password Reset Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Password Reset</h1>

          <p className="text-gray-600 text-center mb-8">
            Forgot your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            {/* Send Password Reset Button */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              Send Password Reset
            </button>

            {/* Help Text */}
            <p className="text-sm text-gray-600 text-center">
              Please contact us if you have any trouble resetting your password.
            </p>
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

export default PasswordResetPage;

