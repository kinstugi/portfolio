function CvPreview({ formData }) {
  return (
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
  );
}

export default CvPreview;

