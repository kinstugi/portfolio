function WorkExperienceSection({ experiences, onExperiencesChange }) {
  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    onExperiencesChange(updated);
  };

  const handleDeleteExperience = (id) => {
    if (experiences.length > 1) {
      onExperiencesChange(experiences.filter((e) => e.id !== id));
    }
  };

  const handleAddExperience = () => {
    onExperiencesChange([
      ...experiences,
      {
        id: Date.now(),
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentPosition: false,
        description: '',
      }
    ]);
  };

  const handleDescriptionChange = (index, html) => {
    const updated = [...experiences];
    updated[index].description = html;
    onExperiencesChange(updated);
  };

  const handleToolbarClick = (e, index, command, value = null) => {
    e.preventDefault();
    const editor = e.target.closest('.border').querySelector('[contenteditable]');
    if (editor) {
      editor.focus();
      if (value) {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command, false, null);
      }
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        </div>
        <p className="text-gray-600">Add your professional work history and achievements</p>
      </div>

      {/* Work Experience Entries */}
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Entry Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span className="font-medium text-gray-900">
                  {exp.position || exp.company ? `${exp.position || 'Untitled'}${exp.company ? ` - ${exp.company}` : ''}` : 'Untitled'}
                </span>
              </div>
              <button
                onClick={() => handleDeleteExperience(exp.id)}
                className="text-red-600 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Title and Company Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company name
                  </label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* City, Start Date, End Date */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rome, Italy"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01/2024"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End date
                  </label>
                  <div className="flex gap-2 items-stretch">
                    <input
                      type="text"
                      placeholder="e.g. Current or 12/2024"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                      disabled={exp.isCurrentPosition}
                      className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <label className="flex items-center gap-1.5 px-2.5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={exp.isCurrentPosition}
                        onChange={(e) => {
                          handleExperienceChange(index, 'isCurrentPosition', e.target.checked);
                          if (e.target.checked) {
                            handleExperienceChange(index, 'endDate', 'Present');
                          }
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">Current</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Description with Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="border border-gray-300 rounded-lg">
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-50">
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-mono text-sm"
                      title="Code/Markdown"
                      onClick={(e) => handleToolbarClick(e, index, 'formatBlock', 'code')}
                    >
                      &lt;/&gt;
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Bullet List"
                      onClick={(e) => handleToolbarClick(e, index, 'insertUnorderedList')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Numbered List"
                      onClick={(e) => handleToolbarClick(e, index, 'insertOrderedList')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-semibold"
                      title="Heading"
                      onClick={(e) => handleToolbarClick(e, index, 'formatBlock', 'h3')}
                    >
                      #
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Link"
                      onClick={(e) => {
                        e.preventDefault();
                        const editor = e.target.closest('.border').querySelector('[contenteditable]');
                        if (editor) {
                          editor.focus();
                          const url = prompt('Enter URL:');
                          if (url) {
                            document.execCommand('createLink', false, url);
                          }
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                  </div>
                  {/* Text Area */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[120px] p-4 focus:outline-none"
                    onInput={(e) => handleDescriptionChange(index, e.target.innerHTML)}
                    onBlur={(e) => handleDescriptionChange(index, e.target.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: exp.description || '' }}
                    style={{ whiteSpace: 'pre-wrap' }}
                    onClick={(e) => e.target.focus()}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Another Button */}
      <button
        onClick={handleAddExperience}
        className="mt-6 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>+ Add Another Work Experience</span>
      </button>
    </div>
  );
}

export default WorkExperienceSection;

