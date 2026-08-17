import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Briefcase,
  Plus,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  UserCheck,
  Star,
  FileText,
  Building2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Award,
  Download,
  Share2,
  Edit3,
  Trash2,
  Upload,
  Paperclip,
  Check,
  Copy,
  ExternalLink,
  Mail,
  Phone,
  FileCheck,
  Send,
  Eye,
  IdCard,
  User
} from 'lucide-react';
import { Applicant, JobOpening, RecruitmentStage, ApplicantFile } from '../../types/erp';
import { exportApplicantsPDF, exportApplicantsCSV } from '../../utils/pdfExport';

const STAGES: { key: RecruitmentStage; label: string; color: string }[] = [
  { key: 'APPLIED', label: 'Applied', color: 'bg-neutral-800 text-neutral-300' },
  { key: 'SCREENING', label: 'Screening', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  { key: 'INTERVIEW', label: 'Interview', color: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
  { key: 'OFFER', label: 'Offer Sent', color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  { key: 'HIRED', label: 'Hired & Onboarded', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }
];

export const RecruitmentModule: React.FC = () => {
  const {
    jobOpenings,
    applicants,
    addJobOpening,
    updateJobOpening,
    deleteJobOpening,
    addApplicant,
    updateApplicantStage,
    deleteApplicant,
    convertApplicantToEmployee,
    scoreApplicantWithAI,
    setActiveModule,
    currentUser,
    settings
  } = useERP();

  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [activeApplicant, setActiveApplicant] = useState<Applicant | null>(null);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Expanded Job IDs for accordion
  const [expandedJobIds, setExpandedJobIds] = useState<Record<string, boolean>>({});

  // Modals state
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<JobOpening | null>(null);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [sharingJob, setSharingJob] = useState<JobOpening | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // New Job Opening Form State
  const [newJobData, setNewJobData] = useState({
    title: '',
    department: 'Engineering',
    employmentType: 'Full-time' as const,
    location: 'Seattle, WA (Hybrid)',
    experienceLevel: 'Senior (5+ yrs)',
    salaryRange: '$120,000 - $160,000',
    openPositions: 2,
    description: 'We are seeking an experienced specialist to drive core enterprise infrastructure and scalable systems.',
    requirements: '5+ years relevant enterprise domain experience\nStrong systems design and microservices architecture\nProficiency in TypeScript, Node.js, and relational databases',
    qualifications: 'B.S. or M.S. in Computer Science or equivalent experience\nTrack record of high-reliability cloud deployments',
    skills: 'TypeScript, Node.js, React, PostgreSQL, Docker',
    applicationDeadline: '2026-10-31',
    status: 'Active' as const
  });

  // Application Form State
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '+1 (555) ',
    gender: 'Male',
    maritalStatus: 'Single',
    nationalId: 'ID-8820-994',
    currentCompany: '',
    yearsOfExperience: 4,
    skills: 'TypeScript, React, Architecture',
    coverLetter: '',
    cvFile: null as ApplicantFile | null,
    certificateFiles: [] as ApplicantFile[],
    referenceFiles: [] as ApplicantFile[]
  });

  // Toggle Accordion Expansion for a Job Post
  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobIds(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const handleOpenApplyModal = (job: JobOpening) => {
    setApplyingJob(job);
    setApplicationForm({
      name: '',
      email: '',
      phone: '+1 (555) ',
      gender: 'Male',
      maritalStatus: 'Single',
      nationalId: `ID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`,
      currentCompany: '',
      yearsOfExperience: 4,
      skills: (job.skills || ['TypeScript', 'System Architecture']).join(', '),
      coverLetter: `I am excited to submit my application for the ${job.title} position in ${job.department}.`,
      cvFile: null,
      certificateFiles: [],
      referenceFiles: []
    });
  };

  // File Upload Handlers (converts to base64 / dataUrl for local preview)
  const handleCVFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setApplicationForm(prev => ({
        ...prev,
        cvFile: {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
          uploadedAt: new Date().toISOString()
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        setApplicationForm(prev => ({
          ...prev,
          certificateFiles: [
            ...prev.certificateFiles,
            {
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: reader.result as string,
              uploadedAt: new Date().toISOString()
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        setApplicationForm(prev => ({
          ...prev,
          referenceFiles: [
            ...prev.referenceFiles,
            {
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: reader.result as string,
              uploadedAt: new Date().toISOString()
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob || !applicationForm.name || !applicationForm.email) return;

    const skillsArray = applicationForm.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addApplicant({
      jobOpeningId: applyingJob.id,
      jobTitle: applyingJob.title,
      name: applicationForm.name,
      email: applicationForm.email,
      phone: applicationForm.phone,
      gender: applicationForm.gender,
      maritalStatus: applicationForm.maritalStatus,
      nationalId: applicationForm.nationalId,
      currentCompany: applicationForm.currentCompany,
      yearsOfExperience: Number(applicationForm.yearsOfExperience),
      stage: 'APPLIED',
      skills: skillsArray.length > 0 ? skillsArray : ['Professional Competency'],
      resumeSummary: applicationForm.coverLetter || `${applicationForm.name} — ${applicationForm.yearsOfExperience} years domain experience in ${applyingJob.department}.`,
      cvFile: applicationForm.cvFile || undefined,
      certificateFiles: applicationForm.certificateFiles.length > 0 ? applicationForm.certificateFiles : undefined,
      referenceFiles: applicationForm.referenceFiles.length > 0 ? applicationForm.referenceFiles : undefined,
      coverLetter: applicationForm.coverLetter
    });

    setApplyingJob(null);
  };

  const handleScoreAI = async (appId: string) => {
    setIsAIAnalyzing(true);
    await scoreApplicantWithAI(appId);
    setIsAIAnalyzing(false);
    const updated = applicants.find(a => a.id === appId);
    if (updated) setActiveApplicant(updated);
  };

  const handleConvert = (appId: string) => {
    const newEmp = convertApplicantToEmployee(appId);
    if (newEmp) {
      setActiveApplicant(null);
      setActiveModule('employees');
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobData.title) return;

    const reqArray = newJobData.requirements.split('\n').map(r => r.trim()).filter(Boolean);
    const qualArray = newJobData.qualifications.split('\n').map(q => q.trim()).filter(Boolean);
    const skillArray = newJobData.skills.split(',').map(s => s.trim()).filter(Boolean);

    addJobOpening({
      title: newJobData.title,
      department: newJobData.department,
      location: newJobData.location,
      employmentType: newJobData.employmentType,
      salaryRange: newJobData.salaryRange,
      experienceLevel: newJobData.experienceLevel,
      openPositions: Number(newJobData.openPositions),
      status: newJobData.status,
      description: newJobData.description,
      requirements: reqArray,
      qualifications: qualArray,
      skills: skillArray,
      applicationDeadline: newJobData.applicationDeadline
    });

    setIsAddJobModalOpen(false);
  };

  const handleSaveEditJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    updateJobOpening(editingJob.id, {
      title: editingJob.title,
      department: editingJob.department,
      location: editingJob.location,
      employmentType: editingJob.employmentType,
      salaryRange: editingJob.salaryRange,
      experienceLevel: editingJob.experienceLevel,
      openPositions: Number(editingJob.openPositions),
      status: editingJob.status,
      description: editingJob.description,
      requirements: editingJob.requirements,
      qualifications: editingJob.qualifications,
      skills: editingJob.skills,
      applicationDeadline: editingJob.applicationDeadline
    });

    setEditingJob(null);
  };

  const handleCopyJobLink = (job: JobOpening) => {
    const link = `${window.location.origin}/#recruitment-job-${job.id}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const filteredApplicants = applicants.filter(a => {
    const matchesJob = selectedJobId === 'ALL' || a.jobOpeningId === selectedJobId;
    const matchesQuery = `${a.name} ${a.jobTitle} ${a.email} ${a.skills.join(' ')} ${a.nationalId || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesJob && matchesQuery;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto" id="recruitment-module-view">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              ATS Recruitment & AI Pipeline
            </span>
            <span className="text-xs text-neutral-400 font-mono">Requisitions, CV Uploads & Candidate Onboarding</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Applicant Tracking & Talent Acquisition</h1>
          <p className="text-xs text-neutral-400">
            Expandable position requisitions, direct applicant filing with CV/certificate uploads, external social sharing, and automated AI scoring.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportApplicantsPDF(applicants, jobOpenings, settings.companyName)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer shadow-xs"
            title="Export Candidate Roster as PDF"
            id="btn-export-ats-pdf"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export PDF</span>
          </button>
          
          <button
            onClick={() => exportApplicantsCSV(applicants)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer shadow-xs"
            title="Export Candidate Roster as CSV"
            id="btn-export-ats-csv"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddJobModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer"
            id="btn-open-requisition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Open Job Requisition</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AVAILABLE POSITIONS & POSTS (EXPANDABLE WITH APPLY, EDIT, DELETE & SHARE) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Available Positions & Job Openings ({jobOpenings.length})</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Click any card to expand full job descriptions, skills, qualifications, apply directly, or share externally.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Filter ATS board by job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 text-white text-xs rounded-xl px-3 py-1.5"
            >
              <option value="ALL">All Requisitions ({jobOpenings.length})</option>
              {jobOpenings.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Openings Grid with Expandable Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobOpenings.map(job => {
            const isExpanded = !!expandedJobIds[job.id];
            const candidateCount = applicants.filter(a => a.jobOpeningId === job.id).length;

            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  {/* Top Bar: Department, Type, Status */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold text-[10px]">
                        {job.department}
                      </span>
                      <span className="text-neutral-400 text-[11px] font-mono">{job.employmentType || job.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Title & Key Specs */}
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">{job.title}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-neutral-400 mt-2 font-mono">
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Salary:</span>
                      <span className="text-emerald-400 font-semibold">{job.salaryRange}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Location:</span>
                      <span className="text-neutral-300">{job.location}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Experience:</span>
                      <span className="text-neutral-300">{job.experienceLevel}</span>
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Expand / Collapse Button */}
                  <button
                    onClick={() => toggleJobExpansion(job.id)}
                    className="mt-3 text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide Full Job Profile & Requirements</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Expand Full Job Description, Qualifications & Skills</span>
                      </>
                    )}
                  </button>

                  {/* EXPANDED SECTION */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3.5 text-xs animate-in fade-in duration-200">
                      <div>
                        <h4 className="font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Full Job Overview</h4>
                        <p className="text-neutral-300 mt-1 leading-relaxed">{job.description}</p>
                      </div>

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div>
                          <h4 className="font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Core Responsibilities & Requirements</h4>
                          <ul className="mt-1 space-y-1 text-neutral-300">
                            {job.requirements.map((r, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Qualifications */}
                      {job.qualifications && job.qualifications.length > 0 && (
                        <div>
                          <h4 className="font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Expected Qualifications</h4>
                          <ul className="mt-1 space-y-1 text-neutral-300">
                            {job.qualifications.map((q, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Award className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills Tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div>
                          <h4 className="font-bold text-neutral-300 uppercase tracking-wider text-[10px]">Expected Technical Competencies</h4>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {job.skills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700 text-purple-300 text-[11px] font-mono">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono">
                        <span>Posted: {job.postedDate}</span>
                        <span>Deadline: {job.applicationDeadline || 'Rolling Admissions'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons: Apply, Share, Edit, Delete */}
                <div className="pt-3 border-t border-neutral-800 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenApplyModal(job)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      id={`btn-apply-job-${job.id}`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Apply to Job</span>
                    </button>

                    <button
                      onClick={() => setSharingJob(job)}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Share to Outward Socials"
                      id={`btn-share-job-${job.id}`}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-400 font-mono mr-2">{candidateCount} applied</span>
                    <button
                      onClick={() => setEditingJob(job)}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Job Requisition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the job opening "${job.title}"?`)) {
                          deleteJobOpening(job.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: APPLICANT TRACKING PIPELINE & CANDIDATE DOSSIER */}
      <div className="space-y-4 pt-4 border-t border-neutral-800">
        
        {/* Pipeline Controls & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Candidates & ATS Pipeline ({filteredApplicants.length})</span>
            </h2>
            <div className="flex rounded-xl bg-neutral-900 border border-neutral-800 p-0.5 text-xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Detailed Table
              </button>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, skill, ID..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500"
            />
          </div>
        </div>

        {/* VIEW 1: KANBAN BOARD */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {STAGES.map(stage => {
              const stageApplicants = filteredApplicants.filter(a => a.stage === stage.key);

              return (
                <div key={stage.key} className="bg-neutral-950/80 rounded-2xl border border-neutral-800/80 p-3 space-y-3 min-w-[210px]">
                  {/* Column Header */}
                  <div className="flex justify-between items-center px-1 pb-2 border-b border-neutral-800">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 font-semibold">
                      {stageApplicants.length}
                    </span>
                  </div>

                  {/* Candidate Cards */}
                  <div className="space-y-2.5 min-h-[280px]">
                    {stageApplicants.map(app => (
                      <div
                        key={app.id}
                        onClick={() => setActiveApplicant(app)}
                        className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/60 transition-all cursor-pointer space-y-2 group shadow-xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{app.name}</h4>
                            <p className="text-[10px] text-neutral-400 truncate max-w-[130px]">{app.jobTitle}</p>
                          </div>
                          {app.aiMatchScore && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                              app.aiMatchScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {app.aiMatchScore}%
                            </span>
                          )}
                        </div>

                        {/* File Badges */}
                        <div className="flex items-center gap-1.5 text-[9px] text-neutral-400">
                          {app.cvFile && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50 flex items-center gap-1">
                              <Paperclip className="w-2.5 h-2.5" /> CV
                            </span>
                          )}
                          {(app.certificateFiles?.length || 0) > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50">
                              {app.certificateFiles?.length} certs
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {app.skills.slice(0, 2).map((s, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-neutral-800 text-[10px] text-neutral-500">
                          <span>{app.yearsOfExperience}y exp</span>
                          <span className="text-purple-400 font-medium">Review &rarr;</span>
                        </div>
                      </div>
                    ))}

                    {stageApplicants.length === 0 && (
                      <div className="h-24 flex items-center justify-center text-neutral-600 text-xs italic">
                        No candidates in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: DETAILED TABLE ROSTER */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-4">Candidate & Demographics</th>
                  <th className="py-3 px-3">Target Requisition</th>
                  <th className="py-3 px-3">National ID</th>
                  <th className="py-3 px-3">Experience</th>
                  <th className="py-3 px-3">Attached Files</th>
                  <th className="py-3 px-3">AI Fit</th>
                  <th className="py-3 px-3">Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{app.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{app.email} • {app.phone || '-'}</p>
                      <p className="text-[10px] text-neutral-500">{app.gender || '-'} • {app.maritalStatus || '-'}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-200">
                      {app.jobTitle}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">
                      {app.nationalId || '-'}
                    </td>
                    <td className="py-3 px-3 text-neutral-300 font-mono">
                      {app.yearsOfExperience} yrs
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1 text-[10px]">
                        {app.cvFile ? (
                          <span className="text-purple-400 font-medium flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> {app.cvFile.name.slice(0, 16)}...
                          </span>
                        ) : (
                          <span className="text-neutral-500">No CV file</span>
                        )}
                        {(app.certificateFiles?.length || 0) > 0 && (
                          <span className="text-blue-400 text-[9px]">{app.certificateFiles?.length} certificates</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {app.aiMatchScore ? (
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-xs">
                          {app.aiMatchScore}%
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">Not scored</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={app.stage}
                        onChange={(e) => updateApplicantStage(app.id, e.target.value as RecruitmentStage)}
                        className="text-[11px] font-bold rounded-lg px-2 py-1 bg-neutral-950 border border-neutral-700 text-purple-300 cursor-pointer"
                      >
                        {STAGES.map(s => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveApplicant(app)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Review Dossier
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove applicant "${app.name}"?`)) {
                              deleteApplicant(app.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Candidate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: JOB APPLICATION FORM WITH CV & CERTIFICATE UPLOADS */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-job-application">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h3 className="text-base font-bold text-white">Job Application Form</h3>
                <p className="text-xs text-purple-400">{applyingJob.title} • {applyingJob.department}</p>
              </div>
              <button onClick={() => setApplyingJob(null)} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
              
              {/* Personal Information */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Candidate Identification</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                      placeholder="e.g. Jessica Sterling"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                      placeholder="jessica.sterling@example.com"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Sex / Gender *</label>
                    <select
                      value={applicationForm.gender}
                      onChange={(e) => setApplicationForm({ ...applicationForm, gender: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Marital Status *</label>
                    <select
                      value={applicationForm.maritalStatus}
                      onChange={(e) => setApplicationForm({ ...applicationForm, maritalStatus: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">National ID / Passport Number *</label>
                    <input
                      type="text"
                      required
                      value={applicationForm.nationalId}
                      onChange={(e) => setApplicationForm({ ...applicationForm, nationalId: e.target.value })}
                      placeholder="e.g. US-ID-8820-994"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Years of Relevant Experience *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={applicationForm.yearsOfExperience}
                      onChange={(e) => setApplicationForm({ ...applicationForm, yearsOfExperience: Number(e.target.value) })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Competencies & Cover Letter */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Experience & Background</span>
                <div>
                  <label className="block text-neutral-400 mb-1">Key Skills & Competencies (comma separated)</label>
                  <input
                    type="text"
                    value={applicationForm.skills}
                    onChange={(e) => setApplicationForm({ ...applicationForm, skills: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Cover Letter / Note</label>
                  <textarea
                    rows={3}
                    value={applicationForm.coverLetter}
                    onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                    placeholder="Briefly highlight past achievements and alignment with this role..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* File Upload Section: CV, Certificates & References */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Supporting Documents & File Attachments</span>

                {/* 1. CV Upload (PDF or DOCX) */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">1. Curriculum Vitae / Resume (PDF, DOCX) *</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-purple-500 text-purple-300 cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>{applicationForm.cvFile ? 'Change CV File' : 'Browse CV (PDF / DOCX)'}</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleCVFileUpload}
                        className="hidden"
                      />
                    </label>
                    {applicationForm.cvFile && (
                      <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {applicationForm.cvFile.name} ({(applicationForm.cvFile.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Certificates Upload (PDF, DOCX, Images) */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">2. Academic & Professional Certificates (PDF, DOCX, JPG, PNG)</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-blue-500 text-blue-300 cursor-pointer flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      <span>Upload Certificates</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp"
                        onChange={handleCertificateUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-neutral-400 text-[11px]">
                      {applicationForm.certificateFiles.length} certificate(s) attached
                    </span>
                  </div>
                  {applicationForm.certificateFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {applicationForm.certificateFiles.map((f, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-blue-400" />
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. References Upload (PDF, DOCX, Images) */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">3. Letters of Recommendation & References (PDF, DOCX, Images)</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-emerald-500 text-emerald-300 cursor-pointer flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      <span>Upload Reference Letters</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp"
                        onChange={handleReferenceUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-neutral-400 text-[11px]">
                      {applicationForm.referenceFiles.length} reference(s) attached
                    </span>
                  </div>
                  {applicationForm.referenceFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {applicationForm.referenceFiles.map((f, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-emerald-400" />
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Submit Application Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANDIDATE DOSSIER & GEMINI AI FIT EVALUATION */}
      {activeApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="applicant-evaluation-modal">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h3 className="text-base font-bold text-white">{activeApplicant.name}</h3>
                <p className="text-xs text-purple-400">{activeApplicant.jobTitle} • Applied {activeApplicant.appliedDate}</p>
              </div>
              <button
                onClick={() => setActiveApplicant(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Demographics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Email:</span>
                  <span className="font-semibold text-neutral-200">{activeApplicant.email}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Phone:</span>
                  <span className="font-mono text-neutral-200">{activeApplicant.phone || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">National ID:</span>
                  <span className="font-mono text-purple-300 font-semibold">{activeApplicant.nationalId || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Sex / Status:</span>
                  <span className="text-neutral-200">{activeApplicant.gender || '-'} / {activeApplicant.maritalStatus || '-'}</span>
                </div>
              </div>

              {/* Stage Progress Bar & Actions */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-semibold uppercase text-[10px]">Recruitment Stage Progression:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {activeApplicant.stage}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {STAGES.map(s => (
                    <button
                      key={s.key}
                      onClick={() => {
                        updateApplicantStage(activeApplicant.id, s.key);
                        setActiveApplicant({ ...activeApplicant, stage: s.key });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        activeApplicant.stage === s.key ? 'bg-purple-600 text-white font-bold' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attached Files Box */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-purple-400" />
                  <span>Applicant Files & Uploaded Documentation</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* CV File */}
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-purple-400 font-semibold block">Curriculum Vitae (CV)</span>
                      <span className="text-xs text-white truncate max-w-[150px] block">
                        {activeApplicant.cvFile ? activeApplicant.cvFile.name : 'Digital Profile Summary'}
                      </span>
                    </div>
                    {activeApplicant.cvFile?.dataUrl ? (
                      <a
                        href={activeApplicant.cvFile.dataUrl}
                        download={activeApplicant.cvFile.name}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px] flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    ) : (
                      <span className="text-neutral-500 text-[10px]">Embedded</span>
                    )}
                  </div>

                  {/* Other Files */}
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
                    <span className="text-[10px] text-blue-400 font-semibold block">
                      Certificates & References ({(activeApplicant.certificateFiles?.length || 0) + (activeApplicant.referenceFiles?.length || 0)})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(activeApplicant.certificateFiles || []).map((c, idx) => (
                        <a
                          key={idx}
                          href={c.dataUrl || '#'}
                          download={c.name}
                          className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 hover:text-white border border-neutral-700 text-[10px] flex items-center gap-1"
                        >
                          <Download className="w-2.5 h-2.5 text-blue-400" /> {c.name.slice(0, 12)}...
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini AI Match Score Analysis Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-950 via-purple-950/40 to-neutral-950 border border-purple-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h4 className="font-bold text-white">Gemini AI Resume & Fit Analysis</h4>
                  </div>
                  <button
                    onClick={() => handleScoreAI(activeApplicant.id)}
                    disabled={isAIAnalyzing}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAIAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAIAnalyzing ? 'Scoring...' : 'Run AI Evaluation'}</span>
                  </button>
                </div>

                {activeApplicant.aiMatchScore ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-purple-400 font-mono">{activeApplicant.aiMatchScore}%</span>
                      <span className="text-neutral-300 font-medium">Requisition Compatibility Match</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{activeApplicant.aiMatchAnalysis}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-emerald-500/20">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Key Strengths</span>
                        <ul className="space-y-1 text-neutral-300">
                          {(activeApplicant.strengths || ['High domain expertise', 'Full stack depth']).map((str, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-amber-500/20">
                        <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">Interview Probing Areas</span>
                        <ul className="space-y-1 text-neutral-300">
                          {(activeApplicant.gaps || ['Inquire about cloud gateway failover experience']).map((gap, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-400 italic">Click "Run AI Evaluation" to score this candidate against job requisition criteria.</p>
                )}
              </div>

              {/* Resume & Skills */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-300">Resume Abstract</h4>
                <p className="text-neutral-300 leading-relaxed">{activeApplicant.resumeSummary}</p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {activeApplicant.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700 text-neutral-300 text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* One-Click Convert to Full Employee Button */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <h4 className="font-bold text-emerald-400">Ready to Onboard this Candidate?</h4>
                  <p className="text-neutral-400 text-[11px]">Transfers candidate directly to the active employee directory and creates their digital ID badge.</p>
                </div>
                <button
                  onClick={() => handleConvert(activeApplicant.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
                  id="btn-convert-to-employee"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Hire as Employee</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setActiveApplicant(null)}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 text-white font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SHARE JOB EXTERNALLY TO OUTWARD SOCIALS */}
      {sharingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-share-job">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Share Job Requisition</h3>
              </div>
              <button onClick={() => setSharingJob(null)} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <h4 className="font-bold text-white">{sharingJob.title}</h4>
                <p className="text-neutral-400 text-[11px] mt-0.5">{sharingJob.department} • {sharingJob.salaryRange} • {sharingJob.location}</p>
              </div>

              {/* Direct Link Copy */}
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Direct Requisition URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/#recruitment-job-${sharingJob.id}`}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-300 font-mono text-[11px]"
                  />
                  <button
                    onClick={() => handleCopyJobLink(sharingJob)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                  >
                    {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Outward Social Media Buttons */}
              <div className="space-y-2 pt-2">
                <label className="block text-neutral-400 font-semibold">Share to Outward Social Channels</label>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/#recruitment-job-${sharingJob.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#0077b5]/20 border border-[#0077b5]/40 hover:bg-[#0077b5]/30 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>LinkedIn Post</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`We are hiring: ${sharingJob.title} (${sharingJob.salaryRange}) at ${settings.companyName}! Apply here: `)}&url=${encodeURIComponent(`${window.location.origin}/#recruitment-job-${sharingJob.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-700 hover:bg-neutral-800 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>X (Twitter)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Job Opening: ${sharingJob.title} at ${settings.companyName} (${sharingJob.salaryRange}). Apply now: ${window.location.origin}/#recruitment-job-${sharingJob.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-emerald-300 font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Job Opportunity: ${sharingJob.title} at ${settings.companyName}`)}&body=${encodeURIComponent(`Hello,\n\nWe have opened a requisition for ${sharingJob.title} in ${sharingJob.department} (${sharingJob.salaryRange}).\n\nView details and apply here: ${window.location.origin}/#recruitment-job-${sharingJob.id}`)}`}
                    className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Referral</span>
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => setSharingJob(null)}
                  className="px-4 py-1.5 rounded-xl bg-neutral-800 text-white font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE NEW JOB REQUISITION */}
      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-white">Create New Job Opening</h3>
              <button onClick={() => setIsAddJobModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-3.5 text-xs max-h-[78vh] overflow-y-auto">
              <div>
                <label className="block text-neutral-400 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newJobData.title}
                  onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                  placeholder="e.g. Lead Distributed Cloud Architect"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Department</label>
                  <select
                    value={newJobData.department}
                    onChange={(e) => setNewJobData({ ...newJobData, department: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Procurement & Fleet">Procurement & Fleet</option>
                    <option value="Sales & Operations">Sales & Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Employment Type</label>
                  <select
                    value={newJobData.employmentType}
                    onChange={(e) => setNewJobData({ ...newJobData, employmentType: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJobData.salaryRange}
                    onChange={(e) => setNewJobData({ ...newJobData, salaryRange: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={newJobData.location}
                    onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Experience Level</label>
                  <input
                    type="text"
                    value={newJobData.experienceLevel}
                    onChange={(e) => setNewJobData({ ...newJobData, experienceLevel: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Open Positions</label>
                  <input
                    type="number"
                    min={1}
                    value={newJobData.openPositions}
                    onChange={(e) => setNewJobData({ ...newJobData, openPositions: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Full Job Description</label>
                <textarea
                  rows={3}
                  value={newJobData.description}
                  onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Core Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={newJobData.requirements}
                  onChange={(e) => setNewJobData({ ...newJobData, requirements: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Qualifications Expected (one per line)</label>
                <textarea
                  rows={2}
                  value={newJobData.qualifications}
                  onChange={(e) => setNewJobData({ ...newJobData, qualifications: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Technical Skills Required (comma separated)</label>
                <input
                  type="text"
                  value={newJobData.skills}
                  onChange={(e) => setNewJobData({ ...newJobData, skills: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button type="button" onClick={() => setIsAddJobModalOpen(false)} className="px-4 py-2 bg-neutral-800 rounded-xl text-neutral-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold text-white cursor-pointer shadow-md shadow-purple-600/20">Post Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT JOB REQUISITION */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-white">Edit Job Requisition: {editingJob.title}</h3>
              <button onClick={() => setEditingJob(null)} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditJob} className="p-6 space-y-3.5 text-xs max-h-[78vh] overflow-y-auto">
              <div>
                <label className="block text-neutral-400 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingJob.department}
                    onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Status</label>
                  <select
                    value={editingJob.status}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={editingJob.salaryRange}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryRange: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button type="button" onClick={() => setEditingJob(null)} className="px-4 py-2 bg-neutral-800 rounded-xl text-neutral-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold text-white cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
