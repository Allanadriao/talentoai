/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';

// Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CandidateForm from './components/CandidateForm';
import InterviewModal from './components/InterviewModal';

// Pages
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Interviews from './pages/Interviews';
import Assessments from './pages/Assessments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Services
import { candidateService } from './services/candidateService';
import { interviewService } from './services/interviewService';

// Types & Constants
import { Candidate, Interview } from './types';
import { ASSESSMENT_CARDS } from './constants';

type View = 'dashboard' | 'candidates' | 'assessments' | 'reports' | 'settings' | 'interviews';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [candidateToSchedule, setCandidateToSchedule] = useState<Candidate | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await candidateService.fetchCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviews = async () => {
    try {
      const data = await interviewService.fetchInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este candidato?')) return;
    try {
      await candidateService.deleteCandidate(id);
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Erro ao excluir candidato.');
    }
  };

  const handleDeleteInterview = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta entrevista?')) return;
    try {
      await interviewService.deleteInterview(id);
      setInterviews(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting interview:', error);
      alert('Erro ao cancelar entrevista.');
    }
  };

  const exportToCSV = () => {
    if (candidates.length === 0) return;
    
    const headers = ['Nome', 'Email', 'Cargo', 'Departamento', 'Status', 'Match %'];
    const rows = candidates.map(c => [
      c.name,
      c.email,
      c.role,
      c.department,
      c.status,
      c.match_score || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `candidatos_talentoia_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchCandidates();
    fetchInterviews();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] text-slate-900 font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      <main className="flex-grow lg:ml-64 w-full">
        <Header 
          activeView={activeView} 
          setIsMenuOpen={setIsMenuOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setShowForm={setShowForm}
        />

        <div className="p-4 lg:p-8">
          <AnimatePresence>
            {showForm && (
              <CandidateForm 
                key="candidate-form-modal"
                onComplete={() => {
                  setShowForm(false);
                  fetchCandidates();
                }}
                onCancel={() => setShowForm(false)}
              />
            )}

            {activeView === 'dashboard' && (
              <Dashboard 
                key="view-dashboard"
                candidates={candidates} 
                interviews={interviews} 
                setShowForm={setShowForm} 
                setActiveView={setActiveView} 
                assessmentCards={ASSESSMENT_CARDS} 
              />
            )}

            {activeView === 'candidates' && (
              <Candidates 
                key="view-candidates"
                candidates={candidates}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                exportToCSV={exportToCSV}
                setShowForm={setShowForm}
                setCandidateToSchedule={setCandidateToSchedule}
                setShowInterviewModal={setShowInterviewModal}
                setSelectedCandidate={setSelectedCandidate}
                setActiveView={setActiveView}
                deleteCandidate={handleDeleteCandidate}
              />
            )}

            {activeView === 'assessments' && (
              <Assessments 
                key="view-assessments"
                candidates={candidates} 
                assessmentCards={ASSESSMENT_CARDS} 
                setShowForm={setShowForm} 
              />
            )}

            {activeView === 'reports' && (
              <Reports 
                key="view-reports"
                selectedCandidate={selectedCandidate} 
                setSelectedCandidate={setSelectedCandidate} 
                setActiveView={setActiveView} 
              />
            )}

            {activeView === 'interviews' && (
              <Interviews 
                key="view-interviews"
                interviews={interviews} 
                deleteInterview={handleDeleteInterview} 
                setActiveView={setActiveView} 
              />
            )}

            {activeView === 'settings' && <Settings key="view-settings" />}
          </AnimatePresence>
        </div>
      </main>

      {showInterviewModal && candidateToSchedule && (
        <InterviewModal 
          candidate={candidateToSchedule}
          onClose={() => {
            setShowInterviewModal(false);
            setCandidateToSchedule(null);
          }}
          onScheduled={(newInterview) => {
            setInterviews(prev => [...prev, newInterview]);
          }}
        />
      )}
    </div>
  );
}
