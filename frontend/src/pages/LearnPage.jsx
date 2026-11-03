import React, { useState } from 'react';
import { LEARNING_MODULES } from '../data/learningModules';
import { ALL_ALGORITHMS } from '../algorithms';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Search,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LearnPage({ onNavigateToVisualizer }) {
  const { user, completeQuiz } = useAuth();
  const [selectedAlgoId, setSelectedAlgoId] = useState('bubbleSort');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Quiz state for the active module
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const moduleData = LEARNING_MODULES[selectedAlgoId] || LEARNING_MODULES['bubbleSort'];
  const algoMeta = ALL_ALGORITHMS[selectedAlgoId];
  const isCompleted = user?.completedQuizzes?.includes(selectedAlgoId);

  // Filter modules
  const filteredModules = Object.values(LEARNING_MODULES).filter((m) => {
    const matchesCat = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectModule = (id) => {
    setSelectedAlgoId(id);
    setQuizAnswers({});
    setSubmittedQuiz(false);
  };

  const handleSelectOption = (questionIdx, optionIdx) => {
    if (submittedQuiz) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    setSubmittedQuiz(true);
    let correctCount = 0;
    moduleData.quiz?.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correctCount++;
    });

    if (correctCount >= 1) {
      completeQuiz(selectedAlgoId, correctCount);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-accent via-brand-purple to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-purple/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Interactive Learning Academy
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Master core computer science algorithms with intuitive guides, pseudocode, and quizzes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surfaceLight/80 px-3.5 py-1.5 rounded-xl border border-surfaceBorder text-xs text-brand-cyan font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{user?.completedQuizzes?.length || 0} / {Object.keys(LEARNING_MODULES).length} Mastered</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Sidebar Navigator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Categories */}
          <div className="glass-panel p-4 rounded-2xl border border-surfaceBorder/70 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surfaceLight border border-surfaceBorder rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[11px]">
              {['all', 'sorting', 'searching', 'graph', 'dynamic-programming'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-accent text-white shadow'
                      : 'bg-surfaceLight/60 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Module List */}
          <div className="glass-panel p-3 rounded-2xl border border-surfaceBorder/70 max-h-[600px] overflow-y-auto space-y-1">
            {filteredModules.map((m) => {
              const active = m.id === selectedAlgoId;
              const completed = user?.completedQuizzes?.includes(m.id);

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectModule(m.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    active
                      ? 'bg-brand-accent/20 border border-brand-accent/50 text-white shadow-sm'
                      : 'hover:bg-surfaceLight/60 text-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{m.title}</span>
                      {completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] text-gray-400 capitalize">{m.category.replace('-', ' ')}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${active ? 'text-brand-cyan' : 'text-gray-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Module View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surfaceBorder/60">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">{moduleData.title}</h2>
                  {isCompleted && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                      Mastered
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{moduleData.summary}</p>
              </div>

              {onNavigateToVisualizer && (
                <button
                  onClick={() => onNavigateToVisualizer(moduleData.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-accent/20 hover:bg-brand-accent/30 text-brand-cyan border border-brand-cyan/40 text-xs font-semibold transition-all"
                >
                  <span>Open in Visualizer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Working Principle */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Working Principle</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed bg-surfaceLight/40 p-4 rounded-xl border border-surfaceBorder/50">
                {moduleData.principle}
              </p>
            </div>

            {/* Step-by-step Pseudocode */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <span>Step-by-Step Pseudocode</span>
              </h3>
              <div className="bg-[#0B0F19] p-4 rounded-xl border border-surfaceBorder font-mono text-xs text-gray-200 overflow-x-auto space-y-1">
                {(algoMeta?.pseudocode || []).map((line, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-gray-600 select-none text-right w-4">{idx + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real World Applications & Pitfalls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Applications */}
              <div className="bg-surfaceLight/40 p-4 rounded-xl border border-surfaceBorder/50 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Real-World Applications</span>
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  {moduleData.applications?.map((app, idx) => (
                    <li key={idx} className="leading-relaxed">{app}</li>
                  ))}
                </ul>
              </div>

              {/* Pitfalls */}
              <div className="bg-surfaceLight/40 p-4 rounded-xl border border-surfaceBorder/50 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Common Mistakes & Traps</span>
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  {moduleData.pitfalls?.map((pit, idx) => (
                    <li key={idx} className="leading-relaxed">{pit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Module Quiz */}
            <div className="pt-6 border-t border-surfaceBorder/60 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-cyan" />
                  <span>Knowledge Check Quiz</span>
                </h3>
                <span className="text-xs text-amber-400 font-semibold">+50 XP per correct question</span>
              </div>

              {moduleData.quiz?.map((q, qIdx) => {
                const selectedOpt = quizAnswers[qIdx];
                const isCorrect = selectedOpt === q.correct;

                return (
                  <div key={qIdx} className="bg-surfaceLight/50 p-4 rounded-xl border border-surfaceBorder/60 space-y-3">
                    <p className="text-xs font-semibold text-gray-100">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let btnStyle = 'bg-surface/80 border-surfaceBorder hover:bg-surfaceLight text-gray-300';

                        if (submittedQuiz) {
                          if (optIdx === q.correct) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-300';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-brand-accent/20 border-brand-accent text-white font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submittedQuiz}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {submittedQuiz && (
                      <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                        isCorrect ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      }`}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {!submittedQuiz ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < (moduleData.quiz?.length || 1)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-accent to-brand-purple hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-brand-purple/25 transition-all"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setSubmittedQuiz(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-surfaceLight hover:bg-surfaceLight/80 text-gray-300 font-semibold text-xs transition-all border border-surfaceBorder"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
