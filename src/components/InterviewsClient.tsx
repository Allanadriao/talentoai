"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Interviews from '@/vite_app/pages/Interviews';
import { useLayout } from '@/components/layout/LayoutContext';

export default function InterviewsClient() {
  const router = useRouter();
  const { interviews, handleDeleteInterview } = useLayout();

  const handleSetActiveView = (view: string) => {
    router.push(`/dashboard/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <Interviews 
      interviews={interviews} 
      deleteInterview={handleDeleteInterview} 
      setActiveView={handleSetActiveView} 
    />
  );
}
