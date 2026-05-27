"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { saveAssessmentResult } from "../actions";

export default function PersonalityMx2Test() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id") || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalQuestions = personalityMx2Questions.length;
  const currentQuestion = personalityMx2Questions[currentStep];

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

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setTimeout(async () => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setShowResults(true);
        if (candidateId) {
          setIsSaving(true);
          // Assuming we just save answers, since there is no calculateResults for personality-mx-2
          await saveAssessmentResult(candidateId, "personality_mx", { fromScale: true }, answers);
          setIsSaving(false);
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="w-full max-w-4xl relative z-10">
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
              <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep) / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="mb-8 text-center mt-4">
                <p className="text-indigo-600 font-semibold tracking-wide text-sm uppercase mb-3">
                  Personality MX (Escala) • Pergunta {currentStep + 1} de {totalQuestions}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-slate-800">
                  Selecione de 1 a 10 de acordo com o que mais combina com você:
                </h2>
              </div>

              <div className="flex flex-col items-center gap-8 mt-10">
                <div className="flex flex-col sm:flex-row justify-between w-full gap-4 text-center sm:text-left text-lg font-bold text-slate-700">
                  <div className="sm:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100">{currentQuestion.leftTrait}</div>
                  <div className="sm:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center sm:text-right">{currentQuestion.rightTrait}</div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl text-lg font-bold flex items-center justify-center transition-all duration-200 overflow-hidden group border-2
                        ${
                          answers[currentQuestion.id] === value
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-110 z-10"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 hover:border-indigo-300"
                        }`}
                    >
                      <span className="relative z-10">{value}</span>
                    </button>
                  ))}
                </div>
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
                Os resultados do Personality MX (Escala) foram registrados com sucesso.
              </p>

              <button
                onClick={() => {
                  if (candidateId) {
                    router.push(`/test?candidate_id=${candidateId}`);
                  } else {
                    router.push('/test');
                  }
                }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
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
