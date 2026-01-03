import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm">
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
              onClick={handleSignIn}
              className="px-4 py-2 text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors"
            >
              Sign In
            </button>

            {/* Sign Up Button */}
            <button
              onClick={handleSignUp}
              className="px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 rounded-lg transition-colors shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

