import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CvBuilderPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [cvTitle, setCvTitle] = useState('Untitled CV');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [viewMode, setViewMode] = useState('write'); // 'write' or 'templates'
  const [selectedTemplate, setSelectedTemplate] = useState('cursor');
  const [formData, setFormData] = useState({
    jobTitle: '',
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    postalCode: '',
    city: '',
    country: '',
    dateOfBirth: '',
    drivingLicence: '',
  });

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'summary', label: 'Summary' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'interests', label: 'Interests' },
    { id: 'languages', label: 'Languages' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'travel', label: 'Travel' },
  ];

  const templates = [
    { id: 'cursor', name: 'Cursor', description: 'Two-column layout with sidebar' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean single-column design' },
    { id: 'castor', name: 'Castor', description: 'Two-column with wider left column' },
    { id: 'nexus', name: 'Nexus', description: 'Modern single-column with photo' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const handleTitleChange = (e) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Back button and CV title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">My CVs</span>
              </button>
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={handleTitleChange}
                    className="text-lg font-semibold text-gray-900 border-b-2 border-gray-900 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    <h1 className="text-lg font-semibold text-gray-900">{cvTitle}</h1>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Middle: Write/Templates buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('write')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'write'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write
              </button>
              <button
                onClick={() => setViewMode('templates')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'templates'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Templates
              </button>
            </div>

            {/* Right: Save status and Download */}
            <div className="flex items-center gap-4">
              <span className="text-green-600 text-sm font-medium">✓ All changes saved</span>
              <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>

          {/* Navigation Tabs - Only show in Write mode */}
          {viewMode === 'write' && (
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {viewMode === 'write' ? (
          <>
            {/* Left Panel - Form */}
            <div className="w-1/2 overflow-y-auto bg-white border-r border-gray-200 p-6">
          {activeTab === 'personal' && (
            <div>
              {/* Section Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                </div>
                <p className="text-gray-600">Add your contact details and professional summary</p>
              </div>

              {/* Form Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                {/* Job Title and Photo Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        Job Title
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Experienced Sales Advisor"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                        {formData.photo ? (
                          <img
                            src={URL.createObjectURL(formData.photo)}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <span>Add a photo</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Postal Code, City, Country */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Enter your postal code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Date of Birth and Driving Licence */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        placeholder="dd.mm.yyyy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driving Licence</label>
                    <input
                      type="text"
                      name="drivingLicence"
                      value={formData.drivingLicence}
                      onChange={handleInputChange}
                      placeholder="e.g. Category B, Full UK Licence"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content can be added here */}
          {activeTab !== 'personal' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Content for {tabs.find(t => t.id === activeTab)?.label} coming soon...</p>
            </div>
          )}
        </div>

            {/* Right Panel - CV Preview */}
            <div className="w-1/2 overflow-y-auto bg-gray-100 p-6">
              <div className="flex justify-center">
                <div className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] p-8">
                  {/* Preview content will go here */}
                  <div className="text-center text-gray-400 py-20">
                    <p>CV Preview</p>
                    <p className="text-sm mt-2">Your CV will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Template Selection Mode */}
            {/* Left Panel - Template Selection */}
            <div className="w-1/2 overflow-y-auto bg-white border-r border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
                </div>
                <p className="text-gray-600 text-sm">
                  Preview templates on the right. Selecting a template updates your CV immediately.
                </p>
              </div>

              {/* Template Grid */}
              <div className="space-y-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Template Thumbnail */}
                      <div className="w-32 h-40 bg-white border border-gray-300 rounded shadow-sm flex-shrink-0">
                        {template.id === 'cursor' && (
                          <div className="h-full flex">
                            <div className="flex-1 p-2 space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                              <div className="h-2 bg-orange-400 rounded w-2/3"></div>
                              <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                              <div className="h-2 bg-gray-300 rounded w-3/5"></div>
                            </div>
                            <div className="w-1/3 bg-gray-200 p-2 space-y-1">
                              <div className="h-2 bg-gray-400 rounded"></div>
                              <div className="h-2 bg-gray-400 rounded"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'minimalist' && (
                          <div className="h-full p-2 space-y-2">
                            <div className="h-2 bg-gray-300 rounded w-full"></div>
                            <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-2 bg-gray-300 rounded w-4/6"></div>
                            <div className="h-2 bg-gray-300 rounded w-full"></div>
                            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                          </div>
                        )}
                        {template.id === 'castor' && (
                          <div className="h-full flex">
                            <div className="flex-1 bg-gray-100 p-2 space-y-1">
                              <div className="h-2 bg-gray-400 rounded w-full"></div>
                              <div className="h-2 bg-gray-400 rounded w-4/5"></div>
                              <div className="h-2 bg-purple-300 rounded w-3/4"></div>
                            </div>
                            <div className="w-1/3 bg-gray-200 p-2 space-y-1">
                              <div className="h-2 bg-gray-400 rounded"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'nexus' && (
                          <div className="h-full p-2 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-2 bg-gray-400 rounded w-2/3 mb-1"></div>
                                <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-300 rounded w-full"></div>
                            <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-2 bg-gray-300 rounded w-4/6"></div>
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>

                      {/* Selection Indicator */}
                      {selectedTemplate === template.id && (
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Template Preview */}
            <div className="w-1/2 overflow-y-auto bg-gray-100 p-6">
              <div className="flex justify-center">
                <div className="w-full max-w-[210mm]">
                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <button className="p-1 text-gray-600 hover:text-gray-900">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600">1 / 1</span>
                    <button className="p-1 text-gray-600 hover:text-gray-900">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* CV Preview based on selected template */}
                  <div className="bg-white shadow-lg min-h-[297mm] p-8">
                    {selectedTemplate === 'cursor' && (
                      <div className="flex h-full">
                        <div className="flex-1 pr-6">
                          <h1 className="text-2xl font-bold mb-1">
                            {formData.firstName || 'First'} {formData.lastName || 'Last'}
                          </h1>
                          <p className="text-sm text-gray-600 uppercase mb-4">
                            {formData.jobTitle || 'JOB TITLE'}
                          </p>
                          <div className="mb-6">
                            <h2 className="text-sm font-semibold uppercase mb-2">SUMMARY</h2>
                            <p className="text-sm text-gray-600">
                              Add a professional summary to highlight your key qualifications and career objectives.
                            </p>
                          </div>
                          <div className="mb-6">
                            <h2 className="text-sm font-semibold uppercase mb-2">WORK EXPERIENCE</h2>
                            <div className="mb-4">
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <p className="font-medium">JOB TITLE</p>
                                  <p className="text-sm text-blue-600">Company</p>
                                </div>
                                <p className="text-sm text-gray-600">Start - Present</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold uppercase mb-2">EDUCATION</h2>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">DEGREE</p>
                                <p className="text-sm text-blue-600">Institution</p>
                              </div>
                              <p className="text-sm text-gray-600">Start - End</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-32 bg-gray-100 pl-4">
                          {/* Sidebar content */}
                        </div>
                      </div>
                    )}
                    {selectedTemplate === 'minimalist' && (
                      <div>
                        <h1 className="text-2xl font-bold mb-1">
                          {formData.firstName || 'First'} {formData.lastName || 'Last'}
                        </h1>
                        <p className="text-sm text-gray-600 mb-6">{formData.jobTitle || 'Job Title'}</p>
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-sm font-semibold uppercase mb-2">SUMMARY</h2>
                            <p className="text-sm text-gray-600">
                              Add a professional summary to highlight your key qualifications.
                            </p>
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold uppercase mb-2">EXPERIENCE</h2>
                            <p className="text-sm text-gray-600">Your work experience will appear here.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedTemplate === 'castor' && (
                      <div className="flex h-full">
                        <div className="flex-1 bg-gray-50 pr-6">
                          <h1 className="text-2xl font-bold mb-1">
                            {formData.firstName || 'First'} {formData.lastName || 'Last'}
                          </h1>
                          <p className="text-sm text-gray-600 mb-6">{formData.jobTitle || 'Job Title'}</p>
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-sm font-semibold uppercase mb-2">SUMMARY</h2>
                              <p className="text-sm text-gray-600">Professional summary content.</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-24 bg-gray-100 pl-4">
                          {/* Sidebar */}
                        </div>
                      </div>
                    )}
                    {selectedTemplate === 'nexus' && (
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                            {formData.photo ? (
                              <img
                                src={URL.createObjectURL(formData.photo)}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm">Photo</span>
                            )}
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold">
                              {formData.firstName || 'John'} {formData.lastName || 'Doe'}
                            </h1>
                            <p className="text-sm text-gray-600">{formData.jobTitle || 'Job Title'}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-sm font-semibold uppercase mb-2">Profile</h2>
                            <p className="text-sm text-gray-600">Add your professional profile here.</p>
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold uppercase mb-2">Experience</h2>
                            <p className="text-sm text-gray-600">Your work experience will appear here.</p>
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold uppercase mb-2">Skills</h2>
                            <p className="text-sm text-gray-600">Your skills will appear here.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CvBuilderPage;

