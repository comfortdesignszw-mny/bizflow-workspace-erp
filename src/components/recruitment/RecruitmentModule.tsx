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
  X,
  RefreshCw,
  Award
} from 'lucide-react';
import { Applicant, JobOpening, RecruitmentStage } from '../../types/erp';

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
    addApplicant,
    updateApplicantStage,
    convertApplicantToEmployee,
    scoreApplicantWithAI,
    setActiveModule,
    currentUser
  } = useERP();

  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [activeApplicant, setActiveApplicant] = useState<Applicant | null>(null);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newJobData, setNewJobData] = useState({
    title: '',
    department: 'Engineering',
    type: 'Full-time' as const,
    location: 'Seattle, WA (Hybrid)',
    experienceLevel: 'Senior',
    salaryRange: '$120,000 - $160,000',
    description: '',
    requirements: ['5+ years relevant domain experience', 'Strong architecture and system design'],
    status: 'Active' as const
  });

  const [newAppData, setNewAppData] = useState({
    jobOpeningId: jobOpenings[0]?.id || '',
    jobTitle: jobOpenings[0]?.title || '',
    name: '',
    email: '',
    phone: '+1 (555) ',
    resumeSummary: '',
    yearsOfExperience: 5,
    skills: ['TypeScript', 'React', 'Node.js', 'System Architecture'],
    stage: 'APPLIED' as RecruitmentStage
  });

  const filteredApplicants = applicants.filter(a => {
    const matchesJob = selectedJobId === 'ALL' || a.jobOpeningId === selectedJobId;
    const matchesQuery = `${a.name} ${a.jobTitle} ${a.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesQuery;
  });

  const handleScoreAI = async (appId: string) => {
    setIsAIAnalyzing(true);
    await scoreApplicantWithAI(appId);
    setIsAIAnalyzing(false);
    // Refresh selected applicant
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
    addJobOpening(newJobData);
    setIsAddJobModalOpen(false);
  };

  const handleCreateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppData.name || !newAppData.email) return;
    const targetJob = jobOpenings.find(j => j.id === newAppData.jobOpeningId);
    addApplicant({
      ...newAppData,
      jobTitle: targetJob?.title || newAppData.jobTitle
    });
    setIsAddApplicantModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="recruitment-module-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              ATS Recruitment & AI Pipeline
            </span>
            <span className="text-xs text-neutral-400 font-mono">Gemini CV Match Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Applicant Tracking & Talent Acquisition</h1>
          <p className="text-xs text-neutral-400">
            Automated resume scoring, candidate progression Kanban, and one-click hire-to-workforce onboarding.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddApplicantModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>
          <button
            onClick={() => setIsAddJobModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Open Job Requisition</span>
          </button>
        </div>
      </div>

      {/* Requisitions Overview Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobOpenings.map(job => {
          const isSelected = selectedJobId === job.id;
          const candidateCount = applicants.filter(a => a.jobOpeningId === job.id).length;

          return (
            <div
              key={job.id}
              onClick={() => setSelectedJobId(isSelected ? 'ALL' : job.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                isSelected ? 'bg-purple-600/20 border-purple-500 shadow-md' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400">
                  <span className="font-mono">{job.department}</span>
                  <span className="text-purple-300 font-semibold">{job.type}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">{job.title}</h3>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{job.salaryRange}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-xs">
                <span className="text-neutral-400">{candidateCount} candidates</span>
                <span className="text-purple-400 font-semibold text-[11px]">Filter Board &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban Board of Stages */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white">Candidate Pipeline Board</h3>
            {selectedJobId !== 'ALL' && (
              <button
                onClick={() => setSelectedJobId('ALL')}
                className="text-xs text-purple-400 hover:underline"
              >
                Clear Job Filter
              </button>
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name or skill..."
            className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500"
          />
        </div>

        {/* 5-Column Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageApplicants = filteredApplicants.filter(a => a.stage === stage.key);

            return (
              <div key={stage.key} className="bg-neutral-950/80 rounded-2xl border border-neutral-800/80 p-3 space-y-3 min-w-[200px]">
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
                <div className="space-y-2.5 min-h-[300px]">
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
      </div>

      {/* Candidate Profile & AI Evaluation Drawer */}
      {activeApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto" id="applicant-evaluation-modal">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h3 className="text-base font-bold text-white">{activeApplicant.name}</h3>
                <p className="text-xs text-purple-400">{activeApplicant.jobTitle} • Applied {activeApplicant.appliedDate}</p>
              </div>
              <button
                onClick={() => setActiveApplicant(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Stage Progress Bar & Actions */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-semibold uppercase text-[10px]">Current Recruitment Stage:</span>
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        activeApplicant.stage === s.key ? 'bg-purple-600 text-white font-bold' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
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
                className="px-4 py-1.5 rounded-lg bg-neutral-800 text-white font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-white">Create New Job Opening</h3>
              <button onClick={() => setIsAddJobModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newJobData.title}
                  onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                  placeholder="e.g. Principal Cloud Security Architect"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
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
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddJobModalOpen(false)} className="px-4 py-2 bg-neutral-800 rounded-xl text-neutral-300">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold text-white">Post Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Applicant Modal */}
      {isAddApplicantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-white">Add Candidate to ATS</h3>
              <button onClick={() => setIsAddApplicantModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateApplicant} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Target Requisition *</label>
                <select
                  value={newAppData.jobOpeningId}
                  onChange={(e) => setNewAppData({ ...newAppData, jobOpeningId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                >
                  {jobOpenings.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAppData.name}
                  onChange={(e) => setNewAppData({ ...newAppData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newAppData.email}
                    onChange={(e) => setNewAppData({ ...newAppData, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={newAppData.yearsOfExperience}
                    onChange={(e) => setNewAppData({ ...newAppData, yearsOfExperience: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Resume Summary / Skills</label>
                <textarea
                  rows={3}
                  value={newAppData.resumeSummary}
                  onChange={(e) => setNewAppData({ ...newAppData, resumeSummary: e.target.value })}
                  placeholder="Key background, past companies, architectural competencies..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddApplicantModalOpen(false)} className="px-4 py-2 bg-neutral-800 rounded-xl text-neutral-300">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold text-white">Save Candidate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
