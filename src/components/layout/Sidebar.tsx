"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Zap, 
  X 
} from 'lucide-react';
import { useLayout } from './LayoutContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isMenuOpen, setIsMenuOpen } = useLayout();
  const [companyName, setCompanyName] = useState('EVANDRO FONSECA');
  const [companyEmail, setCompanyEmail] = useState('admin@evandrofonseca.com');

  useEffect(() => {
    const updateSettings = () => {
      const savedName = localStorage.getItem('companyName');
      const savedEmail = localStorage.getItem('companyEmail');
      if (savedName) setCompanyName(savedName);
      if (savedEmail) setCompanyEmail(savedEmail);
    };
    updateSettings();
    window.addEventListener('settings-updated', updateSettings as EventListener);
    return () => window.removeEventListener('settings-updated', updateSettings as EventListener);
  }, []);

  const SidebarItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    // Determine if active: exact match for dashboard, or starts with for others (except root)
    const isActive = href === '/dashboard' 
      ? pathname === '/dashboard' 
      : pathname.startsWith(href);

    return (
      <Link
        href={href}
        onClick={() => setIsMenuOpen(false)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-slate-800 text-white shadow-lg' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0F172A] flex flex-col p-6 fixed h-full z-40 transition-transform duration-300 lg:translate-x-0 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Assessment</h1>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">{companyName}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow space-y-2">
          <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem href="/dashboard/candidates" icon={Users} label="Candidatos" />
          <SidebarItem href="/dashboard/interviews" icon={Calendar} label="Entrevistas" />
          <SidebarItem href="/dashboard/assessments" icon={FileText} label="Assessments" />
          <SidebarItem href="/dashboard/reports" icon={BarChart3} label="Relatórios" />
        </nav>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <SidebarItem href="/dashboard/settings" icon={Settings} label="Configurações" />
          <button 
            onClick={() => alert(`Central de Ajuda: Entre em contato com ${companyEmail}`)}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
          >
            <HelpCircle size={20} />
            <span className="font-medium text-sm">Ajuda</span>
          </button>
        </div>
      </aside>
    </>
  );
}
