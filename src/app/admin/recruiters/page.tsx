import React from 'react';
import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ArrowLeft, Users, Mail, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

export default async function AdminRecruitersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const adminClient = createAdminClient();
  const { data: usersData, error } = await adminClient.auth.admin.listUsers();
  const users = usersData?.users || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="text-slate-500" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestão de Recrutadores</h1>
            <p className="text-slate-500 text-sm">Controle de acesso das empresas e usuários.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Usuário / Empresa</th>
                  <th className="px-6 py-4">Permissão</th>
                  <th className="px-6 py-4">Data de Cadastro</th>
                  <th className="px-6 py-4">Último Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {u.email ? u.email[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{u.email}</p>
                          <p className="text-xs text-slate-400">ID: {u.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        u.user_metadata?.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.user_metadata?.role === 'admin' ? <Shield size={12} /> : <Users size={12} />}
                        {u.user_metadata?.role === 'admin' ? 'Administrador' : 'Recrutador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(u.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('pt-BR') : 'Nunca'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
