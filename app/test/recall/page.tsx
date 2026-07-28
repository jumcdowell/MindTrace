'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

interface StoryData {
  id: string;
  title: string;
  category: string;
  text: string;
  keyWords: string[];
  questions: Question[];
}

const STORIES: StoryData[] = [
  {
    id: 'lighthouse-keeper',
    title: 'The Lighthouse Keeper',
    category: 'Maritime History',
    text: `In October 1884, Captain Miller took charge of the Sentinel Point lighthouse along the rocky coastline of Maine. Every evening at 5:30 PM, he climbed 112 spiral stairs to polish the silver reflector and light the oil lamp. During a severe storm named Arthur, Miller spotted a stranded vessel called the Blue Heron. Using a brass telegraph and a signal flare, he alerted the rescue crew, saving 14 sailors. In his leather journal, he recorded the night's events alongside a drawing of a golden compass.`,
    keyWords: ['Captain Miller', '1884', 'Sentinel Point', '112 stairs', 'Arthur', 'Blue Heron', '14 sailors', 'Golden compass'],
    questions: [
      {
        id: 1,
        question: 'What year did Captain Miller take charge of the lighthouse?',
        options: ['1874', '1884', '1892', '1901'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'How many spiral stairs did Captain Miller climb each evening?',
        options: ['98', '112', '125', '140'],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: 'What was the name of the severe storm mentioned in the story?',
        options: ['Arthur', 'Baltic', 'Atlantic', 'Gale'],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: 'What was the name of the stranded vessel?',
        options: ['Golden Compass', 'Sea Sentinel', 'Blue Heron', 'Maine Star'],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: 'How many sailors were saved during the rescue operation?',
        options: ['8', '10', '14', '18'],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'botanical-discovery',
    title: 'The Hidden Greenhouse',
    category: 'Botanical Expedition',
    text: `Dr. Elena Vance led an expedition into the high mist forests of Costa Rica in June 2012. Inside an abandoned glass house labeled Greenhouse #4, she discovered a rare silver orchid with 14 distinct petals. Unlike typical orchids, this specimen bloomed exclusively at midnight and emitted a faint scent of cinnamon. She carefully preserved three soil samples in blue ceramic jars and logged the coordinates near the Rio Verde river before returning to the university museum.`,
    keyWords: ['Dr. Elena Vance', 'Costa Rica', 'Greenhouse #4', 'Silver orchid', '14 petals', 'Midnight', 'Cinnamon', 'Rio Verde'],
    questions: [
      {
        id: 1,
        question: 'Who led the botanical expedition in Costa Rica?',
        options: ['Dr. Sarah Miller', 'Dr. Elena Vance', 'Dr. Claire Bennett', 'Dr. Maria Rosa'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What was unique about the silver orchid’s bloom time?',
        options: ['Bloomed at sunrise', 'Bloomed at noon', 'Bloomed at midnight', 'Bloomed during rainfall'],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: 'How many petals did the silver orchid have?',
        options: ['8', '10', '12', '14'],
        correctAnswer: 3,
      },
      {
        id: 4,
        question: 'What scent did the orchid emit when blooming?',
        options: ['Vanilla', 'Cinnamon', 'Jasmine', 'Eucalyptus'],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: 'What type of container was used to preserve the soil samples?',
        options: ['Glass vials', 'Blue ceramic jars', 'Steel canisters', 'Wooden boxes'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'artisan-bakery',
    title: 'The Morning Bake',
    category: 'Daily Routine',
    text: `At 4:00 AM every morning, Master Baker Pierre unlocked the doors of Le Petit Souffle bakery in Lyons. Wearing his signature red apron, he began preparing sourdough loaves using a 50-year-old starter culture kept in a copper pot. His most famous creation was a savory loaf infused with fresh rosemary, roasted garlic, and wild clover honey. By 7:30 AM, local residents lined up outside as 80 fresh loaves were pulled from the stone oven.`,
    keyWords: ['Pierre', '4:00 AM', 'Lyons', 'Red apron', 'Copper pot', 'Rosemary', 'Wild clover honey', '80 loaves'],
    questions: [
      {
        id: 1,
        question: 'What time did Baker Pierre open the bakery each morning?',
        options: ['3:30 AM', '4:00 AM', '5:00 AM', '6:00 AM'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What color was Pierre’s signature apron?',
        options: ['Blue', 'White', 'Red', 'Green'],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: 'What material was the starter culture container made of?',
        options: ['Glass', 'Copper', 'Ceramic', 'Cast Iron'],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: 'Which sweet ingredient was added to the specialty rosemary loaf?',
        options: ['Maple syrup', 'Wild clover honey', 'Brown sugar', 'Dried figs'],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: 'How many fresh loaves were pulled from the stone oven by 7:30 AM?',
        options: ['50', '65', '80', '100'],
        correctAnswer: 2,
      },
    ],
  },
];

type Phase = 'READING' | 'DELAY' | 'RECALL' | 'COMPLETED';

export default function StoryRecallPage() {
  const router = useRouter();

  const [activeStory, setActiveStory] = useState<StoryData | null>(null);
  const [phase, setPhase] = useState<Phase>('READING');

  // Reading Timer
  const [readSeconds, setReadSeconds] = useState(0);

  // Distractor Phase state
  const [delayCountdown, setDelayCountdown] = useState(15);
  const [distractorAnswer, setDistractorAnswer] = useState('');
  const [distractorSolved, setDistractorSolved] = useState(false);

  // Recall Phase state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [wordChecklist, setWordChecklist] = useState<Record<string, boolean>>({});

  // Score metrics
  const [score, setScore] = useState(0);

  // Initialize random story
  const initExercise = useCallback(() => {
    const saved = localStorage.getItem('mindtrace_completed_stories');
    let completedIds: string[] = saved ? JSON.parse(saved) : [];

    let available = STORIES.filter((s) => !completedIds.includes(s.id));
    if (available.length === 0) {
      completedIds = [];
      localStorage.setItem('mindtrace_completed_stories', JSON.stringify([]));
      available = [...STORIES];
    }

    const chosen = available[Math.floor(Math.random() * available.length)];
    setActiveStory(chosen);

    setPhase('READING');
    setReadSeconds(0);
    setDelayCountdown(15);
    setDistractorAnswer('');
    setDistractorSolved(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setWordChecklist({});
    setScore(0);
  }, []);

  useEffect(() => {
    initExercise();
  }, [initExercise]);

  // Reading time counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'READING') {
      interval = setInterval(() => setReadSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Distractor Delay countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'DELAY' && delayCountdown > 0) {
      interval = setInterval(() => {
        setDelayCountdown((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'DELAY' && delayCountdown === 0) {
      setPhase('RECALL');
    }
    return () => clearInterval(interval);
  }, [phase, delayCountdown]);

  const handleStartDelay = () => {
    setPhase('DELAY');
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleNextQuestion = () => {
    if (!activeStory) return;
    if (currentQuestionIndex < activeStory.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate Final Score
      let correctCount = 0;
      activeStory.questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount += 1;
        }
      });

      const finalScorePct = Math.round((correctCount / activeStory.questions.length) * 100);
      setScore(finalScorePct);
      setPhase('COMPLETED');

      // Save progress
      const saved = localStorage.getItem('mindtrace_completed_stories');
      const ids: string[] = saved ? JSON.parse(saved) : [];
      if (!ids.includes(activeStory.id)) {
        ids.push(activeStory.id);
        localStorage.setItem('mindtrace_completed_stories', JSON.stringify(ids));
      }
    }
  };

  if (!activeStory) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center text-[#6B7280]">
        Loading Exercise...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2C3338] font-sans antialiased flex flex-col justify-between p-4 sm:p-6 select-none">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#E8E2D5]">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-[#6B7280] hover:text-[#2C3338] font-semibold text-sm transition-colors flex items-center gap-2"
        >
          ← Dashboard
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#EAE4D9] rounded-full text-[#4A6C7C]">
            {activeStory.category}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-6 space-y-6">
        
        {/* PHASE 1: STORY READING */}
        {phase === 'READING' && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold text-[#7A9A7D] uppercase tracking-widest">
                Phase 1 • Verbal Memorization
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3338]">
                {activeStory.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                Read the passage carefully. Pay close attention to names, numbers, dates, and details.
              </p>
            </div>

            {/* Story Card */}
            <div className="bg-[#F8F5F0] border-2 border-[#E0D7C8] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 relative">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-[#6B7280] bg-[#EAE4D9] px-2.5 py-1 rounded-lg">
                ⏱️ {readSeconds}s
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-[#2C3338] font-serif">
                {activeStory.text}
              </p>
            </div>

            {/* Key Word Preview Chips */}
            <div className="bg-[#EAE4D9] rounded-2xl p-4 border border-[#E0D7C8] space-y-2">
              <span className="text-xs font-extrabold text-[#4A6C7C] uppercase tracking-wider block">
                Target Recall Elements
              </span>
              <div className="flex flex-wrap gap-2">
                {activeStory.keyWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#F8F5F0] border border-[#E0D7C8] rounded-lg text-xs font-semibold text-[#2C3338]"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={handleStartDelay}
                className="px-8 py-3.5 bg-[#1B2A4A] hover:bg-[#121D34] text-white font-semibold text-sm rounded-xl transition-all shadow-md"
              >
                I've Memorized the Story → Begin Delayed Phase
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: DISTRACTOR / DELAY PHASE */}
        {phase === 'DELAY' && (
          <div className="w-full max-w-lg bg-[#EAE4D9] border-2 border-[#E0D7C8] rounded-2xl p-8 text-center space-y-6 shadow-md animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#C36055] uppercase tracking-widest">
                Phase 2 • Delayed Memory Buffer
              </span>
              <h2 className="text-xl font-extrabold text-[#2C3338]">
                Clearing Short-Term Memory
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                Solve this simple math challenge while the delay timer counts down to shift memory into delayed recall.
              </p>
            </div>

            {/* Countdown Ring */}
            <div className="w-24 h-24 rounded-full bg-[#1B2A4A] text-white flex flex-col items-center justify-center mx-auto shadow-inner">
              <span className="text-3xl font-extrabold">{delayCountdown}</span>
              <span className="text-[10px] uppercase font-semibold text-[#7A9A7D]">Secs Left</span>
            </div>

            {/* Math Distractor Box */}
            <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#E0D7C8] space-y-3">
              <div className="text-sm font-bold text-[#2C3338]">
                Quick Math: What is <span className="text-[#1B2A4A]">17 + 28</span>?
              </div>
              <div className="flex justify-center gap-2">
                <input
                  type="number"
                  value={distractorAnswer}
                  onChange={(e) => {
                    setDistractorAnswer(e.target.value);
                    if (e.target.value === '45') setDistractorSolved(true);
                  }}
                  placeholder="Your answer"
                  className="w-32 px-3 py-2 text-center bg-[#EAE4D9] border border-[#E0D7C8] rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>
              {distractorSolved && (
                <span className="text-xs font-bold text-[#7A9A7D] block">
                  ✓ Correct! Waiting for delay timer...
                </span>
              )}
            </div>
          </div>
        )}

        {/* PHASE 3: RECALL & EVALUATION */}
        {phase === 'RECALL' && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <span className="text-xs font-extrabold text-[#4A6C7C] uppercase tracking-widest">
                Phase 3 • Delayed Recall Evaluation
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C3338]">
                Story Memory Test
              </h2>
              <p className="text-xs text-[#6B7280] font-medium">
                Question {currentQuestionIndex + 1} of {activeStory.questions.length}
              </p>
            </div>

            {/* Current Question Card */}
            {(() => {
              const q = activeStory.questions[currentQuestionIndex];
              const isSelected = selectedAnswers[q.id] !== undefined;

              return (
                <div className="bg-[#EAE4D9] border-2 border-[#E0D7C8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C3338]">
                    {q.question}
                  </h3>

                  <div className="space-y-3">
                    {q.options.map((opt, optionIdx) => {
                      const selected = selectedAnswers[q.id] === optionIdx;
                      return (
                        <button
                          key={optionIdx}
                          onClick={() => handleSelectOption(q.id, optionIdx)}
                          className={`
                            w-full text-left px-5 py-3.5 rounded-xl border transition-all text-sm font-semibold flex items-center justify-between
                            ${
                              selected
                                ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-xs'
                                : 'bg-[#F8F5F0] text-[#2C3338] border-[#E0D7C8] hover:border-[#4A6C7C]'
                            }
                          `}
                        >
                          <span>{opt}</span>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${selected ? 'border-white bg-white/20' : 'border-[#E0D7C8]'}`}>
                            {selected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      disabled={!isSelected}
                      onClick={handleNextQuestion}
                      className={`
                        px-6 py-3 font-semibold text-sm rounded-xl transition-all shadow-xs
                        ${
                          isSelected
                            ? 'bg-[#1B2A4A] hover:bg-[#121D34] text-white'
                            : 'bg-[#E0D7C8] text-[#9CA3AF] cursor-not-allowed'
                        }
                      `}
                    >
                      {currentQuestionIndex < activeStory.questions.length - 1
                        ? 'Next Question →'
                        : 'Complete Recall Test'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PHASE 4: COMPLETED / SCORE BREAKDOWN */}
        {phase === 'COMPLETED' && (
          <div className="w-full max-w-lg bg-[#F8F5F0] border-2 border-[#E0D7C8] rounded-2xl p-8 text-center space-y-6 shadow-xl animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-3xl mx-auto shadow-sm">
              📖
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#2C3338]">Exercise Completed!</h2>
              <p className="text-sm text-[#6B7280]">
                Verbal memory and delayed processing evaluation.
              </p>
            </div>

            {/* Score Metrics Box */}
            <div className="bg-[#EAE4D9] rounded-xl p-5 border border-[#E0D7C8] grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#6B7280] font-semibold uppercase">Accuracy Score</div>
                <div className="text-2xl font-extrabold text-[#1B2A4A] mt-0.5">
                  {score}%
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] font-semibold uppercase">Read Time</div>
                <div className="text-2xl font-extrabold text-[#2C3338] mt-0.5">
                  {readSeconds}s
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={initExercise}
                className="w-full py-3.5 bg-[#1B2A4A] hover:bg-[#121D34] text-white font-semibold rounded-xl transition-all shadow-xs text-sm"
              >
                Try Another Story
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3.5 bg-[#EAE4D9] hover:bg-[#E0D7C8] text-[#2C3338] font-semibold rounded-xl transition-all text-sm"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-2 border-t border-[#E8E2D5]">
        <p className="text-xs text-[#9CA3AF] font-medium">
          Cognitive Exercise • Word & Story Recall • Verbal Memory & Delayed Processing
        </p>
      </footer>

    </div>
  );
}