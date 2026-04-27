"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { candidateService } from '@/vite_app/services/candidateService';
import { interviewService } from '@/vite_app/services/interviewService';
import { Candidate, Interview } from '@/vite_app/types';

interface LayoutContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  interviews: Interview[];
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  fetchCandidates: () => Promise<void>;
  fetchInterviews: () => Promise<void>;
  
  showInterviewModal: boolean;
  setShowInterviewModal: (show: boolean) => void;
  candidateToSchedule: Candidate | null;
  setCandidateToSchedule: (candidate: Candidate | null) => void;
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  
  exportToCSV: () => void;
  handleDeleteCandidate: (id: string) => Promise<void>;
  handleDeleteInterview: (id: string) => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [candidateToSchedule, setCandidateToSchedule] = useState<Candidate | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const fetchCandidates = async () => {
    try {
      const data = await candidateService.fetchCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
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
    if (!window.confirm('Tem certeza que deseja excluir este candidato?')) return;
    try {
      await candidateService.deleteCandidate(id);
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Erro ao excluir candidato.');
    }
  };

  const handleDeleteInterview = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta entrevista?')) return;
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
    <LayoutContext.Provider 
      value={{ 
        searchQuery, setSearchQuery, 
        showForm, setShowForm, 
        isMenuOpen, setIsMenuOpen,
        candidates, setCandidates,
        interviews, setInterviews,
        fetchCandidates, fetchInterviews,
        showInterviewModal, setShowInterviewModal,
        candidateToSchedule, setCandidateToSchedule,
        selectedCandidate, setSelectedCandidate,
        exportToCSV, handleDeleteCandidate, handleDeleteInterview
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
