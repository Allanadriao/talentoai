import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Zap, 
  Brain, 
  Eye, 
  Target, 
  FileText,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { 
  ENERGY_MX_QUESTIONS, 
  VISION_MX_QUESTIONS, 
  PERSONALITY_MX_QUESTIONS, 
  PLAYER_MX_QUESTIONS, 
  POWER_MX_QUESTIONS,
  Question,
  getIdealProfile
} from '../constants';
import { supabase } from '../lib/supabase';

interface CandidateFormProps {
  onComplete: (results: any) => void;
  onCancel: () => void;
}

type AssessmentStep = 'intro' | 'energy' | 'vision' | 'personality' | 'player' | 'power' | 'calculating' | 'finished';

export default function CandidateForm({ onComplete, onCancel }: CandidateFormProps) {
  const [step, setStep] = useState<AssessmentStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', role: '', department: '' });

  const assessments = [
    { id: 'energy', title: 'Energy MX', questions: ENERGY_MX_QUESTIONS, icon: Zap, color: 'text-orange-500' },
    { id: 'vision', title: 'Vision MX', questions: VISION_MX_QUESTIONS, icon: Eye, color: 'text-emerald-500' },
    { id: 'personality', title: 'Personality MX', questions: PERSONALITY_MX_QUESTIONS, icon: Brain, color: 'text-purple-500' },
    { id: 'player', title: 'Player MX', questions: PLAYER_MX_QUESTIONS, icon: Target, color: 'text-sky-500' },
    { id: 'power', title: 'Power MX', questions: POWER_MX_QUESTIONS, icon: FileText, color: 'text-rose-500' },
  ];

  const currentAssessment = assessments.find(a => a.id === step);
  const questions = currentAssessment?.questions || [];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: any) => {
    const questionId = `${step}_${questions[currentQuestionIndex].id}`;
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Move to next assessment
      const currentIndex = assessments.findIndex(a => a.id === step);
      if (currentIndex < assessments.length - 1) {
        setStep(assessments[currentIndex + 1].id as AssessmentStep);
        setCurrentQuestionIndex(0);
      } else {
        setStep('calculating');
        setTimeout(() => {
          calculateResults();
        }, 2000);
      }
    }
  };

  const calculateResults = async () => {
    const results: any = {
      energy: { razao: 0, acao: 0, emocao: 0, total: 0 },
      vision: { alien: 0, robo: 0, mamifero: 0, tubarao: 0 },
      personality: { aberto: 0, fechado: 0, tradicional: 0, inovador: 0, pensador: 0, sentimento: 0, decisivo: 0, flexivel: 0 },
      player: { 
        aparente: { expressivo: 0, pragmatico: 0, afavel: 0, analitico: 0 }, 
        atual: { expressivo: 0, pragmatico: 0, afavel: 0, analitico: 0 }, 
        pressao: { expressivo: 0, pragmatico: 0, afavel: 0, analitico: 0 } 
      },
      power: {}
    };

    // Energy MX Calculation
    ENERGY_MX_QUESTIONS.forEach(q => {
      const val = answers[`energy_${q.id}`] || 0;
      const cat = q.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (cat === 'razao') results.energy.razao += val;
      if (cat === 'acao') results.energy.acao += val;
      if (cat === 'emocao') results.energy.emocao += val;
      results.energy.total += val;
    });

    // Vision MX Calculation
    VISION_MX_QUESTIONS.forEach(q => {
      const val = answers[`vision_${q.id}`];
      if (val === 'A') results.vision.alien++;
      if (val === 'B') results.vision.robo++;
      if (val === 'C') results.vision.mamifero++;
      if (val === 'D') results.vision.tubarao++;
    });

    // Personality MX Calculation
    PERSONALITY_MX_QUESTIONS.forEach(q => {
      const val = answers[`personality_${q.id}`];
      const option = q.options?.find(o => o.value === val);
      if (option) {
        const cat = option.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (results.personality[cat] !== undefined) results.personality[cat]++;
      }
    });

    // Player MX Calculation
    PLAYER_MX_QUESTIONS.forEach(q => {
      const val = answers[`player_${q.id}`];
      const option = q.options?.find(o => o.value === val);
      if (option && q.condition) {
        const cat = option.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cond = q.condition.toLowerCase();
        if (results.player[cond] && results.player[cond][cat] !== undefined) {
          results.player[cond][cat]++;
        }
      }
    });

    // Power MX Calculation
    POWER_MX_QUESTIONS.forEach(q => {
      const val = answers[`power_${q.id}`] || 0;
      const cat = q.category; // e.g., "Tipo 1"
      if (!results.power[cat]) results.power[cat] = 0;
      results.power[cat] += val;
    });

    // Calculate Match Score
    // Compare Energy, Vision, and Personality with dynamic ideal profile
    let totalDiff = 0;
    let totalPossibleDiff = 0;
    
    const profileBenchmark = getIdealProfile();

    // Energy Match (Weight: 30%)
    Object.keys(profileBenchmark.energy).forEach(key => {
      if (key === 'total') return;
      const ideal = (profileBenchmark.energy as any)[key];
      const actual = (results.energy as any)[key];
      totalDiff += Math.abs(ideal - actual);
      totalPossibleDiff += Math.max(ideal, 50); // Max score per category is around 45-50
    });

    // Vision Match (Weight: 30%)
    Object.keys(profileBenchmark.vision).forEach(key => {
      const ideal = (profileBenchmark.vision as any)[key];
      const actual = (results.vision as any)[key];
      totalDiff += Math.abs(ideal - actual);
      totalPossibleDiff += 25; // Max questions in Vision is 25
    });

    // Personality Match (Weight: 40%)
    Object.keys(profileBenchmark.personality).forEach(key => {
      const ideal = (profileBenchmark.personality as any)[key];
      const actual = (results.personality as any)[key];
      totalDiff += Math.abs(ideal - actual);
      totalPossibleDiff += 70; // Max questions in Personality is 70
    });

    const matchScore = Math.max(0, Math.min(100, Math.floor(100 - (totalDiff / totalPossibleDiff * 100))));

    try {
      // 1. Create or update candidate
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .upsert({
          name: candidateInfo.name,
          email: candidateInfo.email,
          role: candidateInfo.role,
          department: candidateInfo.department,
          status: 'Completo',
          progress: 4,
          match_score: matchScore
        }, { onConflict: 'email' })
        .select()
        .single();

      if (candidateError) throw candidateError;

      // 2. Save assessment results
      const { error: resultsError } = await supabase
        .from('assessment_results')
        .insert({
          candidate_id: candidateData.id,
          energy_mx: results.energy,
          vision_mx: results.vision,
          personality_mx: results.personality,
          player_mx: results.player,
          power_mx: results.power,
          raw_answers: answers,
          match_score: matchScore
        });

      if (resultsError) throw resultsError;

      setStep('finished');
      onComplete(results);
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      alert('Erro ao salvar resultados. Verifique sua conexão.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 lg:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 lg:gap-4">
            <button 
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                } else if (step !== 'intro') {
                  const stepIndex = assessments.findIndex(a => a.id === step);
                  if (stepIndex === 0) setStep('intro');
                  else {
                    const prevStep = assessments[stepIndex - 1];
                    setStep(prevStep.id as AssessmentStep);
                    setCurrentQuestionIndex(prevStep.questions.length - 1);
                  }
                } else {
                  onCancel();
                }
              }}
              className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
              title="Voltar"
            >
              <ArrowLeft size={18} className="lg:w-5 lg:h-5" />
            </button>
            {currentAssessment && (
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white shadow-sm flex items-center justify-center ${currentAssessment.color}`}>
                <currentAssessment.icon size={20} className="lg:w-6 lg:h-6" />
              </div>
            )}
            <div>
              <h2 className="text-base lg:text-xl font-bold leading-tight">
                {step === 'intro' && 'Bem-vindo'}
                {step === 'calculating' && 'Processando...'}
                {step === 'finished' && 'Concluído!'}
                {currentAssessment?.title}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                {step === 'intro' && 'Inicie sua jornada'}
                {currentAssessment && `Questão ${currentQuestionIndex + 1} de ${questions.length}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"
            title="Sair"
          >
            <X size={18} className="lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            {step === 'intro' && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl mx-auto space-y-8 py-6"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">Informações do Candidato</h3>
                  <p className="text-sm text-slate-500">Preencha seus dados para iniciar a avaliação.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome Completo</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Ex: Ana Silva"
                      value={candidateInfo.name}
                      onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="ana.silva@exemplo.com"
                      value={candidateInfo.email}
                      onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cargo</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Ex: Designer"
                        value={candidateInfo.role}
                        onChange={(e) => setCandidateInfo(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departamento</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Ex: Design"
                        value={candidateInfo.department}
                        onChange={(e) => setCandidateInfo(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={!candidateInfo.name || !candidateInfo.email}
                  onClick={() => setStep('energy')}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Iniciar Avaliação <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {currentAssessment && (
              <motion.div 
                key={step + currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-4 lg:space-y-6">
                  <div className="w-full h-1.5 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full ${currentAssessment.color.replace('text-', 'bg-')}`}
                    />
                  </div>
                  <h3 className="text-lg lg:text-2xl font-bold text-slate-800 leading-tight">
                    {questions[currentQuestionIndex].text}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {questions[currentQuestionIndex].type === 'scale' ? (
                    <div className="flex items-center justify-between gap-2 lg:gap-4 py-4 lg:py-8">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          onClick={() => handleAnswer(val)}
                          className="flex-grow h-14 lg:h-20 bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-white hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all group"
                        >
                          <span className="text-lg lg:text-2xl font-bold text-slate-300 group-hover:text-indigo-600">{val}</span>
                          <span className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase">
                            {val === 1 && 'Fraco'}
                            {val === 5 && 'Forte'}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                      {questions[currentQuestionIndex].options?.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(opt.value)}
                          className="p-4 lg:p-6 bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl text-left hover:bg-white hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all group flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 lg:gap-4">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-xs lg:text-sm text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100">
                              {opt.value}
                            </div>
                            <span className="font-bold text-sm lg:text-base text-slate-700">{opt.text}</span>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'calculating' && (
              <motion.div 
                key="calculating"
                className="text-center py-20 space-y-8"
              >
                <div className="relative w-24 h-24 mx-auto">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                    <Brain size={32} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Analisando suas respostas...</h3>
                  <p className="text-sm text-slate-400">Estamos traçando seu perfil comportamental completo.</p>
                </div>
              </motion.div>
            )}

            {step === 'finished' && (
              <motion.div 
                key="finished"
                className="text-center py-12 space-y-8"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">Tudo pronto!</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Sua avaliação foi processada com sucesso. Nossos recrutadores entrarão em contato em breve.
                  </p>
                </div>
                <button 
                  onClick={onCancel}
                  className="w-full sm:w-auto bg-slate-900 text-white px-8 lg:px-12 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Voltar ao Início
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
