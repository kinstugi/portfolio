function SkillsSection({ skills, onSkillsChange }) {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        </div>
        <p className="text-gray-600">Highlight your technical and soft skills</p>
      </div>

      {/* Skills Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Section Header with Delete Button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <button className="text-red-600 hover:text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Text Area */}
        <div className="mb-4">
          <textarea
            value={skills}
            onChange={(e) => onSkillsChange(e.target.value)}
            placeholder="List your skills, one per line or separated by commas"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] resize-y"
            rows={8}
          />

          {/* Example Text */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Example:</span> Python, JavaScript, React, Django, PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsSection;

