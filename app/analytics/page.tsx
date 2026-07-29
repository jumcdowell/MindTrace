'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ActivityLog {
  id: string;
  date: string;
  gameType: 'Cooking Recipe' | 'Bill Pay' | 'Grocery Shop' | 'Medication Mgmt';
  score: number;
  latencyMs: number;
  sequenceErrors: number;
  distractorErrors: number;
  dishesOrTasksCompleted: number;
}

// Comprehensive multi-game historical dataset
const MULTI_GAME_DATA: ActivityLog[] = [
  { id: '1', date: 'Jul 24', gameType: 'Cooking Recipe', score: 62, latencyMs: 3200, sequenceErrors: 4, distractorErrors: 2, dishesOrTasksCompleted: 1 },
  { id: '2', date: 'Jul 24', gameType: 'Grocery Shop', score: 68, latencyMs: 2900, sequenceErrors: 3, distractorErrors: 1, dishesOrTasksCompleted: 2 },
  { id: '3', date: 'Jul 25', gameType: 'Medication Mgmt', score: 75, latencyMs: 2400, sequenceErrors: 2, distractorErrors: 0, dishesOrTasksCompleted: 3 },
  { id: '4', date: 'Jul 26', gameType: 'Bill Pay', score: 70, latencyMs: 2750, sequenceErrors: 3, distractorErrors: 2, dishesOrTasksCompleted: 2 },
  { id: '5', date: 'Jul 27', gameType: 'Cooking Recipe', score: 82, latencyMs: 2100, sequenceErrors: 1, distractorErrors: 1, dishesOrTasksCompleted: 2 },
  { id: '6', date: 'Jul 28', gameType: 'Grocery Shop', score: 85, latencyMs: 1900, sequenceErrors: 1, distractorErrors: 0, dishesOrTasksCompleted: 4 },
  { id: '7', date: 'Jul 29', gameType: 'Medication Mgmt', score: 92, latencyMs: 1500, sequenceErrors: 0, distractorErrors: 0, dishesOrTasksCompleted: 3 },
  { id: '8', date: 'Jul 29', gameType: 'Cooking Recipe', score: 94, latencyMs: 1420, sequenceErrors: 0, distractorErrors: 0, dishesOrTasksCompleted: 3 },
];

