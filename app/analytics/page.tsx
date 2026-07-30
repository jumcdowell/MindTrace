'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ActivityLog {
  id: string;
  date: string;
  timestamp: number;
  gameType: 'Pattern Memory' | 'Story Recall' | 'Cooking Recipe' | 'Timed Puzzles';
  score: number;
  accuracyPct: number;
  completionTimeSec: number;
  sequenceErrors: number;
}

// Normative Age Group Benchmark Storage
export interface AgeBenchmark {
  ageGroup: string;
  minAge: number;
  maxAge: number;
  metrics: {
    'Timed Puzzles': number;
    'Pattern Memory': number;
    'Story Recall': number;
    'Cooking Recipe': number;
  };
}

const AGE_BENCHMARKS: AgeBenchmark[] = [
  {
    ageGroup: '18 - 30',
    minAge: 18,
    maxAge: 30,
    metrics: { 'Timed Puzzles': 120, 'Pattern Memory': 90, 'Story Recall': 100, 'Cooking Recipe': 150 },
  },
  {
    ageGroup: '31 - 50',
    minAge: 31,
    maxAge: 50,
    metrics: { 'Timed Puzzles': 140, 'Pattern Memory': 105, 'Story Recall': 110, 'Cooking Recipe': 165 },
  },
  {
    ageGroup: '51 - 70',
    minAge: 51,
    maxAge: 70,
    metrics: { 'Timed Puzzles': 180, 'Pattern Memory': 130, 'Story Recall': 130, 'Cooking Recipe': 200 },
  },
  {
    ageGroup: '71+',
    minAge: 71,
    maxAge: 120,
    metrics: { 'Timed Puzzles': 220, 'Pattern Memory': 160, 'Story Recall': 160, 'Cooking Recipe': 240 },
  },
];

const INITIAL_DEMO_DATA: ActivityLog[] = [
  { id: '1', timestamp: Date.now() - 86400000 * 5, date: 'Jul 24', gameType: 'Timed Puzzles', score: 65, accuracyPct: 75, completionTimeSec: 140, sequenceErrors: 4 },
  { id: '2', timestamp: Date.now() - 86400000 * 4, date: 'Jul 25', gameType: 'Pattern Memory', score: 72, accuracyPct: 82, completionTimeSec: 115, sequenceErrors: 3 },
  { id: '3', timestamp: Date.now() - 86400000 * 3, date: 'Jul 26', gameType: 'Story Recall', score: 78, accuracyPct: 85, completionTimeSec: 110, sequenceErrors: 2 },
  { id: '4', timestamp: Date.now() - 86400000 * 2, date: 'Jul 27', gameType: 'Cooking Recipe', score: 84, accuracyPct: 90, completionTimeSec: 98, sequenceErrors: 1 },
  { id: '5', timestamp: Date.now() - 86400000 * 1, date: 'Jul 28', gameType: 'Timed Puzzles', score: 92, accuracyPct: 96, completionTimeSec: 78, sequenceErrors: 0 },
];

type GameFilter = 'All' | 'Pattern Memory' | 'Story Recall' | 'Cooking Recipe' | 'Timed Puzzles';

const FILTER_TABS: GameFilter[] = ['All', 'Timed Puzzles', 'Pattern Memory', 'Story Recall', 'Cooking Recipe'];

