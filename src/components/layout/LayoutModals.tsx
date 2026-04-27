"use client";

import React from 'react';
import { AnimatePresence } from 'motion/react';
import CandidateForm from '@/vite_app/components/CandidateForm';
import InterviewModal from '@/vite_app/components/InterviewModal';
import { useLayout } from './LayoutContext';

export default function LayoutModals() {
  const { 
    showForm, setShowForm, fetchCandidates,
    showInterviewModal, setShowInterviewModal,
    candidateToSchedule, setCandidateToSchedule,
    setInterviews
  } = useLayout();

  return (
    <>
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
      </AnimatePresence>

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
    </>
  );
}
