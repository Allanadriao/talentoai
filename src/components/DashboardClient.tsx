"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/vite_app/pages/Dashboard';
import { ASSESSMENT_CARDS } from '@/vite_app/constants';
import { useLayout } from '@/components/layout/LayoutContext';

export default function DashboardClient() {
  const router = useRouter();
  const { setShowForm, candidates, interviews } = useLayout();

  const handleSetActiveView = (view: string) => {
    router.push(`/dashboard/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <Dashboard 
      candidates={candidates} 
      interviews={interviews} 
      setShowForm={setShowForm} 
      setActiveView={handleSetActiveView} 
      assessmentCards={ASSESSMENT_CARDS} 
    />
  );
}