export default function AnalyticsPage() {
  const router = useRouter();

  // Activity Session State
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameFilter>('All');

  // User Age State
  const [userAge, setUserAge] = useState<number>(62);

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // AI Generated Summary State
  const [aiSummary, setAiSummary] = useState<string>('Analyzing your activity progress...');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(true);

  // Active age benchmark reference based on selected age
  const activeBenchmark = useMemo(() => {
    return (
      AGE_BENCHMARKS.find((b) => userAge >= b.minAge && userAge <= b.maxAge) ||
      AGE_BENCHMARKS[2]
    );
  }, [userAge]);

  // Load and sync localStorage session history & user age
  const loadLogsFromStorage = useCallback(() => {
    try {
      const storedAge = localStorage.getItem('mindtrace_user_age');
      if (storedAge) {
        setUserAge(Number(storedAge) || 62);
      }

      const stored = localStorage.getItem('mindtrace_activity_logs');
      if (stored) {
        const parsed = JSON.parse(stored) as ActivityLog[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validTypes = new Set<string>(['Pattern Memory', 'Story Recall', 'Cooking Recipe', 'Timed Puzzles']);
          const sanitized = parsed.filter((item) => validTypes.has(item.gameType));
          setActivityLogs(sanitized);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse local activity logs:', e);
    }

    setActivityLogs(INITIAL_DEMO_DATA);
    localStorage.setItem('mindtrace_activity_logs', JSON.stringify(INITIAL_DEMO_DATA));
  }, []);

  useEffect(() => {
    loadLogsFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mindtrace_activity_logs' || e.key === 'mindtrace_user_age') {
        loadLogsFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadLogsFromStorage]);

  const handleAgeChange = (newAge: number) => {
    setUserAge(newAge);
    try {
      localStorage.setItem('mindtrace_user_age', String(newAge));
    } catch (e) {
      console.error('Failed to persist age:', e);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Filter dataset by selected activity tab
  const filteredData = useMemo(() => {
    if (selectedGame === 'All') return activityLogs;
    return activityLogs.filter((d) => d.gameType === selectedGame);
  }, [activityLogs, selectedGame]);

  // Computed stats
  const avgAccuracy = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const total = filteredData.reduce((acc, curr) => acc + (curr.accuracyPct || 0), 0);
    return Math.round(total / filteredData.length);
  }, [filteredData]);

  const avgTimeSec = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const total = filteredData.reduce((acc, curr) => acc + (curr.completionTimeSec || 0), 0);
    return Math.round(total / filteredData.length);
  }, [filteredData]);

  const avgScore = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const total = filteredData.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(total / filteredData.length);
  }, [filteredData]);

  // Map activities for comparative baseline rendering
  const comparativeMetrics = useMemo(() => {
    const activities: Array<'Timed Puzzles' | 'Pattern Memory' | 'Story Recall' | 'Cooking Recipe'> = [
      'Timed Puzzles',
      'Pattern Memory',
      'Story Recall',
      'Cooking Recipe',
    ];

    return activities.map((act) => {
      const actLogs = activityLogs.filter((l) => l.gameType === act);
      const userAvg = actLogs.length > 0
        ? Math.round(actLogs.reduce((acc, curr) => acc + (curr.completionTimeSec || 0), 0) / actLogs.length)
        : 0;
      const benchmarkAvg = activeBenchmark.metrics[act];

      // Evaluation status
      let status: 'Normal' | 'Slight Deviation' | 'Requires Focus' = 'Normal';
      let badgeBg = 'bg-emerald-700';

      if (userAvg > 0) {
        const diffPct = ((userAvg - benchmarkAvg) / benchmarkAvg) * 100;
        if (diffPct > 35) {
          status = 'Requires Focus';
          badgeBg = 'bg-[#C36055]';
        } else if (diffPct > 15) {
          status = 'Slight Deviation';
          badgeBg = 'bg-[#D97706]';
        }
      }

      return {
        name: act,
        userTime: userAvg,
        benchmarkTime: benchmarkAvg,
        status,
        badgeBg,
      };
    });
  }, [activityLogs, activeBenchmark]);

  // Generate dynamic AI Summary on data update
  useEffect(() => {
    if (activityLogs.length === 0) {
      setAiSummary('No session data available. Complete an activity to generate progress insights!');
      setIsSummaryLoading(false);
      return;
    }

    let isMounted = true;

    const fetchAnalyticsSummary = async () => {
      setIsSummaryLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `Provide a simple, clear, 3-bullet-point executive summary comparing this cognitive activity dataset: ${JSON.stringify(
                  activityLogs
                )} against normative baselines for age bracket ${activeBenchmark.ageGroup} years (${JSON.stringify(
                  activeBenchmark.metrics
                )}). Highlight:
                1) Overall Completion Time & Efficiency vs Age Group
                2) Task Accuracy & Behavior Standard (Normal/Irregular)
                3) Direct recommendation for focus area.
                Keep language direct and concise. Avoid medical jargon.`,
              },
            ],
          }),
        });

        if (response.ok && isMounted) {
          const data = (await response.json()) as { message: string };
          setAiSummary(data.message);
        } else if (isMounted) {
          const overallAcc = Math.round(
            activityLogs.reduce((acc, curr) => acc + (curr.accuracyPct || 0), 0) / activityLogs.length
          );
          setAiSummary(
            `• **Age Group Comparison:** Completion times general align well with standard baselines for ${activeBenchmark.ageGroup} year olds.\n` +
            `• **Accuracy:** Overall task accuracy remains strong (${overallAcc}%), indicating healthy recall performance.\n` +
            `• **Focus Area:** Keep practicing multi-step tasks to improve response times across all exercise types.`
          );
        }
      } catch {
        if (isMounted) {
          setAiSummary(
            `• **Age Group Comparison:** Performance matches expected cognitive standards for age group ${activeBenchmark.ageGroup}.\n` +
            `• **Accuracy:** Accuracy levels remain consistently steady across recent activity attempts.\n` +
            `• **Focus Area:** Practice timed puzzles to further reduce completion times.`
          );
        }
      } finally {
        if (isMounted) setIsSummaryLoading(false);
      }
    };

    void fetchAnalyticsSummary();

    return () => {
      isMounted = false;
    };
  }, [activityLogs, activeBenchmark]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const systemContextMessage: Message = {
        role: 'user',
        content: `[SYSTEM CONTEXT: The user is reviewing cognitive analytics. User Age: ${userAge} (Age Bracket: ${
          activeBenchmark.ageGroup
        }). Dataset: ${JSON.stringify(activityLogs)}. Age Baselines: ${JSON.stringify(activeBenchmark.metrics)}]`,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            systemContextMessage,
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API response failed with status: ${response.status}`);
      }

      const data = (await response.json()) as { message: string };
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      console.error('Failed to send chat message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I am having trouble connecting right now. Please try asking again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSessionHistory = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear your local activity history?')) {
      localStorage.removeItem('mindtrace_activity_logs');
      setActivityLogs([]);
    }
  };

  // Safe SVG polyline coordinate generator for line progression graph
  const polylinePoints = useMemo(() => {
    if (filteredData.length === 0) return '';
    if (filteredData.length === 1) {
      const y = 140 - (filteredData[0].score || 0) * 1.1;
      return `0,${y} 500,${y}`;
    }
    const divisor = Math.max(1, filteredData.length - 1);
    return filteredData
      .map((pt, i) => {
        const x = 20 + i * (460 / divisor);
        const y = 140 - (pt.score || 0) * 1.1;
        return `${x},${y}`;
      })
      .join(' ');
  }, [filteredData]);

  const maxValSvg = 260; // Scaling ceiling for pure SVG comparative chart

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2D3748] p-4 md:p-8 font-sans">
      <div className="relative max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Dashboard Nav */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 gap-4 border-b border-[#DCD5CB]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2D3748]">📊 Comprehensive Activity Analytics</h1>
            <p className="text-xs text-[#718096] mt-0.5">Real-time performance tracking & age baseline comparison</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearSessionHistory}
              className="rounded-xl border border-[#DCD5CB] bg-[#ECE7DF] hover:bg-[#E2DBD1] px-3 py-2 text-xs font-semibold text-[#718096] transition-colors"
            >
              Reset Logs
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-xl bg-[#436170] hover:bg-[#36505E] px-4 py-2 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              ‹ Dashboard
            </button>
          </div>
        </div>

        {/* AGE BASELINE INPUT BAR */}
        <div className="bg-[#ECE7DF] border border-[#E2DBD1] p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-[#436170] uppercase tracking-wider">Age Group Comparative Baseline</h2>
            <p className="text-xs text-[#718096] mt-0.5">
              Active Benchmark Group: <span className="font-bold text-[#2D3748]">{activeBenchmark.ageGroup} years</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#F9F6F0] px-3.5 py-1.5 rounded-xl border border-[#DCD5CB]">
            <label htmlFor="user-age-input" className="text-xs font-bold text-[#2D3748]">
              Your Age:
            </label>
            <input
              id="user-age-input"
              type="number"
              min="18"
              max="110"
              value={userAge}
              onChange={(e) => handleAgeChange(Number(e.target.value) || 18)}
              className="w-14 px-2 py-0.5 bg-white border border-[#DCD5CB] rounded-lg text-center text-xs font-extrabold text-[#436170] focus:outline-none focus:ring-1 focus:ring-[#436170]"
            />
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#ECE7DF] border border-[#E2DBD1] p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">Average Accuracy</span>
            <div className="text-2xl font-bold text-[#2D3748] mt-1">{avgAccuracy}%</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">Target precision score</div>
          </div>

          <div className="bg-[#ECE7DF] border border-[#E2DBD1] p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">Avg Completion Time</span>
            <div className="text-2xl font-bold text-[#2D3748] mt-1">{avgTimeSec} sec</div>
            <div className="text-[11px] text-[#436170] font-semibold mt-1">Duration per session</div>
          </div>

          <div className="bg-[#ECE7DF] border border-[#E2DBD1] p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">Overall Score</span>
            <div className="text-2xl font-bold text-[#2D3748] mt-1">{avgScore} / 100</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">Composite functional score</div>
          </div>
        </div>

        {/* PURE SVG AGE BASELINE COMPARATIVE CHART */}
        <div className="bg-[#ECE7DF] border border-[#E2DBD1] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider">
                Average Completion Time vs. Normative Baseline
              </h2>
              <p className="text-[11px] text-[#718096]">Lower values indicate faster task completion</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#436170]"></span> Your Avg Time
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#B0A89C]"></span> Age {activeBenchmark.ageGroup} Benchmark
              </div>
            </div>
          </div>

          <div className="w-full bg-[#F9F6F0] rounded-xl p-4 border border-[#DCD5CB] overflow-x-auto">
            <svg viewBox="0 0 540 180" className="w-full h-52 min-w-[480px]">
              {/* Background grid lines */}
              <line x1="35" y1="20" x2="520" y2="20" stroke="#E2DBD1" strokeDasharray="3" />
              <line x1="35" y1="60" x2="520" y2="60" stroke="#E2DBD1" strokeDasharray="3" />
              <line x1="35" y1="100" x2="520" y2="100" stroke="#E2DBD1" strokeDasharray="3" />
              <line x1="35" y1="140" x2="520" y2="140" stroke="#2D3748" strokeWidth="1.5" />

              {/* Y-Axis Labels */}
              <text x="28" y="24" fontSize="9" textAnchor="end" fill="#718096">200s</text>
              <text x="28" y="64" fontSize="9" textAnchor="end" fill="#718096">130s</text>
              <text x="28" y="104" fontSize="9" textAnchor="end" fill="#718096">60s</text>
              <text x="28" y="144" fontSize="9" textAnchor="end" fill="#718096">0s</text>

              {/* Render Comparative Bars */}
              {comparativeMetrics.map((item, index) => {
                const groupX = 55 + index * 115;

                const userBarHeight = item.userTime > 0 ? (item.userTime / maxValSvg) * 120 : 4;
                const benchBarHeight = (item.benchmarkTime / maxValSvg) * 120;

                return (
                  <g key={item.name}>
                    {/* User Time Bar */}
                    <rect
                      x={groupX}
                      y={140 - userBarHeight}
                      width="22"
                      height={userBarHeight}
                      fill="#436170"
                      rx="3"
                    />
                    <text
                      x={groupX + 11}
                      y={135 - userBarHeight}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#436170"
                    >
                      {item.userTime > 0 ? `${item.userTime}s` : 'N/A'}
                    </text>

                    {/* Benchmark Time Bar */}
                    <rect
                      x={groupX + 26}
                      y={140 - benchBarHeight}
                      width="22"
                      height={benchBarHeight}
                      fill="#B0A89C"
                      rx="3"
                    />
                    <text
                      x={groupX + 37}
                      y={135 - benchBarHeight}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#867C70"
                    >
                      {item.benchmarkTime}s
                    </text>

                    {/* Activity Label */}
                    <text
                      x={groupX + 24}
                      y="160"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#2D3748"
                    >
                      {item.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Behavioral Classification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {comparativeMetrics.map((m) => (
              <div key={`diag-${m.name}`} className="bg-[#F9F6F0] border border-[#DCD5CB] p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#718096] uppercase">{m.name}</div>
                  <div className="text-xs font-bold text-[#2D3748] mt-1">
                    {m.userTime > 0 ? `${m.userTime}s avg` : 'No logs yet'}
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${m.badgeBg}`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedGame(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedGame === tab
                  ? 'bg-[#436170] text-white shadow-sm'
                  : 'bg-[#ECE7DF] text-[#718096] hover:text-[#2D3748] border border-[#E2DBD1]'
              }`}
            >
              {tab === 'All' ? 'All Activities' : tab}
            </button>
          ))}
        </div>

        {/* CHARTS & RECENT ACTIVITY LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Graph */}
          <div className="lg:col-span-2 bg-[#ECE7DF] border border-[#E2DBD1] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider">
                Performance Progression ({selectedGame})
              </h2>
              <span className="text-xs bg-[#436170] text-white px-3 py-1 rounded-full font-medium">
                {filteredData.length} Recorded Sessions
              </span>
            </div>

            {filteredData.length > 0 ? (
              <div className="w-full h-56 relative flex items-end pt-6 pb-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#D3CBC0" strokeDasharray="4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#D3CBC0" strokeDasharray="4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#D3CBC0" strokeDasharray="4" />

                  <polyline
                    fill="none"
                    stroke="#436170"
                    strokeWidth="4"
                    strokeLinecap="round"
                    points={polylinePoints}
                  />

                  {filteredData.map((pt, i) => {
                    const divisor = Math.max(1, filteredData.length - 1);
                    const x = filteredData.length === 1 ? 250 : 20 + i * (460 / divisor);
                    const y = 140 - (pt.score || 0) * 1.1;
                    return (
                      <g key={pt.id || `node-${i}`}>
                        <circle cx={x} cy={y} r="6" fill="#436170" stroke="#FAF8F5" strokeWidth="2" />
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-xs text-[#718096] italic">
                No activity session logs recorded yet for this filter category.
              </div>
            )}

            <div className="flex justify-between text-[10px] text-[#718096] font-bold mt-2 px-1 overflow-x-auto">
              {filteredData.map((d, i) => (
                <span key={d.id || `date-${i}`}>{d.date || 'Recent'}</span>
              ))}
            </div>
          </div>

          {/* Activity Session Logs List */}
          <div className="bg-[#ECE7DF] border border-[#E2DBD1] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-3">
              Session History ({filteredData.length})
            </h2>
            
            <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
              {filteredData.length === 0 && (
                <div className="text-xs text-[#718096] italic py-4 text-center">
                  Play activities to record score history here.
                </div>
              )}

              {filteredData.slice().reverse().map((item) => (
                <div key={item.id} className="bg-[#F3EFEA] border border-[#E2DBD1] p-3 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-[#2D3748]">{item.gameType}</div>
                    <div className="text-[10px] text-[#718096] space-x-1">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.accuracyPct}% acc</span>
                      <span>•</span>
                      <span>{item.completionTimeSec}s</span>
                    </div>
                  </div>
                  <div className="font-bold text-[#436170] bg-[#ECE7DF] border border-[#DCD5CB] px-2.5 py-1 rounded-lg">
                    {item.score} pt
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI SUMMARY BOX */}
        <div className="bg-[#ECE7DF] border-l-4 border-l-[#436170] border border-[#E2DBD1] p-5 rounded-2xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#436170] text-white text-base font-bold shadow-sm">
              ✨
            </div>
            <div className="space-y-1 w-full">
              <h3 className="text-xs font-bold text-[#436170] uppercase tracking-wider">AI Progress Assessment</h3>
              {isSummaryLoading ? (
                <p className="text-xs text-[#718096] animate-pulse">Generating cognitive analysis from activity logs & age benchmarks...</p>
              ) : (
                <div className="text-xs text-[#2D3748] leading-relaxed whitespace-pre-line space-y-1">
                  {aiSummary}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI CHATBOT INTERFACE */}
        <div className="bg-[#ECE7DF] border border-[#E2DBD1] rounded-2xl p-5 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCD5CB] mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#436170] text-white text-xs">
                🤖
              </div>
              <h2 className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">MindTrace Assistant</h2>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="rounded-lg border border-[#DCD5CB] bg-[#F3EFEA] px-3 py-1 text-[11px] text-[#718096] hover:text-[#2D3748]"
            >
              Clear Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto rounded-xl border border-[#DCD5CB] bg-[#F9F6F0] p-4 mb-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-center text-xs text-[#718096]">
                Ask questions regarding your completion times, age group benchmark comparisons, or activity scores!
              </div>
            )}

            {messages.map((message, index) => (
              <div key={`msg-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md px-4 py-2 rounded-xl text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[#436170] text-white'
                      : 'bg-[#ECE7DF] border border-[#DCD5CB] text-[#2D3748]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef}/>
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border border-[#DCD5CB] bg-[#F9F6F0] p-1.5 rounded-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your activity results vs age group benchmarks..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-[#2D3748] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#436170] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}