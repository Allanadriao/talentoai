"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { energyMxQuestions, ProfileType } from "@/data/energyMx";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { saveAssessmentResult } from "../actions";

function EnergyMxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id") || "";
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep > 0 && !showResults) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, showResults]);

  const totalQuestions = energyMxQuestions.length;
  const currentQuestion = energyMxQuestions[currentStep];

  const handleAnswer = (value: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    setTimeout(async () => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      } else {
        setShowResults(true);
        if (candidateId) {
          setIsSaving(true);
          const finalResults = calculateResults(newAnswers);
          const tParam = searchParams.get("t");
          const requiredCount = tParam ? tParam.split(',').length : 5;
          await saveAssessmentResult(candidateId, "energy_mx", finalResults, newAnswers, requiredCount);
          setIsSaving(false);
        }
        setIsTransitioning(false);
      }
    }, 400); // Small delay to show the selected state
  };

  const calculateResults = (currentAnswers = answers) => {
    const results: Record<ProfileType | "Energia", number> = {
      Razão: 0,
      Ação: 0,
      Emoção: 0,
      Energia: 0,
    };

    Object.entries(currentAnswers).forEach(([qId, value]) => {
      const q = energyMxQuestions.find((q) => q.id === Number(qId));
      if (q) {
        results[q.profile] += value;
      }
    });

    results.Energia = results.Razão + results.Ação + results.Emoção;
    results.Razão = Math.round((results.Razão * 100) / 45);
    results.Ação = Math.round((results.Ação * 100) / 45);
    results.Emoção = Math.round((results.Emoção * 100) / 45);

    return results;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header / Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
           <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
             <Zap size={20} fill="currentColor" />
           </div>
           <h1 className="text-xl font-bold text-slate-800 tracking-tight">TalentoIA Assessment</h1>
        </div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden"
            >
              {/* Progress bar */}
              <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep) / totalQuestions) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="mb-8 text-center mt-4">
                <p className="text-indigo-600 font-semibold tracking-wide text-sm uppercase mb-3">
                  Energy MX • Pergunta {currentStep + 1} de {totalQuestions}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-slate-800">
                  {currentQuestion.text}
                </h2>
                <p className="text-slate-500 mt-4 text-sm font-medium">
                  Escolha de 1 (fraco) a 5 (forte)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center w-full max-w-md mx-auto mt-10">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`relative w-full sm:w-16 h-16 rounded-2xl sm:rounded-full text-xl font-bold flex items-center justify-center transition-all duration-200 overflow-hidden group border-2
                      ${
                        answers[currentQuestion.id] === value
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-110"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 hover:border-indigo-300"
                      }`}
                  >
                    <span className="relative z-10">{value}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center mt-10 text-sm font-semibold text-slate-400 px-2 sm:px-6">
                <span>1 - Fraco</span>
                <span>5 - Forte</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 w-full"
            >
              <div className="flex items-center justify-center mb-6 text-green-500">
                <CheckCircle2 size={64} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">
                Teste Concluído!
              </h2>
              <p className="text-slate-500 text-center mb-10 font-medium">
                Aqui está o resumo do seu perfil Energy MX
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(calculateResults()).map(([key, value]) => {
                  const isTotal = key === "Energia";
                  return (
                    <div
                      key={key}
                      className={`p-6 rounded-2xl border ${
                        isTotal
                          ? "bg-indigo-50 border-indigo-200 sm:col-span-2 text-center"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isTotal ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {key}
                      </p>
                      <div className={`flex items-end gap-2 ${isTotal ? 'justify-center' : ''}`}>
                        <span className={`text-4xl font-black ${isTotal ? 'text-indigo-700' : 'text-slate-800'}`}>
                          {value}
                        </span>
                        {isTotal && (
                          <span className="text-sm text-indigo-600/70 mb-1 font-medium">
                            pontos no total
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  if (candidateId) {
                    router.push(`/test?candidate_id=${candidateId}`);
                  } else {
                    router.push('/test');
                  }
                }}
                className="mt-10 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                Voltar para o Portal <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function EnergyMxTest() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center">Carregando...</div>}>
      <EnergyMxContent />
    </Suspense>
  );
}
