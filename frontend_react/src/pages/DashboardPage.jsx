import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';

function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Fetch resume data
    const fetchResume = async () => {
      try {
        const response = await apiClient.get('/resume/last');
        setResume(response.data);
      } catch (err) {
        console.error('Error fetching resume:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = ['Personal', 'Education', 'Work Experience', 'Skills'];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Navigation Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white">SerKo</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon="💼" label="Jobs" active={false} />
          <NavItem icon="📄" label="Resume" active={false} />
          <NavItem icon="👤" label="Profile" active={true} />
          <NavItem icon="🤖" label="Agent" active={false} badge="NEW" />
          <NavItem icon="🎁" label="Gifts" active={false} />
          <NavItem icon="🔔" label="Notifications" active={false} />
          <NavItem icon="📞" label="Support" active={false} />
          <NavItem icon="❓" label="Help" active={false} />
          <NavItem icon="⚙️" label="Settings" active={false} />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-slate-900">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Upgrade to Turbo: Get Hired Faster</span>
            </div>
            <button className="text-white hover:text-gray-100 font-medium">→</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-6 p-6">
          {/* Central Content */}
          <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-6">
            {/* Privacy Banner */}
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-emerald-400 text-sm">
                Your profile data is kept private and secure.
              </span>
              <button className="ml-auto">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-700 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-emerald-400 border-b-2 border-emerald-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading profile...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTab === 'Personal' && (
                  <PersonalTab resume={resume} user={user} />
                )}
                {activeTab === 'Education' && (
                  <EducationTab resume={resume} />
                )}
                {activeTab === 'Work Experience' && (
                  <WorkExperienceTab resume={resume} />
                )}
                {activeTab === 'Skills' && (
                  <SkillsTab resume={resume} />
                )}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-80 space-y-4">
            {/* Profile Completion Card */}
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-white text-sm mb-4">
                Great job! Your profile is complete and your extension is installed. Start applying effortlessly!
              </p>
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors border border-slate-700">
                Explore Jobs
              </button>
            </div>

            {/* Action Links */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-3">
              <button className="w-full text-left flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Manage My Resume</span>
              </button>
              <button className="w-full text-left flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>Update LinkedIn URL</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, badge }) {
  return (
    <button
      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
        active
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
          : 'text-gray-300 hover:text-white hover:bg-slate-700'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );
}

// Personal Tab Component
function PersonalTab({ resume, user }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">
            {resume?.name || user?.firstName + ' ' + user?.lastName || 'Your Name'}
          </h2>
          
          {/* Contact Chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            {resume?.location && (
              <Chip icon="📍" text={resume.location} />
            )}
            {resume?.email && (
              <Chip icon="✉️" text={resume.email} />
            )}
            {resume?.phone && (
              <Chip icon="📞" text={resume.phone} />
            )}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 mb-6">
            {resume?.linkedIn && (
              <a href={resume.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm">{resume.linkedIn}</span>
              </a>
            )}
            {resume?.github && (
              <a href={resume.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{resume.github}</span>
              </a>
            )}
            {resume?.portfolio && (
              <a href={resume.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-sm">{resume.portfolio}</span>
              </a>
            )}
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* Summary */}
      {resume?.summary && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
          <p className="text-gray-300 leading-relaxed">{resume.summary}</p>
        </div>
      )}
    </div>
  );
}

// Education Tab Component
function EducationTab({ resume }) {
  if (!resume?.educations || resume.educations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No education entries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {resume.educations.map((edu, index) => (
        <div key={edu.id || index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            {index < resume.educations.length - 1 && (
              <div className="w-0.5 h-full bg-slate-600 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                <p className="text-gray-400">{edu.institution}</p>
                {edu.field && <p className="text-gray-500 text-sm mt-1">{edu.field}</p>}
                {edu.location && <p className="text-gray-500 text-sm">{edu.location}</p>}
              </div>
              {(edu.startDate || edu.endDate) && (
                <span className="text-gray-400 text-sm">
                  {edu.startDate || ''} - {edu.endDate || 'Present'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Work Experience Tab Component
function WorkExperienceTab({ resume }) {
  if (!resume?.experiences || resume.experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No work experience entries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {resume.experiences.map((exp, index) => (
        <div key={exp.id || index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            {index < resume.experiences.length - 1 && (
              <div className="w-0.5 h-full bg-slate-600 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                <p className="text-gray-400">{exp.company}</p>
                {exp.location && <p className="text-gray-500 text-sm mt-1">{exp.location}</p>}
              </div>
              <span className="text-gray-400 text-sm">
                {exp.startDate} - {exp.endDate || 'Present'}
              </span>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm mt-3">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Skills Tab Component
function SkillsTab({ resume }) {
  return (
    <div className="space-y-6">
      {resume?.skills && resume.skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {resume?.languages && resume.languages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {resume.languages.map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {resume?.certifications && resume.certifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Certifications</h3>
          <div className="space-y-2">
            {resume.certifications.map((cert, index) => (
              <div key={index} className="text-gray-300">{cert}</div>
            ))}
          </div>
        </div>
      )}

      {(!resume?.skills || resume.skills.length === 0) &&
       (!resume?.languages || resume.languages.length === 0) &&
       (!resume?.certifications || resume.certifications.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400">No skills, languages, or certifications added yet.</p>
        </div>
      )}
    </div>
  );
}

// Chip Component
function Chip({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-lg text-gray-300 text-sm">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default DashboardPage;
