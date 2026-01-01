import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    preferredLocation: '',
    jobType: [], // Changed to array for multiple selections
    workMode: [], // Changed to array for multiple selections
    allowedToWorkEU: false,
    allowedToWorkNorthAmerica: false,
    cvFile: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or DOCX file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setFormData({
        ...formData,
        cvFile: file,
      });
      setError('');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.preferredLocation || formData.jobType.length === 0 || formData.workMode.length === 0) {
        setError('Please fill in all fields');
        return;
      }
      
      // No validation for work authorization - users can proceed even if they need visa
      setStep(2);
    }
  };

  const toggleJobType = (type) => {
    setFormData(prev => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter(t => t !== type)
        : [...prev.jobType, type]
    }));
    setError('');
  };

  const toggleWorkMode = (mode) => {
    setFormData(prev => ({
      ...prev,
      workMode: prev.workMode.includes(mode)
        ? prev.workMode.filter(m => m !== mode)
        : [...prev.workMode, mode]
    }));
    setError('');
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.cvFile) {
      setError('Please upload your CV');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement backend API call when ready
      // const formDataToSend = new FormData();
      // formDataToSend.append('preferredLocation', formData.preferredLocation);
      // formDataToSend.append('jobType', formData.jobType);
      // formDataToSend.append('workMode', formData.workMode);
      // formDataToSend.append('cvFile', formData.cvFile);
      // 
      // await apiClient.post('/onboarding', formDataToSend, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      // After onboarding, the user will have a resume in the database
      // So next login will automatically go to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to SerKo!</h1>
          <p className="text-gray-400">Let's set up your profile</p>
          <div className="flex justify-center gap-2 mt-6">
            <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-emerald-500' : 'bg-emerald-500'}`}></div>
            <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
          </div>
        </div>

        {/* Onboarding Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Job Preferences</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
                {/* Preferred Location */}
                <div>
                  <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Job Location
                  </label>
                  <select
                    id="preferredLocation"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a location</option>
                    <option value="EU/Europe">EU/Europe</option>
                    <option value="North America">North America</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Work Authorization Checkboxes - Optional (for visa tracking) */}
                {(formData.preferredLocation === 'EU/Europe' || formData.preferredLocation === 'North America') && (
                  <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                    <p className="text-xs text-gray-400 mb-2">Work Authorization (Optional - for future visa planning)</p>
                    {formData.preferredLocation === 'EU/Europe' && (
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="allowedToWorkEU"
                          name="allowedToWorkEU"
                          checked={formData.allowedToWorkEU}
                          onChange={(e) => setFormData({ ...formData, allowedToWorkEU: e.target.checked })}
                          className="mt-1 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-600 rounded bg-slate-900/50"
                        />
                        <label htmlFor="allowedToWorkEU" className="ml-3 text-sm text-gray-300">
                          I am allowed to work in EU/Europe
                        </label>
                      </div>
                    )}
                    {formData.preferredLocation === 'North America' && (
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="allowedToWorkNorthAmerica"
                          name="allowedToWorkNorthAmerica"
                          checked={formData.allowedToWorkNorthAmerica}
                          onChange={(e) => setFormData({ ...formData, allowedToWorkNorthAmerica: e.target.checked })}
                          className="mt-1 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-600 rounded bg-slate-900/50"
                        />
                        <label htmlFor="allowedToWorkNorthAmerica" className="ml-3 text-sm text-gray-300">
                          I am allowed to work in North America
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Job Type <span className="text-gray-500 text-xs">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Freelance'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleJobType(type)}
                        className={`px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                          formData.jobType.includes(type)
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900/50 border-slate-600 text-gray-300 hover:border-slate-500'
                        }`}
                      >
                        {formData.jobType.includes(type) && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Work Mode <span className="text-gray-500 text-xs">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Remote', 'On-site', 'Hybrid'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => toggleWorkMode(mode)}
                        className={`px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                          formData.workMode.includes(mode)
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900/50 border-slate-600 text-gray-300 hover:border-slate-500'
                        }`}
                      >
                        {formData.workMode.includes(mode) && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl mt-6"
                >
                  Next: Upload CV
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Upload Your CV</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label htmlFor="cvFile" className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Your CV
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-lg hover:border-emerald-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="cvFile"
                          className="relative cursor-pointer bg-slate-900/50 rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="cvFile"
                            name="cvFile"
                            type="file"
                            accept=".pdf,.docx"
                            className="sr-only"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                  {formData.cvFile && (
                    <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                      <p className="text-emerald-400 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formData.cvFile.name} ({(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.cvFile}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Completing Setup...' : 'Complete Setup'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;

