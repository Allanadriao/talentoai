"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { powerMxQuestions, powerMxProfiles, ParteType } from "@/data/powerMx";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { saveAssessmentResult } from "../actions";

function PowerMxContent() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id") || "";

  const [currentParte, setCurrentParte] = useState<ParteType>(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const currentQuestions = powerMxQuestions.filter(q => q.parte === currentParte);
  const totalPartes = 9;

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrorMsg("");
  };

  const handleNext = async () => {
    // Verificamos se todas as questões da parte atual foram respondidas
    const answeredCount = currentQuestions.filter(q => answers[q.id] !== undefined).length;
    if (answeredCount < currentQuestions.length) {
      setErrorMsg("Por favor, responda todas as perguntas desta parte antes de continuar.");
      return;
    }

    if (currentParte < totalPartes) {
      setCurrentParte((prev) => (prev + 1) as ParteType);
      window.scrollTo(0, 0);
    } else {
      setShowResults(true);
      if (candidateId) {
        setIsSaving(true);
        const finalResults = calculateResults(answers);
        await saveAssessmentResult(candidateId, "power_mx", finalResults, answers);
        setIsSaving(false);
      }
    }
  };

  const calculateResults = (currentAnswers = answers) => {
    const results: Record<ParteType, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
    };

    // Soma bruta (0 a 10)
    Object.entries(currentAnswers).forEach(([qId, value]) => {
      const q = powerMxQuestions.find((q) => q.id === Number(qId));
      if (q) {
        results[q.parte] += value;
      }
    });

    // Aplica a regra (Soma * 100 / 180) para dar o máximo de ~111
    const finalResults: Record<ParteType, number> = { ...results };
    (Object.keys(finalResults) as unknown as ParteType[]).forEach(key => {
      finalResults[key] = Math.round((results[key] * 100) / 180);
    });

    return finalResults;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="w-full max-w-4xl relative z-10">
        
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
                    width: `${((currentParte - 1) / totalPartes) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="mb-8 text-center mt-4">
                <p className="text-indigo-600 font-semibold tracking-wide text-sm uppercase mb-3">
                  Power MX • Questionário {currentParte} de {totalPartes}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-slate-800">
                  Avalie as afirmações abaixo
                </h2>
                <p className="text-slate-500 mt-2 text-sm font-medium">
                  De 0 (nada a ver comigo) a 10 (totalmente eu)
                </p>
              </div>

              <div className="space-y-8 mt-10">
                {currentQuestions.map((q, index) => (
                  <div key={q.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-lg font-bold text-slate-800 mb-6">
                      <span className="text-indigo-500 mr-2">{index + 1}.</span> {q.text}
                    </p>
                    <div className="flex flex-wrap justify-between gap-1 sm:gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleAnswer(q.id, value)}
                          className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 overflow-hidden border-2
                            ${
                              answers[q.id] === value
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-110 z-10"
                                : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-indigo-300"
                            }`}
                        >
                          <span className="relative z-10">{value}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {errorMsg && (
                <div className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100 text-center">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleNext}
                className="mt-10 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {currentParte < totalPartes ? "Próximo Questionário" : "Finalizar Teste"} <ArrowRight size={18} />
              </button>
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
                Aqui está o resumo do seu perfil Power MX (Máximo = 111)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(calculateResults()).map(([key, value]) => {
                  const parteId = Number(key) as ParteType;
                  const profileName = powerMxProfiles[parteId];
                  return (
                    <div
                      key={key}
                      className="p-6 rounded-2xl border bg-slate-50 border-slate-100 flex flex-col items-center text-center"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-400">
                        PARTE {parteId}
                      </p>
                      <p className="text-sm font-bold text-slate-600 mb-3 h-10 flex items-center justify-center">
                        {profileName}
                      </p>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-black text-indigo-700">
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setCurrentParte(1);
                  setAnswers({});
                  setShowResults(false);
                }}
                className="mt-10 w-full py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:border-slate-300"
              >
                Refazer o Teste <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PowerMxTest() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center">Carregando...</div>}>
      <PowerMxContent />
    </Suspense>
  );
}
