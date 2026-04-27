import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Settings() {
  const [name, setName] = useState('EVANDRO FONSECA');
  const [email, setEmail] = useState('admin@evandrofonseca.com');
  const [saved, setSaved] = useState(false);
  
  const [isEditingBenchmark, setIsEditingBenchmark] = useState(false);
  const [benchmarkSaved, setBenchmarkSaved] = useState(false);
  
  // Benchmark State
  const [benchmark, setBenchmark] = useState({
    energy: { razao: 39, acao: 34, emocao: 37 },
    vision: { alien: 16, robo: 48, mamifero: 12, tubarao: 24 },
    personality: { aberto: 4, fechado: 6, tradicional: 13, inovador: 7, pensador: 9, sentimento: 11, decisivo: 12, flexivel: 8 }
  });

  useEffect(() => {
    const savedName = localStorage.getItem('companyName');
    const savedEmail = localStorage.getItem('companyEmail');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);

    const savedBenchmark = localStorage.getItem('idealProfile');
    if (savedBenchmark) {
      setBenchmark(JSON.parse(savedBenchmark));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('companyName', name);
    localStorage.setItem('companyEmail', email);
    setSaved(true);
    window.dispatchEvent(new Event('settings-updated'));
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveBenchmark = () => {
    localStorage.setItem('idealProfile', JSON.stringify(benchmark));
    setBenchmarkSaved(true);
    setIsEditingBenchmark(false);
    setTimeout(() => setBenchmarkSaved(false), 3000);
  };

  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-8"
    >
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold">Configurações da Empresa</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome da Empresa</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail de Notificação</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
            />
          </div>
        </div>
        <div className="pt-4 flex items-center justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm shadow-indigo-200"
          >
            {saved ? 'Salvo com Sucesso!' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Perfil Ideal (Benchmark)</h3>
            <p className="text-sm text-slate-400 mt-1">Defina os parâmetros que serão usados para calcular o Match % dos candidatos.</p>
          </div>
          <button 
            onClick={() => setIsEditingBenchmark(!isEditingBenchmark)}
            className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all font-bold"
          >
            {isEditingBenchmark ? 'Cancelar' : 'Editar Valores'}
          </button>
        </div>

        {benchmarkSaved && (
          <div className="p-3 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-xl text-center">
            Perfil Ideal salvo com sucesso e já está sendo aplicado nos próximos cálculos!
          </div>
        )}

        {isEditingBenchmark && (
          <div className="space-y-8 pt-4">
            
            {/* ENERGY */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-orange-600 border-b border-orange-100 pb-2">Energy MX</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(benchmark.energy).map(key => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key}</label>
                    <input 
                      type="number" 
                      value={(benchmark.energy as any)[key]} 
                      onChange={(e) => setBenchmark(prev => ({ ...prev, energy: { ...prev.energy, [key]: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* VISION */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-emerald-600 border-b border-emerald-100 pb-2">Vision MX</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(benchmark.vision).map(key => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key}</label>
                    <input 
                      type="number" 
                      value={(benchmark.vision as any)[key]} 
                      onChange={(e) => setBenchmark(prev => ({ ...prev, vision: { ...prev.vision, [key]: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* PERSONALITY */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-purple-600 border-b border-purple-100 pb-2">Personality MX</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(benchmark.personality).map(key => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key}</label>
                    <input 
                      type="number" 
                      value={(benchmark.personality as any)[key]} 
                      onChange={(e) => setBenchmark(prev => ({ ...prev, personality: { ...prev.personality, [key]: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSaveBenchmark}
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2"
              >
                Salvar Benchmark
              </button>
            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
}
