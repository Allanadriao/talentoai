"use client";

import React, { useState } from 'react';
import { Link as LinkIcon, Check, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVAILABLE_TESTS = [
  { id: 'energy-mx', name: 'Energy MX' },
  { id: 'vision-mx', name: 'Vision MX' },
  { id: 'personality-mx', name: 'Personality MX' },
  { id: 'player-mx', name: 'Player MX' },
  { id: 'power-mx', name: 'Power MX' }
];

export default function AdminLinkGenerator({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>(AVAILABLE_TESTS.map(t => t.id));
  const [copied, setCopied] = useState(false);

  const toggleTest = (id: string) => {
    setSelectedTests(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    let link = `${baseUrl}/test/onboarding?r=${userId}`;
    
    if (selectedTests.length > 0 && selectedTests.length < AVAILABLE_TESTS.length) {
      link += `&t=${selectedTests.join(',')}`;
    }

    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      <div 
        onClick={() => {
          setSelectedTests(AVAILABLE_TESTS.map(t => t.id));
          setIsOpen(true);
        }}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full"
      >
        <LinkIcon className="text-blue-500 mb-4" size={32} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Gerar Link Público</h2>
        <p className="text-slate-500 text-sm">Crie um link genérico para enviar aos candidatos. Eles poderão iniciar a avaliação diretamente.</p>
      </div>

      <AnimatePresence>
        {isOpen && (
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
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-slate-100 relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Gerar Link Público</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Este link permitirá que qualquer pessoa inicie os testes selecionados e seja adicionada à sua lista de candidatos.
                  </p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-slate-700 mb-3">Quais testes o candidato deve responder?</p>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
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
        )}
      </AnimatePresence>
    </>
  );
}
