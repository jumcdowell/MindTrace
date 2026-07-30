// lib/cognitiveBenchmarks.ts

export interface BenchmarkData {
  ageGroup: string;
  minAge: number;
  maxAge: number;
  metrics: {
    puzzles: { meanTimeSec: number; label: string };
    patterns: { meanTimeSec: number; label: string };
    recall: { meanTimeSec: number; label: string };
    recipeTasks: { meanTimeSec: number; label: string };
  };
}

// Stored Baseline Data for each Activity by Age Group
export const AGE_BENCHMARKS: BenchmarkData[] = [
  {
    ageGroup: '18 - 30',
    minAge: 18,
    maxAge: 30,
    metrics: {
      puzzles: { meanTimeSec: 120, label: 'Timed Puzzles' },
      patterns: { meanTimeSec: 90, label: 'Pattern Rec.' },
      recall: { meanTimeSec: 100, label: 'Story Recall' },
      recipeTasks: { meanTimeSec: 150, label: 'Recipe Tasks' },
    },
  },
  {
    ageGroup: '31 - 50',
    minAge: 31,
    maxAge: 50,
    metrics: {
      puzzles: { meanTimeSec: 140, label: 'Timed Puzzles' },
      patterns: { meanTimeSec: 105, label: 'Pattern Rec.' },
      recall: { meanTimeSec: 110, label: 'Story Recall' },
      recipeTasks: { meanTimeSec: 165, label: 'Recipe Tasks' },
    },
  },
  {
    ageGroup: '51 - 70',
    minAge: 51,
    maxAge: 70,
    metrics: {
      puzzles: { meanTimeSec: 180, label: 'Timed Puzzles' },
      patterns: { meanTimeSec: 130, label: 'Pattern Rec.' },
      recall: { meanTimeSec: 130, label: 'Story Recall' },
      recipeTasks: { meanTimeSec: 200, label: 'Recipe Tasks' },
    },
  },
  {
    ageGroup: '71+',
    minAge: 71,
    maxAge: 120,
    metrics: {
      puzzles: { meanTimeSec: 220, label: 'Timed Puzzles' },
      patterns: { meanTimeSec: 160, label: 'Pattern Rec.' },
      recall: { meanTimeSec: 160, label: 'Story Recall' },
      recipeTasks: { meanTimeSec: 240, label: 'Recipe Tasks' },
    },
  },
];