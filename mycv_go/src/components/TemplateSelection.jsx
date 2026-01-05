function TemplateSelection({ templates, selectedTemplate, onTemplateSelect }) {
  return (
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
            onClick={() => onTemplateSelect(template.id)}
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
  );
}

export default TemplateSelection;

