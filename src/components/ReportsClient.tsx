"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Reports from '@/vite_app/pages/Reports';
import { useLayout } from '@/components/layout/LayoutContext';

export default function ReportsClient() {
  const router = useRouter();
  const { selectedCandidate, setSelectedCandidate } = useLayout();

  const handleSetActiveView = (view: string) => {
    router.push(`/dashboard/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <Reports 
      selectedCandidate={selectedCandidate} 
      setSelectedCandidate={setSelectedCandidate} 
      setActiveView={handleSetActiveView} 
    />
  );
}
