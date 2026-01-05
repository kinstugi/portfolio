function TemplatePreview({ selectedTemplate, formData }) {
  return (
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
  );
}

export default TemplatePreview;

