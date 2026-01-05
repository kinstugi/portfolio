function SummarySection({ summary, onSummaryChange }) {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
        </div>
        <p className="text-gray-600">Write a professional summary or profile statement</p>
      </div>

      {/* Custom Section Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Section Header with Delete Button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Custom Section</h3>
          <button className="text-red-600 hover:text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Professional Summary Sub-heading */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Professional Summary</h4>
          
          {/* Text Area */}
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Write a brief professional summary highlighting your key qualifications and career objectives"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] resize-y"
            rows={8}
          />

          {/* Example Text */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-gray-700">Example:</span> Experienced software engineer with 5+ years developing web applications using React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading cross-functional teams. Passionate about clean code, agile methodologies, and continuous learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummarySection;

