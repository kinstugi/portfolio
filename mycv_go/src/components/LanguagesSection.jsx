function LanguagesSection({ languages, onLanguagesChange }) {
  const handleLanguageChange = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    onLanguagesChange(updated);
  };

  const handleDeleteLanguage = (id) => {
    if (languages.length > 1) {
      onLanguagesChange(languages.filter((l) => l.id !== id));
    }
  };

  const handleAddLanguage = () => {
    onLanguagesChange([
      ...languages,
      {
        id: Date.now(),
        language: '',
        proficiency: '',
        certifications: '',
      }
    ]);
  };

  const proficiencyLevels = [
    { value: '', label: 'Select level' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'elementary', label: 'Elementary' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'upper-intermediate', label: 'Upper Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'proficient', label: 'Proficient' },
    { value: 'native', label: 'Native' },
  ];

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">Languages</h2>
        </div>
        <p className="text-gray-600">Add languages you speak and proficiency levels</p>
      </div>

      {/* Language Entries */}
      <div className="space-y-4">
        {languages.map((lang, index) => (
          <div key={lang.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Entry Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span className="font-medium text-gray-900">
                  {lang.language || 'Untitled'}
                </span>
              </div>
              <button
                onClick={() => handleDeleteLanguage(lang.id)}
                className="text-red-600 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  placeholder="e.g. English"
                  value={lang.language}
                  onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Proficiency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {proficiencyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. TOEFL, IELTS, DELE"
                  value={lang.certifications}
                  onChange={(e) => handleLanguageChange(index, 'certifications', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Another Button */}
      <button
        onClick={handleAddLanguage}
        className="mt-6 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>+ Add Another Language</span>
      </button>
    </div>
  );
}

export default LanguagesSection;

