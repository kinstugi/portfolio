import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">SerKo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="text-gray-300 hover:text-white px-4 py-2 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleSignUp}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Section */}
          <div className="text-white">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Your next <span className="text-emerald-400">career</span>{' '}
              <span className="text-blue-400">move</span> starts{' '}
              <span className="text-emerald-400">here</span>
            </h1>

            {/* Body Text */}
            <div className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl space-y-4">
              <p>
                Stop searching. Start preparing. Finding your next role shouldn't be a struggle. With Serko, you get a dedicated AI powerhouse. Our agent <span className="font-semibold text-blue-400">Serwaa</span> perfects your application materials in seconds, and <span className="font-semibold text-emerald-400">Konadu</span> proactively applies to the best matches on LinkedIn and Indeed for you.
              </p>
              <p className="font-medium">
                Reclaim your time and focus on what matters most: acing the interview.
              </p>
            </div>


            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={handleSignUp}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Get Started Free
              </button>
              <button
                onClick={handleLogin}
                className="bg-slate-800/70 hover:bg-slate-700 text-white border-2 border-slate-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Footer Statistics */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.9/5</p>
                  <p className="text-sm text-gray-400">rating</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">150+</p>
                  <p className="text-sm text-gray-400">companies</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">95%</p>
                  <p className="text-sm text-gray-400">success rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="relative lg:min-h-[600px]">
            {/* Main Image Container */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Professional Image */}
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src="/serko_image.png" 
                    alt="Professional woman at work" 
                    className="w-full h-full object-cover"
                  />
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
                </div>

                {/* Callout Box - Salary Increase */}
                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700 shadow-xl max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">85% Salary Increase</p>
                      <p className="text-gray-400 text-sm">Average after job switch</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Profile Picture - Bottom Right */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Build Your Digital Profile</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Sign up and upload your current CV. Our system instantly extracts your experience, achievements, and technical skills to create a high-performance data profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-purple-400">2</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Connect Your Channels</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Securely link your LinkedIn and Indeed accounts. This allows your personal AI team to navigate the job market exactly as you would—only faster.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-emerald-500/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-emerald-400">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Meet Your AI Team</h3>
              </div>
              <div className="text-gray-300 leading-relaxed space-y-3">
                <p>
                  <span className="font-semibold text-emerald-400">Agent Konadu</span> scans thousands of listings to find roles that actually match your expertise.
                </p>
                <p>
                  <span className="font-semibold text-blue-400">Agent Serwaa</span> then crafts a bespoke resume and cover letter for every single lead, ensuring you pass the initial recruiter filters.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-green-400">4</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Review & Launch</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                We never send anything without your "OK." Review the tailored documents in your dashboard, hit Approve, and <span className="font-semibold text-emerald-400">Konadu</span> will automatically submit the application for you.
              </p>
            </div>
          </div>
        </div>

        
        
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">SerKo</h3>
            <p className="text-gray-400 text-sm mb-4">
              Serwaa & Konadu - Your AI Job Search Partners
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} SerKo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
