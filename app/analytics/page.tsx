'use client';

import React from 'react';
import Link from 'next/link';

interface SkillMetric {
  id: string;
  title: string;
  icon: string;
  score: number;
  avgTime: string;
  status: string;
  statusType: 'stable' | 'positive' | 'warning';
}

export default function AnalyticsPage() {
  const metrics: SkillMetric[] = [
    {
      id: 'puzzles',
      title: 'Timed Puzzles',
      icon: '🧩',
      score: 88,
      avgTime: '2.1s',
      status: 'Stable',
      statusType: 'stable',
    },
    {
      id: 'patterns',
      title: 'Patterns',
      icon: '🎨',
      score: 92,
      avgTime: '1.8s',
      status: '+4% Trend',
      statusType: 'positive',
    },
    {
      id: 'story-recall',
      title: 'Word & Story Recall',
      icon: '📖',
      score: 95,
      avgTime: '42s',
      status: 'Stable',
      statusType: 'stable',
    },
    {
      id: 'recipe-tasks',
      title: 'Recipe Tasks',
      icon: '🍳',
      score: 81,
      avgTime: '3.2s',
      status: '-2% Var.',
      statusType: 'warning',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2C3338] font-sans antialiased p-6 sm:p-10">
      
      {/* Top Bar Navigation */}
      <div className="max-w-6xl mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <span className="font-bold text-xl text-[#1B2A4A]">MindTrace</span>
          <span className="ml-4 px-3 py-1 bg-[#E8F3E8] border border-[#C2E0C2] text-[#2D6A2D] text-xs font-semibold rounded-full flex items-center gap-1.5">
            🔥 12-Day Streak
          </span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-semibold text-[#6B7280]">
          <Link href="/dashboard" className="hover:text-[#2C3338] transition-colors">
            Daily Hub
          </Link>
          <span className="text-[#1B2A4A] border-b-2 border-[#1B2A4A] pb-0.5">
            Tracking & Analytics
          </span>
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span>Alerts</span>
            <span className="w-5 h-5 bg-[#4A6C7C] text-white text-xs rounded-full flex items-center justify-center font-bold">
              1
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#4A6C7C] text-white flex items-center justify-center font-bold text-sm ml-2">
            U
          </div>
        </nav>
      </div>

      {/* Main Analytics Content */}
      <main className="max-w-6xl mx-auto space-y-8 pt-4">
        
        {/* Upper Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Status Indicator Box */}
          <div className="bg-[#F8F5F0] border-2 border-[#D8E6D8] rounded-2xl p-6 flex items-center gap-4 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#10B981] flex-shrink-0 shadow-sm animate-pulse" />
            <div>
              <h2 className="text-lg font-extrabold text-[#2C3338] tracking-tight">
                GREEN ZONE: STABLE
              </h2>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                Score variance within baseline normal range over past 90 days.
              </p>
            </div>
          </div>

          {/* AI Risk Model Box */}
          <div className="bg-[#EAE4D9] border border-[#E0D7C8] rounded-2xl p-6 flex items-start gap-4 shadow-xs">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-sm font-extrabold text-[#2C3338] uppercase tracking-wider">
                AI Predictive Risk Model Evaluation
              </h2>
              <p className="text-xs text-[#6B7280] italic font-medium mt-2 leading-relaxed">
                "Based on 12 months of test data, there is an 82% likelihood of cognitive stability over the next 12 months."
              </p>
            </div>
          </div>

        </div>

        {/* Breakdown Section Header */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xl font-extrabold text-[#2C3338]">
            Skill Category Breakdown & Raw Metrics
          </h3>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((item) => (
              <div
                key={item.id}
                className="bg-[#EAE4D9] border border-[#E0D7C8] rounded-2xl p-6 flex flex-col items-center text-center space-y-3 shadow-xs hover:border-[#1B2A4A]/30 transition-all"
              >
                {/* Icon */}
                <div className="text-3xl p-2 bg-[#F8F5F0] rounded-2xl shadow-2xs border border-[#E0D7C8]/50">
                  {item.icon}
                </div>

                {/* Title */}
                <div className="text-sm font-extrabold text-[#2C3338]">
                  {item.title}
                </div>

                {/* Score */}
                <div className="text-2xl font-black text-[#1B2A4A] tracking-tight">
                  {item.score} <span className="text-base font-bold text-[#6B7280]">/ 100</span>
                </div>

                {/* Avg Time */}
                <div className="text-xs font-semibold text-[#6B7280]">
                  Avg Time: {item.avgTime}
                </div>

                {/* Status Badge */}
                <div className="pt-1">
                  <span
                    className={`
                      text-xs font-bold px-3 py-1 rounded-full border inline-block
                      ${
                        item.statusType === 'positive'
                          ? 'bg-[#E8F3E8] border-[#C2E0C2] text-[#2D6A2D]'
                          : item.statusType === 'warning'
                          ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                          : 'bg-[#F8F5F0] border-[#E0D7C8] text-[#4A6C7C]'
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}