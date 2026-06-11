import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, X } from 'lucide-react';
import { Candidate } from '../../types';
import { toast } from 'sonner';

export const AVAILABLE_TESTS = [
  { id: 'energy-mx', name: 'Energy MX' },
  { id: 'vision-mx', name: 'Vision MX' },
  { id: 'personality-mx', name: 'Personality MX' },
  { id: 'player-mx', name: 'Player MX' },
  { id: 'power-mx', name: 'Power MX' }
];

interface MagicLinkModalProps {
  candidateToShare: Candidate | 'public' | null;
  setCandidateToShare: (c: Candidate | 'public' | null) => void;
}

export function MagicLinkModal({ candidateToShare, setCandidateToShare }: MagicLinkModalProps) {
  const [selectedTests, setSelectedTests] = useState<string[]>(AVAILABLE_TESTS.map(t => t.id));
  const [copied, setCopied] = useState(false);

  // Reinicia os testes quando o modal abre
  React.useEffect(() => {
    if (candidateToShare) {
      setSelectedTests(AVAILABLE_TESTS.map(t => t.id));
      setCopied(false);
    }
  }, [candidateToShare]);

  const toggleTest = (id: string) => {
    setSelectedTests(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleCopyLink = async () => {
    if (!candidateToShare) return;
    
    const baseUrl = window.location.origin;
    let link = '';

    try {
      if (candidateToShare === 'public') {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || '';

        link = `${baseUrl}/test/onboarding?r=${userId}`;
        if (selectedTests.length > 0 && selectedTests.length < AVAILABLE_TESTS.length) {
          link += `&t=${selectedTests.join(',')}`;
        }
      } else {
        link = `${baseUrl}/test?candidate_id=${candidateToShare.id}`;
        if (selectedTests.length > 0 && selectedTests.length < AVAILABLE_TESTS.length) {
          link += `&t=${selectedTests.join(',')}`;
        }
      }

      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copiado com sucesso!', {
        description: 'Você já pode enviar este link para o candidato.'
      });
      
      setTimeout(() => {
        setCopied(false);
        setCandidateToShare(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao copiar o link', {
        description: 'Verifique as permissões do seu navegador.'
      });
    }
  };

  if (!candidateToShare) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-slate-100"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {candidateToShare === 'public' ? 'Gerar Link Público' : 'Gerar Link Mágico'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {candidateToShare === 'public' 
                  ? 'Este link permitirá que qualquer pessoa inicie os testes selecionados e seja adicionada à sua lista de candidatos.'
                  : <>Para <span className="font-semibold text-indigo-600">{candidateToShare.name}</span></>
                }
              </p>
            </div>
            <button 
              onClick={() => setCandidateToShare(null)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm font-bold text-slate-700 mb-3">Quais testes o candidato deve responder?</p>
            <div className="space-y-2">
              {AVAILABLE_TESTS.map(test => (
                <div 
                  key={test.id} 
                  onClick={() => toggleTest(test.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors select-none ${
                    selectedTests.includes(test.id) 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                    selectedTests.includes(test.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedTests.includes(test.id) && <Check size={14} />}
                  </div>
                  <span className="text-sm font-medium">{test.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleCopyLink}
            disabled={selectedTests.length === 0}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
              copied 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : selectedTests.length === 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {copied ? (
              <>
                <Check size={18} /> Copiado!
              </>
            ) : (
              <>
                <Copy size={18} /> Copiar Link do Portal
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
