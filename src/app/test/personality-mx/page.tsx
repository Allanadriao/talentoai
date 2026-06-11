"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { personalityMxQuestions, PersonalityTrait } from "@/data/personalityMx";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { saveAssessmentResult } from "../actions";

function PersonalityMxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id") || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
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

  const totalQuestions = personalityMxQuestions.length;
  const currentQuestion = personalityMxQuestions[currentStep];

  const handleAnswer = (trait: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newAnswers = { ...answers, [currentQuestion.id]: trait };
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
          await saveAssessmentResult(candidateId, "personality_mx", finalResults, newAnswers, requiredCount);
          setIsSaving(false);
        }
        setIsTransitioning(false);
      }
    }, 400);
  };

  const calculateResults = (currentAnswers = answers) => {
    const results: Record<PersonalityTrait, number> = {
      Aberto: 0, Fechado: 0,
      Tradicional: 0, Inovador: 0,
      Pensador: 0, Sentimento: 0,
      Decisivo: 0, Flexível: 0
    };

    Object.values(currentAnswers).forEach((trait) => {
      if (trait in results) {
        results[trait as PersonalityTrait] += 1;
      }
    });

    return results;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="w-full max-w-3xl relative z-10">
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
                  Personality MX • Pergunta {currentStep + 1} de {totalQuestions}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-slate-800">
                  {currentQuestion.text || "Marque a opção que melhor te descreve:"}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full mt-10">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.trait)}
                    className={`relative flex-1 p-8 rounded-2xl text-center transition-all duration-200 overflow-hidden group border-2
                      ${
                        answers[currentQuestion.id] === option.trait
                          ? "bg-indigo-50 border-indigo-600 shadow-md shadow-indigo-100 scale-105"
                          : "bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300"
                      }`}
                  >
                    <span className={`block text-lg font-bold mb-2 ${answers[currentQuestion.id] === option.trait ? "text-indigo-900" : "text-slate-800"}`}>
                      Opção {index === 0 ? 'A' : 'B'}
                    </span>
                    <span className={`block font-medium ${answers[currentQuestion.id] === option.trait ? "text-indigo-700" : "text-slate-600"}`}>
                      "{option.text}"
                    </span>
                  </button>
                ))}
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
                Resumo do seu Personality MX
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(calculateResults()).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-xl border bg-slate-50 border-slate-100 flex flex-col items-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {key}
                    </p>
                    <span className="text-2xl font-black text-indigo-700">
                      {value}
                    </span>
                  </div>
                ))}
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

export default function PersonalityMxTest() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center">Carregando...</div>}>
      <PersonalityMxContent />
    </Suspense>
  );
}