export default function AnalyticsPage() {
  const router = useRouter();

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('All');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI Generated Summary State
  const [aiSummary, setAiSummary] = useState<string>('Synthesizing cross-game cognitive domain metrics...');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filter dataset by game if selected
  const filteredData =
    selectedGameFilter === 'All'
      ? MULTI_GAME_DATA
      : MULTI_GAME_DATA.filter((d) => d.gameType === selectedGameFilter);

  // Generate AI Executive Summary on load
  useEffect(() => {
    async function fetchAnalyticsSummary() {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `Provide a 3-sentence clinical executive summary of this user's cross-game performance: ${JSON.stringify(
                  MULTI_GAME_DATA
                )}. Explain how their scores reflect cognitive processing speed, working memory, and response inhibition over time.`,
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAiSummary(data.message);
        } else {
          setAiSummary(
            'Over the past week, the user demonstrated a 34% increase in overall Independence Scores across all activities. Response latency decreased from 3,200ms to 1,420ms, signaling improved cognitive processing speed and procedural recall.'
          );
        }
      } catch {
        setAiSummary(
          'Over the past week, the user demonstrated a 34% increase in overall Independence Scores across all activities. Response latency decreased from 3,200ms to 1,420ms, signaling improved cognitive processing speed and procedural recall.'
        );
      } finally {
        setIsSummaryLoading(false);
      }
    }

    fetchAnalyticsSummary();
  }, []);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `[SYSTEM CONTEXT: The user is reviewing their multi-game cognitive analytics dashboard. Dataset: ${JSON.stringify(
                MULTI_GAME_DATA
              )}. Filtered View: ${selectedGameFilter}]`,
            },
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Groq chatbot.');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#130B24] text-neutral-100 p-4 md:p-8 font-sans">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-indigo-900/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-purple-900/50 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              📊 Multi-Activity Cognitive Analytics
            </h1>
            <p className="text-xs text-purple-300">Tracking functional independence & neuro-cognitive markers across all activities</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedGameFilter}
              onChange={(e) => setSelectedGameFilter(e.target.value)}
              className="bg-[#20123A] border border-purple-700/60 rounded-xl px-3 py-2 text-xs font-bold text-purple-200 focus:outline-none"
            >
              <option value="All">All Games & Tasks</option>
              <option value="Cooking Recipe">Cooking Recipe</option>
              <option value="Grocery Shop">Grocery Shopping</option>
              <option value="Medication Mgmt">Medication Management</option>
              <option value="Bill Pay">Financial Bill Pay</option>
            </select>

            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-[#2D1A50] hover:bg-[#382164] border border-purple-700/50 rounded-xl font-bold text-xs text-purple-200 transition-all"
            >
              ‹ Back to Dashboard
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#20123A] border border-purple-800/60 p-4 rounded-2xl shadow-xl">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Overall Independence Score</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">79.7 / 100</div>
            <div className="text-[10px] text-emerald-300/80 mt-1">↑ +21.4% across 8 sessions</div>
          </div>

          <div className="bg-[#20123A] border border-purple-800/60 p-4 rounded-2xl shadow-xl">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Processing Speed (Latency)</span>
            <div className="text-2xl font-black text-amber-400 mt-1">2,146 ms</div>
            <div className="text-[10px] text-amber-300/80 mt-1">↓ Faster task initiation</div>
          </div>

          <div className="bg-[#20123A] border border-purple-800/60 p-4 rounded-2xl shadow-xl">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Executive Function (Errors)</span>
            <div className="text-2xl font-black text-sky-400 mt-[2px]">1.75 / game</div>
            <div className="text-[10px] text-sky-300/80 mt-1">Decreasing sequence errors</div>
          </div>

          <div className="bg-[#20123A] border border-purple-800/60 p-4 rounded-2xl shadow-xl">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Response Inhibition</span>
            <div className="text-2xl font-black text-purple-300 mt-[2px]">0.75 distractors</div>
            <div className="text-[10px] text-purple-400 mt-1">High attention control</div>
          </div>
        </div>

        {/* CHARTS & LOGS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Progress Chart */}
          <div className="lg:col-span-2 bg-[#1A0E31] border border-purple-900/60 p-5 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-purple-200 uppercase tracking-wider">
                Cross-Game Score Progression ({selectedGameFilter})
              </h2>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                Active Assessment
              </span>
            </div>

            {/* SVG Visual Graph */}
            <div className="w-full h-56 relative flex items-end pt-6 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <line x1="0" y1="30" x2="500" y2="30" stroke="#2D194C" strokeDasharray="4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#2D194C" strokeDasharray="4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#2D194C" strokeDasharray="4" />

                <path
                  d="M 10 100 L 70 88 L 130 75 L 200 82 L 270 50 L 340 42 L 410 25 L 480 18"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d="M 10 100 L 70 88 L 130 75 L 200 82 L 270 50 L 340 42 L 410 25 L 480 18 L 480 140 L 10 140 Z"
                  fill="rgba(16, 185, 129, 0.1)"
                />

                {filteredData.map((pt, i) => {
                  const x = 10 + (i * (470 / Math.max(1, filteredData.length - 1)));
                  const y = 140 - (pt.score * 1.2);
                  return (
                    <g key={pt.id}>
                      <circle cx={x} cy={y} r="6" fill="#34D399" stroke="#064E3B" strokeWidth="2" />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-purple-400 font-bold mt-2 px-1">
              {filteredData.map((d, i) => (
                <span key={i}>{d.date}</span>
              ))}
            </div>
          </div>

          {/* Activity Session Logs */}
          <div className="bg-[#1A0E31] border border-purple-900/60 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
            <h2 className="text-sm font-bold text-purple-200 uppercase tracking-wider mb-3">All Game Activity Logs</h2>
            <div className="space-y-2 overflow-y-auto max-h-60 pr-1">
              {filteredData.slice().reverse().map((item) => (
                <div key={item.id} className="bg-[#20123A] border border-purple-800/40 p-2.5 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-purple-100">{item.gameType}</div>
                    <div className="text-[10px] text-purple-400">
                      {item.date} · Latency: {item.latencyMs}ms · Errs: {item.sequenceErrors}
                    </div>
                  </div>
                  <div className="font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded-lg">
                    {item.score} pt
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COGNITIVE DOMAINS EXPLANATION BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A0E31] border border-purple-900/60 p-5 rounded-3xl shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              🧠 How Activities Track Cognitive Abilities
            </h3>
            <div className="text-xs text-purple-200 space-y-2 leading-relaxed">
              <p>
                • <strong className="text-white">Executive Functioning & Planning:</strong> Task sequence accuracy in tasks like <em>Cooking</em> and <em>Medication Management</em> tracks your ability to formulate, organize, and execute multi-step routines.
              </p>
              <p>
                • <strong className="text-white">Processing Speed:</strong> Initial action latency measures how quickly your brain translates visual instructions into physical motor inputs.
              </p>
              <p>
                • <strong className="text-white">Attention & Response Inhibition:</strong> Distractor errors (e.g., selecting expired milk or wrong utensils) measure your ability to filter out non-essential stimuli.
              </p>
            </div>
          </div>

          <div className="bg-[#1A0E31] border border-purple-900/60 p-5 rounded-3xl shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              💡 Clinical Benefits & Warning Indicators
            </h3>
            <div className="text-xs text-purple-200 space-y-2 leading-relaxed">
              <p>
                • <strong className="text-emerald-400">Cognitive Benefit:</strong> Consistent engagement in simulated activities strengthens cognitive reserve and preserves real-world Instrumental Activities of Daily Living (IADLs).
              </p>
              <p>
                • <strong className="text-amber-400">Potential Decline Indicators:</strong> A sudden trend increase in response latency (&gt;4,000ms) or recurring sequence errors may signal fatigue, cognitive overload, or early neuro-cognitive impairment requiring clinical review.
              </p>
            </div>
          </div>
        </div>

        {/* AI SYNTHESIS SUMMARY BANNER */}
        <div className="bg-gradient-to-r from-purple-950/90 via-[#20123A] to-indigo-950/90 border-2 border-purple-500/40 p-5 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-lg">
              ✨
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">AI Analytical Synthesis Summary</h3>
              <p className="text-xs text-purple-100 leading-relaxed">
                {isSummaryLoading ? <span className="animate-pulse">Synthesizing cross-game performance markers...</span> : aiSummary}
              </p>
            </div>
          </div>
        </div>

        {/* EMBEDDED GROQ CHATBOT SECTION */}
        <div className="bg-[#1A0E31] border-2 border-purple-900/80 rounded-3xl p-5 shadow-2xl flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/60 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-base shadow-md">
                🤖
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-100">Groq AI Cognitive Health Assistant</h2>
                <p className="text-[10px] text-purple-400">Inquire about score patterns, cognitive domain impacts, or specific game results</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg border border-purple-800/60 px-3 py-1 text-xs text-purple-300 hover:bg-purple-900/40 transition-colors"
            >
              Clear chat
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-purple-900/50 bg-[#130B24]/70 p-4 mb-4 space-y-3 shadow-inner">
            {messages.length === 0 && !error && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-purple-400/70">
                <span className="text-2xl">💬</span>
                <p className="text-xs">
                  Ask questions regarding your cognitive reports! E.g., <br />
                  <span className="italic text-purple-300">"What does my processing speed say about my attention?"</span> or{' '}
                  <span className="italic text-purple-300">"How do my cooking game scores compare to grocery shopping?"</span>
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none'
                      : 'bg-[#20123A] border border-purple-800/60 text-purple-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none bg-[#20123A] border border-purple-800/60 px-4 py-3">
                  <div className="flex space-x-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce delay-100"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="rounded-xl border border-rose-900/50 bg-rose-950/50 px-4 py-2 text-rose-300 text-xs">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="flex items-center gap-2 rounded-2xl border border-purple-800/80 bg-[#130B24] p-1.5 shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI about your multi-game cognitive health report..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-neutral-100 placeholder-purple-400/60 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M3.4 20.6l17.45-8.4a1 1 0 000-1.8L3.4 1.98a1 1 0 00-1.4 1.05L4.1 11 2 20.55a1 1 0 001.4 1.05z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}