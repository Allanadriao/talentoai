import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminBillingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="text-slate-500" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Assinaturas e Pagamentos</h1>
            <p className="text-slate-500 text-sm">Gerenciamento financeiro e planos.</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6">
            <CreditCard size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Módulo Financeiro em Desenvolvimento</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            A integração com gateways de pagamento (Stripe/Pagar.me) será implementada nas próximas atualizações para cobrança automática dos recrutadores.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-200">
            <AlertCircle size={16} /> Previsão: Fase 2
          </div>
        </div>

      </div>
    </div>
  );
}
