import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="modern-typography custom-theme">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-custom-light">
        <div className="grid max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:px-12 lg:grid-cols-12">
          <div className="lg:mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 modern-heading-1 text-custom-black">
              Create Your Perfect CV in{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                backgroundClip: 'text' 
              }}>
                Minutes
              </span>
            </h1>
            <p className="max-w-2xl mb-6 modern-body-large text-custom-dark lg:mb-8">
              Stop struggling with outdated CV templates. Our AI-powered platform helps you craft a professional, eye-catching resume that gets you noticed by recruiters.
            </p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link 
                to="/signup" 
                className="px-6 py-3 text-base font-medium text-custom-light modern-header-gradient rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center"
              >
                Get started
              </Link>
              <Link 
                to="/signin" 
                className="px-6 py-3 text-base font-medium text-custom-black hover:text-custom-dark hover:bg-custom-blue-light border border-black hover:border-custom-dark rounded-lg transition-all duration-200 text-center"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/images/rocket-laptop.svg" alt="Fly Away!" />
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-custom-light">
        <div className="py-8 px-4 mx-auto max-w-7xl sm:py-16 lg:px-6 text-custom-black">
          <div className="mx-auto text-center max-w-3xl mb-8 lg:mb-16">
            <h2 className="modern-label text-black">Why Choose MyCVgo</h2>
            <h2 className="mt-2 mb-4 modern-heading-2 text-custom-black">
              Everything you need to land your dream job
            </h2>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            {/* Feature 1 */}
            <div className="grid grid-cols-6 lg:grid-cols-1">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-custom-blue-light lg:h-12 lg:w-12">
                <svg className="h-5 w-5 lg:w-6 lg:h-6 flex-none text-custom-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div className="col-span-5 lg:col-span-0">
                <h3 className="mb-2 modern-heading-3 text-custom-black">AI-Powered Assistance</h3>
                <p className="modern-body text-custom-dark">Get personalized suggestions and content optimization powered by advanced AI technology</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="grid grid-cols-6 lg:grid-cols-1">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-custom-blue-light lg:h-12 lg:w-12">
                <svg className="h-5 w-5 lg:w-6 lg:h-6 flex-none text-custom-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div className="col-span-5 lg:col-span-0">
                <h3 className="mb-2 modern-heading-3 text-custom-black">Lightning Fast</h3>
                <p className="modern-body text-custom-dark">Create a professional CV in under 10 minutes with our streamlined, user-friendly interface</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="grid grid-cols-6 lg:grid-cols-1">
              <div className="flex justify-center items-center w-10 h-10 rounded-full bg-custom-blue-light lg:h-12 lg:w-12">
                <svg className="h-5 w-5 lg:w-6 lg:h-6 flex-none text-custom-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  <path d="M8 12l2 2 4-4"></path>
                </svg>
              </div>
              <div className="col-span-5 lg:col-span-0">
                <h3 className="mb-2 modern-heading-3 text-custom-black">Affordable Excellence</h3>
                <p className="modern-body text-custom-dark">Access premium CV creation tools at competitive prices that won't break your budget</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Technology Section */}
      <section className="bg-custom-light">
        <div className="overflow-hidden py-12" id="section1">
          <div className="py-8 px-4 mx-auto max-w-7xl sm:py-16 lg:px-6 text-custom-black">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
              <div className="space-y-8">
                <div className="max-w-3xl mb-8 lg:mb-8">
                  <h2 className="modern-label text-black">AI-Powered CV Creation</h2>
                  <p className="mt-2 modern-heading-2 text-custom-black">Smart technology meets professional design</p>
                  <p className="mt-6 modern-body-large text-custom-dark">
                    Our advanced AI analyzes your experience and suggests the perfect content to make your CV stand out. No more guessing what recruiters want to see.
                  </p>
                </div>
                {/* ListItem 1 */}
                <div className="grid grid-cols-6">
                  <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-custom-blue-light lg:h-12 lg:w-12">
                    <svg className="h-5 w-5 flex-none text-custom-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                  </div>
                  <div className="col-span-5">
                    <h3 className="mb-2 modern-heading-3 text-custom-black">Professional Templates</h3>
                    <p className="modern-body text-custom-dark">Choose from dozens of ATS-friendly templates designed by HR professionals and optimized for different industries</p>
                  </div>
                </div>
                {/* ListItem 2 */}
                <div className="grid grid-cols-6">
                  <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-custom-blue-light lg:h-12 lg:w-12">
                    <svg className="h-5 w-5 flex-none text-custom-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      <path d="M8 12l2 2 4-4"></path>
                    </svg>
                  </div>
                  <div className="col-span-5">
                    <h3 className="mb-2 modern-heading-3 text-custom-black">Content Optimization</h3>
                    <p className="modern-body text-custom-dark">Our AI suggests powerful action verbs, quantifiable achievements, and industry-specific keywords to boost your chances</p>
                  </div>
                </div>
                {/* ListItem 3 */}
                <div className="grid grid-cols-6">
                  <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-custom-blue-light lg:h-12 lg:w-12">
                    <svg className="h-5 w-5 flex-none text-custom-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7,10 12,15 17,10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </div>
                  <div className="col-span-5">
                    <h3 className="mb-2 modern-heading-3 text-custom-black">Instant Download</h3>
                    <p className="modern-body text-custom-dark">Get your professionally formatted CV instantly. Ready to send to employers in seconds</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <img 
                  src="/undraw/undraw_outer_space.svg" 
                  alt="Incredible" 
                  className="w-[48rem] max-w-none sm:w-[57rem] md:-ml-4 lg:-ml-0" 
                  width="2432" height="1442" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-6 sm:py-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto max-w-7xl">
          {/* Testimonial 1 */}
          <div className="px-8">
            <figure className="max-w-screen-md mx-auto">
                <blockquote className="text-center lg:text-left">
                    <p className="text-xl italic">
                      "MyCVgo helped me land my dream job at a Fortune 500 company! The AI suggestions made my CV stand out from hundreds of applicants. I got the interview within a week of applying."
                    </p>
                </blockquote>
                <figcaption className="flex items-center justify-center lg:justify-start mt-6 space-x-3">
                    <img className="h-14 w-14 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="Sarah Johnson" />
                    <div className="flex items-center divide-x-2 divide-gray-500">
                        <cite className="pe-3 font-medium text-gray-900">Sarah Johnson</cite>
                        <cite className="ps-3 text-gray-600">Marketing Manager</cite>
                    </div>
                </figcaption>
            </figure>
          </div>
          {/* Testimonial 2 */}
          <div className="px-8 pt-16 lg:pt-0">
            <figure className="max-w-screen-md mx-auto">
                <blockquote className="text-center lg:text-left">
                    <p className="text-xl italic">
                      "I was struggling to update my CV after 10 years in the same role. MyCVgo's AI helped me translate my experience into modern, compelling language. Three job offers in two weeks!"
                    </p>
                </blockquote>
                <figcaption className="flex items-center justify-center lg:justify-start mt-6 space-x-3">
                    <img className="h-14 w-14 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?&w=100&h=100&fit=crop&crop=faces" alt="Michael Chen" />
                    <div className="flex items-center divide-x-2 divide-gray-500">
                        <cite className="pe-3 font-medium text-gray-900">Michael Chen</cite>
                        <cite className="ps-3 text-gray-600">Software Engineer</cite>
                    </div>
                </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;