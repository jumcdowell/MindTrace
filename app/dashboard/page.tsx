'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Arthur');
  const [streak, setStreak] = useState(12);
  const [totalSessions, setTotalSessions] = useState(50);
  const [badgesCount, setBadgesCount] = useState(0);
  
  // Fetch real user name or email from Supabase session on mount
  useEffect(() => {
    async function getUserSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name);
          } else if (user.email) {
            const formattedName = user.email.split('@')[0];
            setUserName(formattedName.charAt(0).toUpperCase() + formattedName.slice(1));
          }
        }
      } catch (err) {
        console.error('Session load error:', err);
      }
    }
    getUserSession();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.assign('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2C3338] font-sans antialiased">
      {/* Navigation Header */}
      <header className="px-6 py-4 border-b border-[#E8E2D5] bg-[#F8F5F0]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo & Streak */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4A6C7C] flex items-center justify-center text-white text-xl shadow-sm">
              🧠
            </div>
            <div>
              <div className="text-xl font-bold text-[#2C3338] leading-tight">MindTrace</div>
              <div className="text-xs text-[#6B7280] font-medium">{streak} day streak</div>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <button 
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A6C7C] text-white font-semibold text-sm shadow-sm transition-all hover:bg-[#3B5765]"
            >
              <span>⚡</span> Daily Activities
            </button>

            <button 
              onClick={() => router.push('/analytics')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[#4A6C7C] hover:bg-[#EAE4D9] font-medium text-sm transition-all"
            >
              <span>📊</span> Analytics
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[#4A6C7C] hover:bg-[#EAE4D9] font-medium text-sm transition-all"
            >
              <span>🚪</span> Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Hero Greeting Card */}
        <section className="bg-[#EAE4D9] rounded-2xl p-8 border border-[#E0D7C8] shadow-xs">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C3338] mb-2">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-lg text-[#6B7280] font-medium">
            Ready for your daily brain refresh?
          </p>
        </section>

        {/* Summary Metrics Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Streak Card */}
          <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              <span>🔥</span> Current Streak
            </div>
            <div className="mt-4">
              <div className="text-4xl font-extrabold text-[#2C3338]">{streak}</div>
              <div className="text-sm text-[#6B7280] mt-1 font-medium">days in a row</div>
            </div>
          </div>

          {/* Sessions Card */}
          <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              <span>📅</span> Total Sessions
            </div>
            <div className="mt-4">
              <div className="text-4xl font-extrabold text-[#2C3338]">{totalSessions}</div>
              <div className="text-sm text-[#6B7280] mt-1 font-medium">completed</div>
            </div>
          </div>

          {/* Badges Card */}
          <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              <span>🏅</span> Badges Earned
            </div>
            <div className="mt-4">
              <div className="text-4xl font-extrabold text-[#2C3338]">{badgesCount}</div>
              <div className="text-sm text-[#6B7280] mt-1 font-medium">achievements</div>
            </div>
          </div>

        </section>

        {/* Today's Activities Section */}
        <section className="space-y-6 pt-2">
          <div>
            <h2 className="text-2xl font-extrabold text-[#2C3338]">Today's Activities</h2>
            <p className="text-base text-[#6B7280] font-medium mt-1">
              Complete these exercises to maintain your cognitive health
            </p>
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Exercise 1: Timed Puzzles (Jigsaw Piece Graphic) */}
            <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] flex justify-between items-stretch min-h-[200px]">
              <div className="flex flex-col justify-between max-w-[60%]">
                <div>
                  <h3 className="text-xl font-bold text-[#2C3338]">Timed Puzzles</h3>
                  <p className="text-sm text-[#6B7280] mt-1 font-medium">Speed and logic challenges</p>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-[#6B7280] font-medium mb-3">~3 minutes</div>
                  <button 
                    onClick={() => router.push('/test/puzzles')}
                    className="px-5 py-2.5 bg-[#4A6C7C] hover:bg-[#3B5765] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    Start Activity <span>›</span>
                  </button>
                </div>
              </div>

              {/* Jigsaw Puzzle Piece Graphic */}
              <div className="flex flex-col items-center justify-center pr-2">
                <div className="w-24 h-24 bg-[#F8F5F0] rounded-2xl border border-[#E0D7C8] flex items-center justify-center p-3 shadow-inner">
                  <svg className="w-14 h-14 text-[#4A6C7C]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a1.5 1.5 0 0 0-3 0V5H6a2 2 0 0 0-2 2v4H2.5a1.5 1.5 0 0 0 0 3H4v4a2 2 0 0 0 2 2h4v1.5a1.5 1.5 0 0 0 3 0V19h4a2 2 0 0 0 2-2v-4h1.5a1.5 1.5 0 0 0 0-3z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#4A6C7C] mt-2">Puzzle</span>
              </div>
            </div>

            {/* Exercise 2: Pattern Recognition (Dot Pattern Graphic) */}
            <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] flex justify-between items-stretch min-h-[200px]">
              <div className="flex flex-col justify-between max-w-[60%]">
                <div>
                  <h3 className="text-xl font-bold text-[#2C3338]">Pattern Recognition</h3>
                  <p className="text-sm text-[#6B7280] mt-1 font-medium">Visual and spatial pattern identification</p>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-[#6B7280] font-medium mb-3">~2 minutes</div>
                  <button 
                    onClick={() => router.push('/test/patterns')}
                    className="px-5 py-2.5 bg-[#4A6C7C] hover:bg-[#3B5765] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    Start Activity <span>›</span>
                  </button>
                </div>
              </div>

              {/* Connected Dot Pattern Visual Graphic */}
              <div className="flex flex-col items-center justify-center pr-2">
                <div className="w-24 h-24 bg-[#F8F5F0] rounded-2xl border border-[#E0D7C8] flex items-center justify-center p-3 shadow-inner relative">
                  {/* Connected line behind dots */}
                  <svg className="absolute w-14 h-14 text-[#4A6C7C] opacity-50" viewBox="0 0 100 100">
                    <path d="M 20 20 L 80 20 L 50 50 L 20 80" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {/* 3x3 Dot Grid */}
                  <div className="grid grid-cols-3 gap-2.5 z-10">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#4A6C7C] ring-2 ring-[#F8F5F0]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#D1C7B7]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#4A6C7C] ring-2 ring-[#F8F5F0]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#D1C7B7]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#7A9A7D] ring-2 ring-[#F8F5F0]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#D1C7B7]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#4A6C7C] ring-2 ring-[#F8F5F0]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#D1C7B7]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#D1C7B7]"></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#4A6C7C] mt-2">Dot Pattern</span>
              </div>
            </div>

            {/* Exercise 3: Word & Story Recall */}
            <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] flex justify-between items-stretch min-h-[200px]">
              <div className="flex flex-col justify-between max-w-[60%]">
                <div>
                  <h3 className="text-xl font-bold text-[#2C3338]">Word & Story Recall</h3>
                  <p className="text-sm text-[#6B7280] mt-1 font-medium">Verbal memory & delayed processing exercise</p>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-[#6B7280] font-medium mb-3">~2 minutes</div>
                  <button 
                    onClick={() => router.push('/test/recall')}
                    className="px-5 py-2.5 bg-[#4A6C7C] hover:bg-[#3B5765] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    Start Activity <span>›</span>
                  </button>
                </div>
              </div>

              {/* Story Recall Visual Graphic */}
              <div className="flex flex-col items-center justify-center pr-2">
                <div className="w-24 h-24 bg-[#F8F5F0] rounded-2xl border border-[#E0D7C8] flex items-center justify-center p-3 shadow-inner">
                  <div className="flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-2xl">📝</span>
                    <div className="w-12 h-1 bg-[#4A6C7C] rounded-full"></div>
                    <div className="w-8 h-1 bg-[#7A9A7D] rounded-full"></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#4A6C7C] mt-2">Story Recall</span>
              </div>
            </div>

            {/* Exercise 4: Recipe Tasks */}
            <div className="bg-[#EAE4D9] rounded-2xl p-6 border border-[#E0D7C8] flex justify-between items-stretch min-h-[200px]">
              <div className="flex flex-col justify-between max-w-[60%]">
                <div>
                  <h3 className="text-xl font-bold text-[#2C3338]">Recipe Tasks</h3>
                  <p className="text-sm text-[#6B7280] mt-1 font-medium">Planning, timing & sequential recipe steps</p>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-[#6B7280] font-medium mb-3">~4 minutes</div>
                  <button 
                    onClick={() => router.push('/test/recipe-tasks')}
                    className="px-5 py-2.5 bg-[#4A6C7C] hover:bg-[#3B5765] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    Start Activity <span>›</span>
                  </button>
                </div>
              </div>

              {/* Cooking / Recipe Visual Graphic */}
              <div className="flex flex-col items-center justify-center pr-2">
                <div className="w-24 h-24 bg-[#F8F5F0] rounded-2xl border border-[#E0D7C8] flex items-center justify-center p-3 shadow-inner">
                  <div className="flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-3xl">🍳</span>
                    <div className="flex gap-1">
                      <span className="text-xs">🧂</span>
                      <span className="text-xs">🧀</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#4A6C7C] mt-2">Recipes</span>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}