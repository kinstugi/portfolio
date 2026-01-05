import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CvBuilderHeader from '../components/CvBuilderHeader';
import TabNavigation from '../components/TabNavigation';
import WorkExperienceSection from '../components/WorkExperienceSection';
import PersonalInformationSection from '../components/PersonalInformationSection';
import EducationSection from '../components/EducationSection';
import SummarySection from '../components/SummarySection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import LanguagesSection from '../components/LanguagesSection';
import CvPreview from '../components/CvPreview';
import TemplateSelection from '../components/TemplateSelection';
import TemplatePreview from '../components/TemplatePreview';

function CvBuilderPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [cvTitle, setCvTitle] = useState('Untitled CV');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [viewMode, setViewMode] = useState('write'); // 'write' or 'templates'
  const [selectedTemplate, setSelectedTemplate] = useState('cursor');
  const [formData, setFormData] = useState({
    jobTitle: '',
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    postalCode: '',
    city: '',
    country: '',
    dateOfBirth: '',
    drivingLicence: '',
  });

  const [experiences, setExperiences] = useState([
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

  const [educations, setEducations] = useState([
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

  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState([
    {
      id: Date.now(),
      name: '',
      technologies: '',
      startDate: '',
      endDate: '',
      description: '',
      url: '',
    }
  ]);

  const [languages, setLanguages] = useState([
    {
      id: Date.now(),
      language: '',
      proficiency: '',
      certifications: '',
    }
  ]);

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'summary', label: 'Summary' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'interests', label: 'Interests' },
    { id: 'languages', label: 'Languages' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'travel', label: 'Travel' },
  ];

  const templates = [
    { id: 'cursor', name: 'Cursor', description: 'Two-column layout with sidebar' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean single-column design' },
    { id: 'castor', name: 'Castor', description: 'Two-column with wider left column' },
    { id: 'nexus', name: 'Nexus', description: 'Modern single-column with photo' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'experience':
        return (
          <WorkExperienceSection
            experiences={experiences}
            onExperiencesChange={setExperiences}
          />
        );
      case 'education':
        return (
          <EducationSection
            educations={educations}
            onEducationsChange={setEducations}
          />
        );
      case 'summary':
        return (
          <SummarySection
            summary={summary}
            onSummaryChange={setSummary}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            skills={skills}
            onSkillsChange={setSkills}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            projects={projects}
            onProjectsChange={setProjects}
          />
        );
      case 'languages':
        return (
          <LanguagesSection
            languages={languages}
            onLanguagesChange={setLanguages}
          />
        );
      case 'personal':
        return (
          <PersonalInformationSection
            formData={formData}
            onInputChange={handleInputChange}
            onPhotoChange={handlePhotoChange}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Content for {tabs.find(t => t.id === activeTab)?.label} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <CvBuilderHeader
        cvTitle={cvTitle}
        isEditingTitle={isEditingTitle}
        onTitleChange={setCvTitle}
        onEditTitle={setIsEditingTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBack={() => navigate('/dashboard')}
      >
        {/* Navigation Tabs - Only show in Write mode */}
        {viewMode === 'write' && (
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </CvBuilderHeader>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {viewMode === 'write' ? (
          <>
            {/* Left Panel - Form */}
            <div className="w-1/2 overflow-y-auto bg-white border-r border-gray-200 p-6">
              {renderActiveTabContent()}
            </div>

            {/* Right Panel - CV Preview */}
            <CvPreview formData={formData} />
          </>
        ) : (
          <>
            {/* Template Selection Mode */}
            <TemplateSelection
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />

            {/* Template Preview */}
            <TemplatePreview
              selectedTemplate={selectedTemplate}
              formData={formData}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default CvBuilderPage;
