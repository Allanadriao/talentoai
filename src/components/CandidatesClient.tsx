"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Candidates from '@/vite_app/pages/Candidates';
import { useLayout } from '@/components/layout/LayoutContext';

export default function CandidatesClient() {
  const router = useRouter();
  const { 
    candidates, searchQuery, setSearchQuery, 
    exportToCSV, setShowForm, setCandidateToSchedule, 
    setShowInterviewModal, setSelectedCandidate,
    handleDeleteCandidate
  } = useLayout();

  const handleSetActiveView = (view: string) => {
    router.push(`/dashboard/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <Candidates 
      candidates={candidates}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      exportToCSV={exportToCSV}
      setShowForm={setShowForm}
      setCandidateToSchedule={setCandidateToSchedule}
      setShowInterviewModal={setShowInterviewModal}
      setSelectedCandidate={setSelectedCandidate}
      setActiveView={handleSetActiveView}
      deleteCandidate={handleDeleteCandidate}
    />
  );
}
