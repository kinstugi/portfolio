import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../config/api';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
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
      const response = await apiClient.post('/auth/register', formData);
      
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        userId: response.data.userId,
      }));

      // New users never have a resume, so always go to onboarding
      navigate('/onboarding');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">SerKo</h1>
          <p className="text-gray-400 text-sm">Create your account</p>
        </Link>

        {/* Signup Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name Field */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="John"
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Doe"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="At least 6 characters"
              />
              <p className="mt-1 text-xs text-gray-400">Minimum 6 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

