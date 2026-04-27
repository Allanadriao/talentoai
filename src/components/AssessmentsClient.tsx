"use client";

import React from 'react';
import Assessments from '@/vite_app/pages/Assessments';
import { ASSESSMENT_CARDS } from '@/vite_app/constants';
import { useLayout } from '@/components/layout/LayoutContext';

export default function AssessmentsClient() {
  const { candidates, setShowForm } = useLayout();

  return (
    <Assessments 
      candidates={candidates} 
      assessmentCards={ASSESSMENT_CARDS} 
      setShowForm={setShowForm} 
    />
  );
}
