function EducationSection({ educations, onEducationsChange }) {
  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    onEducationsChange(updated);
  };

  const handleDeleteEducation = (id) => {
    if (educations.length > 1) {
      onEducationsChange(educations.filter((e) => e.id !== id));
    }
  };

  const handleAddEducation = () => {
    onEducationsChange([
      ...educations,
      {
        id: Date.now(),
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }
    ]);
  };

  const handleDescriptionChange = (index, html) => {
    const updated = [...educations];
    updated[index].description = html;
    onEducationsChange(updated);
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7M12 14l-9-5M12 14l9-5M12 14v7" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        </div>
        <p className="text-gray-600">Add your educational background and qualifications</p>
      </div>

      {/* Education Entries */}
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div key={edu.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Entry Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span className="font-medium text-gray-900">
                  {edu.degree || edu.institution ? `${edu.degree || 'Untitled'}${edu.institution ? ` - ${edu.institution}` : ''}` : 'Untitled'}
                </span>
              </div>
              <button
                onClick={() => handleDeleteEducation(edu.id)}
                className="text-red-600 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Degree and Institution */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    placeholder="University name"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
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
                    value={edu.location}
                    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
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
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Current or 12/2024"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    dangerouslySetInnerHTML={{ __html: edu.description || '' }}
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
        onClick={handleAddEducation}
        className="mt-6 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>+ Add Another Education</span>
      </button>
    </div>
  );
}

export default EducationSection;

