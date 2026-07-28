'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Option {
  id: string;
  label: string;
  dots: boolean[];
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  // The sequence shown to the user as the question prompt
  givenSequence: boolean[][]; 
  correctOptionId: string;
  options: Option[];
}

export default function PatternActivityPage() {
  const router = useRouter();

  // Exercise Questions Dataset with explicit prompt sequences
  const questions: Question[] = [
    {
      id: 1,
      title: 'Which pattern completes the sequence?',
      subtitle: 'Observe how the dots fill in from left to right.',
      givenSequence: [
        [true, false, false, false], // Step 1: 1 dot
        [true, true, false, false],  // Step 2: 2 dots
      ],
      correctOptionId: 'C',
      options: [
        { id: 'A', label: 'Pattern A', dots: [true, false, false, false] },
        { id: 'B', label: 'Pattern B', dots: [true, true, false, false] },
        { id: 'C', label: 'Pattern C', dots: [true, true, true, false] }, // Correct (3 dots)
      ],
    },
    {
      id: 2,
      title: 'Which pattern completes the sequence?',
      subtitle: 'Watch how the alternating pattern evolves.',
      givenSequence: [
        [true, false, true, false],  // Step 1: Alternate 1
        [false, true, false, true],  // Step 2: Alternate 2
      ],
      correctOptionId: 'A',
      options: [
        { id: 'A', label: 'Pattern A', dots: [true, false, true, false] }, // Correct (Repeat step 1)
        { id: 'B', label: 'Pattern B', dots: [true, true, true, true] },
        { id: 'C', label: 'Pattern C', dots: [false, false, false, false] },
      ],
    },
    {
      id: 3,
      title: 'Which pattern completes the sequence?',
      subtitle: 'Look at the expanding outer boundary.',
      givenSequence: [
        [false, false, false, false], // Step 1: Empty
        [true, false, false, true],   // Step 2: Outer corners
      ],
      correctOptionId: 'B',
      options: [
        { id: 'A', label: 'Pattern A', dots: [false, true, true, false] },
        { id: 'B', label: 'Pattern B', dots: [true, true, true, true] }, // Correct (Fully filled)
        { id: 'C', label: 'Pattern C', dots: [false, true, false, true] },
      ],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuestion = questions[currentStep];

  const handleNext = useCallback(() => {
    if (!selectedOption) return;

    if (selectedOption === activeQuestion.correctOptionId) {
      setScore((prev) => prev + 1);
    }

    if (currentStep + 1 < questions.length) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  }, [selectedOption, activeQuestion, currentStep, questions.length]);

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      const optionIds = activeQuestion.options.map((opt) => opt.id);
      const currentIndex = selectedOption ? optionIds.indexOf(selectedOption) : -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % optionIds.length;
        setSelectedOption(optionIds[nextIndex]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? optionIds.length - 1 : currentIndex - 1;
        setSelectedOption(optionIds[prevIndex]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (selectedOption) {
          handleNext();
        } else if (optionIds.length > 0) {
          setSelectedOption(optionIds[0]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, activeQuestion, isFinished, handleNext]);

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2C3338] font-sans antialiased flex flex-col justify-between p-6">
      
      {/* Header Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#E8E2D5]/60">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-[#6B7280] hover:text-[#2C3338] font-semibold text-sm transition-colors flex items-center gap-2"
        >
          ← Exit Activity
        </button>

        {!isFinished && (
          <div className="text-sm font-bold text-[#6B7280]">
            Pattern Recognition • Question {currentStep + 1} of {questions.length}
          </div>
        )}
      </header>

      {/* Main Workspace */}
      {!isFinished ? (
        <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-6 space-y-8">
          
          {/* Question Title & Subtitle */}
          <div className="text-center space-y-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3338]">
              {activeQuestion.title}
            </h1>
            <p className="text-base text-[#6B7280] font-medium">
              {activeQuestion.subtitle}
            </p>
          </div>

          {/* GIVEN SEQUENCE PROMPT (The missing initial pattern!) */}
          <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] shadow-xs flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            {activeQuestion.givenSequence.map((pattern, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-6">
                
                {/* Individual Pattern Card in Sequence */}
                <div className="bg-[#F8F5F0] rounded-xl px-5 py-4 border border-[#E0D7C8] flex items-center gap-2.5">
                  {pattern.map((isFilled, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`
                        w-5 h-5 rounded-full
                        ${isFilled ? 'bg-[#1B2A4A]' : 'bg-transparent border-2 border-[#1B2A4A]/30'}
                      `}
                    />
                  ))}
                </div>

                {/* Arrow indicator */}
                <span className="text-[#6B7280] font-bold text-lg">→</span>
              </div>
            ))}

            {/* Target Missing Step Box */}
            <div className="bg-[#F8F5F0] rounded-xl px-6 py-4 border-2 border-dashed border-[#1B2A4A]/40 flex items-center justify-center min-w-[120px]">
              <span className="text-xl font-extrabold text-[#1B2A4A]">?</span>
            </div>
          </div>

          {/* ANSWER OPTIONS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl pt-2">
            {activeQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={`
                    relative rounded-2xl p-8 transition-all duration-200 ease-out cursor-pointer
                    flex flex-col items-center justify-center space-y-6 border
                    ${
                      isSelected
                        ? 'bg-[#F2EBDC] border-[#1B2A4A] ring-2 ring-[#1B2A4A]/20 shadow-md scale-[1.02]'
                        : 'bg-[#F5F0E6] border-[#E8E0D2] hover:bg-[#EFE7D8] hover:border-[#D8CEBC]'
                    }
                  `}
                >
                  {/* Navy Blue Sequence Dots Container */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    {option.dots.map((isFilled, idx) => (
                      <span
                        key={idx}
                        className={`
                          w-5 h-5 rounded-full transition-all
                          ${
                            isFilled
                              ? 'bg-[#1B2A4A] shadow-xs'
                              : 'bg-transparent border-2 border-[#1B2A4A]/30'
                          }
                        `}
                      />
                    ))}
                  </div>

                  {/* Option Label */}
                  <span className="text-base sm:text-lg font-bold text-[#2C3338]">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Confirm / Next Button */}
          <div className="pt-2">
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className="px-8 py-3.5 bg-[#1B2A4A] hover:bg-[#121D34] text-white font-semibold text-sm rounded-xl transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {currentStep + 1 === questions.length ? 'Finish Activity' : 'Next Question'}
            </button>
          </div>

        </main>
      ) : (
        /* Completion Screen */
        <main className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center text-center py-12 space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-3xl shadow-sm">
            🎉
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-[#2C3338]">Activity Complete!</h2>
            <p className="text-base text-[#6B7280] font-medium">
              You scored {score} out of {questions.length} on Pattern Recognition.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3.5 bg-[#1B2A4A] hover:bg-[#121D34] text-white font-semibold rounded-xl transition-all shadow-xs"
          >
            Return to Dashboard
          </button>
        </main>
      )}

      {/* Footer Instructions */}
      <footer className="max-w-5xl mx-auto w-full text-center py-4 border-t border-[#E8E2D5]/40">
        <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium tracking-wide">
          Use arrow keys to navigate. Enter or Space to select.
        </p>
      </footer>

    </div>
  );
}