'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface KitchenTool {
  id: string;
  name: string;
  isDistractor?: boolean;
  iconSvg: React.ReactNode;
}

interface IngredientItem {
  id: string;
  name: string;
  location: 'fridge' | 'pantry';
  color: string;
  isDistractor?: boolean;
}

interface RecipeStep {
  id: string;
  action: string;
  targetTool: string;
  targetIngredient?: string;
}

interface RecipeData {
  title: string;
  description: string;
  requiredTools: KitchenTool[];
  requiredIngredients: IngredientItem[];
  steps: RecipeStep[];
}

interface TelemetryData {
  startTime: number;
  firstActionLatencyMs: number | null;
  sequenceErrors: number;
  distractorErrors: number;
  hesitationsCount: number;
  hintsUsed: number;
  dishesCompleted: number;
  completionTimeSeconds: number;
}

const TOOL_CATALOG: KitchenTool[] = [
  {
    id: 'skillet',
    name: 'Frying Pan',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 100 50">
        <ellipse cx="40" cy="25" rx="30" ry="15" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
        <rect x="68" y="21" width="28" height="8" rx="4" fill="#64748B" />
      </svg>
    ),
  },
  {
    id: 'spatula',
    name: 'Spatula',
    iconSvg: (
      <svg className="w-6 h-8" viewBox="0 0 40 80">
        <rect x="16" y="30" width="8" height="45" rx="2" fill="#64748B" />
        <rect x="10" y="5" width="20" height="30" rx="3" fill="#CBD5E1" />
      </svg>
    ),
  },
  {
    id: 'whisk',
    name: 'Whisk',
    iconSvg: (
      <svg className="w-6 h-8" viewBox="0 0 40 80">
        <rect x="18" y="45" width="4" height="30" fill="#475569" />
        <path d="M 10 10 C 10 35, 30 35, 30 10 C 30 45, 10 45, 10 10 Z" fill="none" stroke="#CBD5E1" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'pot',
    name: 'Sauce Pot',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 80 60">
        <rect x="15" y="15" width="50" height="35" rx="6" fill="#64748B" stroke="#334155" strokeWidth="3" />
        <rect x="5" y="22" width="10" height="8" rx="2" fill="#334155" />
        <rect x="65" y="22" width="10" height="8" rx="2" fill="#334155" />
      </svg>
    ),
  },
  {
    id: 'wrench',
    name: 'Wrench',
    isDistractor: true,
    iconSvg: (
      <svg className="w-6 h-8" viewBox="0 0 40 80">
        <path d="M 10 20 L 30 20 L 30 30 L 25 30 L 25 70 L 15 70 L 15 30 L 10 30 Z" fill="#EF4444" />
      </svg>
    ),
  },
];

const INGREDIENT_CATALOG: IngredientItem[] = [
  { id: 'eggs', name: 'Fresh Eggs', location: 'fridge', color: '#FEF08A' },
  { id: 'butter', name: 'Butter Block', location: 'fridge', color: '#FDE047' },
  { id: 'milk', name: 'Milk Carton', location: 'fridge', color: '#BAE6FD' },
  { id: 'cheese', name: 'Grated Cheese', location: 'fridge', color: '#F59E0B' },
  { id: 'expired_milk', name: 'Expired Milk', location: 'fridge', color: '#4ADE80', isDistractor: true },
  { id: 'oil', name: 'Olive Oil', location: 'pantry', color: '#EAB308' },
  { id: 'salt', name: 'Sea Salt', location: 'pantry', color: '#F8FAFC' },
  { id: 'pepper', name: 'Black Pepper', location: 'pantry', color: '#334155' },
  { id: 'herbs', name: 'Mixed Herbs', location: 'pantry', color: '#22C55E' },
  { id: 'soap', name: 'Dish Soap', location: 'pantry', color: '#38BDF8', isDistractor: true },
];

function generateProceduralRecipe(): RecipeData {
  const titles = [
    'Golden Herb Omelet',
    'Creamy Cheese Reduction',
    'Sautéed Garlic & Butter Glaze',
    'Spiced Milk Custard Base',
    'Herbed Pepper Scramble',
  ];

  const title = titles[Math.floor(Math.random() * titles.length)];
  const usePan = Math.random() > 0.5;

  const primaryTool = usePan ? 'skillet' : 'pot';
  const secondaryTool = usePan ? 'spatula' : 'whisk';

  const fridgeItem = Math.random() > 0.5 ? 'eggs' : 'milk';
  const pantryItem = Math.random() > 0.5 ? 'salt' : 'pepper';

  const requiredTools = TOOL_CATALOG.filter((t) => [primaryTool, secondaryTool].includes(t.id));
  const requiredIngredients = INGREDIENT_CATALOG.filter((i) => ['butter', fridgeItem, pantryItem].includes(i.id));

  const steps: RecipeStep[] = [
    { id: 's1', action: `Place ${primaryTool === 'skillet' ? 'Frying Pan' : 'Sauce Pot'} on active burner`, targetTool: primaryTool },
    { id: 's2', action: 'Melt Butter Block in pan', targetTool: primaryTool, targetIngredient: 'butter' },
    { id: 's3', action: `Add ${fridgeItem === 'eggs' ? 'Fresh Eggs' : 'Milk Carton'}`, targetTool: primaryTool, targetIngredient: fridgeItem },
    { id: 's4', action: `Incorporate using ${secondaryTool === 'spatula' ? 'Spatula' : 'Whisk'}`, targetTool: secondaryTool },
    { id: 's5', action: `Season dish with ${pantryItem === 'salt' ? 'Sea Salt' : 'Black Pepper'}`, targetTool: primaryTool, targetIngredient: pantryItem },
  ];

  return {
    title: `${title} #${Math.floor(Math.random() * 899 + 100)}`,
    description: 'A procedurally generated task testing sequential memory and inhibition.',
    requiredTools,
    requiredIngredients,
    steps,
  };
}

export default function CookingRecipePage() {
  const router = useRouter();

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [stage, setStage] = useState<'memorize' | 'tools' | 'ingredients' | 'cooking' | 'dish_done' | 'completed'>('memorize');
  const [memoryTimer, setMemoryTimer] = useState(10);

  const [collectedTools, setCollectedTools] = useState<string[]>([]);
  const [collectedIngredients, setCollectedIngredients] = useState<string[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const [feedback, setFeedback] = useState<string>('Memorize recipe instructions before timer expires!');
  const [showRecipeModal, setShowRecipeModal] = useState(true);

  const [fisScore, setFisScore] = useState<number | null>(null);
  const telemetry = useRef<TelemetryData>({
    startTime: Date.now(),
    firstActionLatencyMs: null,
    sequenceErrors: 0,
    distractorErrors: 0,
    hesitationsCount: 0,
    hintsUsed: 0,
    dishesCompleted: 0,
    completionTimeSeconds: 0,
  });

  const lastActionTime = useRef<number>(Date.now());

  useEffect(() => {
    setRecipe(generateProceduralRecipe());
  }, []);

  useEffect(() => {
    if (stage === 'memorize') {
      setMemoryTimer(10);
      const interval = setInterval(() => {
        setMemoryTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowRecipeModal(false);
            setStage('tools');
            if (!telemetry.current.startTime) telemetry.current.startTime = Date.now();
            lastActionTime.current = Date.now();
            setFeedback('Stage 1: Select required tools from the Tool Rack on the wall.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  if (!recipe) return <div className="min-h-screen bg-[#130B24] flex items-center justify-center text-purple-300 font-bold">Initializing Kitchen Environment...</div>;

  const trackInteraction = () => {
    const now = Date.now();
    if (!telemetry.current.firstActionLatencyMs) {
      telemetry.current.firstActionLatencyMs = now - telemetry.current.startTime;
    }
    if (now - lastActionTime.current > 4000) {
      telemetry.current.hesitationsCount += 1;
    }
    lastActionTime.current = now;
  };

  const startNextDish = () => {
    setRecipe(generateProceduralRecipe());
    setCollectedTools([]);
    setCollectedIngredients([]);
    setCurrentStepIdx(0);
    setIsFridgeOpen(false);
    setIsPantryOpen(false);
    setShowRecipeModal(true);
    setStage('memorize');
    setFeedback('Memorize recipe instructions before timer expires!');
  };

  const handleSelectTool = (tool: KitchenTool) => {
    if (stage !== 'tools') return;
    trackInteraction();

    if (tool.isDistractor) {
      telemetry.current.distractorErrors += 1;
      setFeedback('⚠️ Distractor Selected! Focus on cooking utensils.');
      return;
    }

    const isRequired = recipe.requiredTools.some((t) => t.id === tool.id);
    if (!isRequired) {
      setFeedback('Tool not needed for this recipe!');
      return;
    }

    if (!collectedTools.includes(tool.id)) {
      const updated = [...collectedTools, tool.id];
      setCollectedTools(updated);
      setFeedback(`Collected ${tool.name}.`);

      if (updated.length === recipe.requiredTools.length) {
        setStage('ingredients');
        setFeedback('Stage 2: Open Fridge & Pantry to gather ingredients.');
      }
    }
  };

  const handleSelectIngredient = (ing: IngredientItem) => {
    if (stage !== 'ingredients') return;
    trackInteraction();

    if (ing.isDistractor) {
      telemetry.current.distractorErrors += 1;
      setFeedback('⚠️ Avoid non-food or expired items!');
      return;
    }

    const isRequired = recipe.requiredIngredients.some((i) => i.id === ing.id);
    if (!isRequired) {
      setFeedback('Ingredient not required for this recipe!');
      return;
    }

    if (!collectedIngredients.includes(ing.id)) {
      const updated = [...collectedIngredients, ing.id];
      setCollectedIngredients(updated);
      setFeedback(`Gathered ${ing.name}.`);

      if (updated.length === recipe.requiredIngredients.length) {
        setStage('cooking');
        setFeedback('Stage 3: Perform cooking actions on the stove.');
        setIsFridgeOpen(false);
        setIsPantryOpen(false);
      }
    }
  };

  const handleExecuteCookingStep = (toolId: string, ingredientId?: string) => {
    if (stage !== 'cooking') return;
    trackInteraction();

    const targetStep = recipe.steps[currentStepIdx];
    const isToolMatch = targetStep.targetTool === toolId;
    const isIngredientMatch = !targetStep.targetIngredient || targetStep.targetIngredient === ingredientId;

    if (isToolMatch && isIngredientMatch) {
      if (currentStepIdx + 1 < recipe.steps.length) {
        setCurrentStepIdx((prev) => prev + 1);
        setFeedback(`Step ${currentStepIdx + 1} Complete! Next step...`);
      } else {
        telemetry.current.dishesCompleted += 1;
        setStage('dish_done');
        setFeedback(`🎉 ${recipe.title} completed! Make another dish or finish session.`);
      }
    } else {
      telemetry.current.sequenceErrors += 1;
      setFeedback('⚠️ Sequence Error! Check step order.');
    }
  };

  const calculateFinalTelemetry = () => {
    const totalTime = (Date.now() - telemetry.current.startTime) / 1000;
    telemetry.current.completionTimeSeconds = totalTime;

    const baseScore = telemetry.current.dishesCompleted * 50;
    const score = Math.max(
      0,
      baseScore -
        telemetry.current.sequenceErrors * 8 -
        telemetry.current.distractorErrors * 10 -
        telemetry.current.hintsUsed * 12 -
        totalTime * 0.1
    );

    setFisScore(Math.round(score));
    setStage('completed');
  };

  return (
    <div className="min-h-screen bg-[#130B24] text-slate-100 font-sans select-none flex flex-col justify-between p-4">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between bg-[#20123A] border border-purple-900/60 px-6 py-3 rounded-2xl shadow-xl">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-[#2D1A50] hover:bg-[#382164] border border-purple-700/50 rounded-xl font-bold text-xs text-purple-200 transition-all"
        >
          ‹ Exit Activity
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-[#2D1A50] px-4 py-1.5 rounded-full border border-purple-500/30 text-xs font-semibold">
            Stage: <span className="text-amber-400 font-bold uppercase">{stage}</span>
          </div>

          <div className="bg-[#2D1A50] px-3 py-1.5 rounded-full border border-purple-500/30 text-xs font-semibold text-purple-200">
            Dishes: <span className="text-emerald-400 font-bold">{telemetry.current.dishesCompleted}</span>
          </div>

          <button
            onClick={() => {
              telemetry.current.hintsUsed += 1;
              setShowRecipeModal(true);
            }}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-full text-xs shadow-md transition-all"
          >
            📋 Recipe Guide (-12 pts)
          </button>

          <button
            onClick={calculateFinalTelemetry}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full text-xs shadow-md transition-all"
          >
            🏁 Finish Session
          </button>
        </div>
      </header>

      {/* Main Kitchen Framework */}
      <main className="max-w-6xl w-full mx-auto my-3 h-[620px] bg-[#1A0E31] border-4 border-[#331C5C] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between">
        {/* UPPER KITCHEN WALL */}
        <div className="relative w-full h-[45%] bg-[#22133E] border-b-8 border-[#321B59] px-8 flex items-end justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#2D194C_1px,transparent_1px),linear-gradient(to_bottom,#2D194C_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>

          {/* Fridge (Left) */}
          <div className="relative z-20 w-36 h-[110%] -translate-y-2 bg-[#2D1C4D] border-4 border-[#422B6E] rounded-t-3xl shadow-2xl flex flex-col justify-between p-3">
            <span className="text-[10px] font-black tracking-wider text-purple-200 uppercase border-b border-purple-800/60 pb-1">FRIDGE</span>
            <button
              onClick={() => {
                setIsFridgeOpen(!isFridgeOpen);
                setIsPantryOpen(false);
              }}
              className="w-full py-2 bg-purple-900/60 hover:bg-purple-800/80 text-white font-bold text-xs rounded-xl border border-purple-500/30 transition-all"
            >
              {isFridgeOpen ? 'Close' : 'Open Fridge'}
            </button>
            <div className="w-2 h-10 bg-purple-400/40 rounded-full self-end"></div>
          </div>

          {/* CENTER WALL: DEDICATED TOOL RACK */}
          <div className="relative z-20 flex flex-col items-center justify-end -translate-y-2">
            <div className="text-[11px] font-black text-purple-200 bg-[#2D1A50] px-3 py-1 rounded-full border border-purple-600/40 mb-2 shadow-md">
              🛠️ UTENSIL RACK
            </div>

            <div className="w-96 bg-[#2D1A50] border-2 border-[#4A2B80] h-14 rounded-2xl shadow-2xl flex items-center justify-around px-4">
              {TOOL_CATALOG.map((tool) => {
                const isSelected = collectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool)}
                    className={`group relative flex flex-col items-center p-2 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-emerald-950/80 border-2 border-emerald-500 opacity-50 scale-95'
                        : 'bg-[#1A0E31] border-2 border-purple-700/60 hover:scale-110 hover:border-amber-400'
                    }`}
                  >
                    {tool.iconSvg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pantry Cabinet (Right) */}
          <div className="relative z-20 w-36 h-[110%] -translate-y-2 bg-[#2D1C4D] border-4 border-[#422B6E] rounded-t-3xl shadow-2xl flex flex-col justify-between p-3">
            <span className="text-[10px] font-black tracking-wider text-purple-200 uppercase border-b border-purple-800/60 pb-1">PANTRY</span>
            <button
              onClick={() => {
                setIsPantryOpen(!isPantryOpen);
                setIsFridgeOpen(false);
              }}
              className="w-full py-2 bg-purple-900/60 hover:bg-purple-800/80 text-white font-bold text-xs rounded-xl border border-purple-500/30 transition-all"
            >
              {isPantryOpen ? 'Close' : 'Open Pantry'}
            </button>
            <div className="w-2 h-10 bg-purple-400/40 rounded-full self-start"></div>
          </div>
        </div>

        {/* FRIDGE OVERLAY */}
        {isFridgeOpen && (
          <div className="absolute top-12 left-6 z-30 w-72 bg-[#20123A] border-2 border-purple-500/60 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-purple-800/50 pb-2 mb-3">
              <span className="text-xs font-bold text-purple-200 uppercase">Fridge Storage</span>
              <button onClick={() => setIsFridgeOpen(false)} className="text-xs text-purple-400 font-bold">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INGREDIENT_CATALOG.filter((i) => i.location === 'fridge').map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => handleSelectIngredient(ing)}
                  className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                    collectedIngredients.includes(ing.id)
                      ? 'bg-emerald-950/80 border-emerald-500 opacity-40'
                      : 'bg-[#2D1A50] border-purple-700/60 hover:bg-purple-900/60'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: ing.color }}></div>
                  {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PANTRY OVERLAY */}
        {isPantryOpen && (
          <div className="absolute top-12 right-6 z-30 w-72 bg-[#20123A] border-2 border-purple-500/60 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-purple-800/50 pb-2 mb-3">
              <span className="text-xs font-bold text-purple-200 uppercase">Pantry Storage</span>
              <button onClick={() => setIsPantryOpen(false)} className="text-xs text-purple-400 font-bold">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INGREDIENT_CATALOG.filter((i) => i.location === 'pantry').map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => handleSelectIngredient(ing)}
                  className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                    collectedIngredients.includes(ing.id)
                      ? 'bg-emerald-950/80 border-emerald-500 opacity-40'
                      : 'bg-[#2D1A50] border-purple-700/60 hover:bg-purple-900/60'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: ing.color }}></div>
                  {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LOWER KITCHEN COUNTER */}
        <div className="relative w-full h-[55%] bg-[#251543] border-t-8 border-[#3A2268] p-6 flex justify-between items-center">
          {/* Inventory Panel */}
          <div className="w-64 h-full bg-[#1A0E31]/80 border-2 border-purple-900/60 rounded-2xl p-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-200 uppercase block mb-2">Collected Utensils & Food</span>
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-purple-300">Tools:</div>
                <div className="flex flex-wrap gap-1">
                  {collectedTools.map((tId) => (
                    <span key={tId} className="px-2 py-0.5 bg-purple-900/60 border border-purple-600/50 rounded text-[10px] uppercase font-bold text-purple-200">
                      {tId}
                    </span>
                  ))}
                  {collectedTools.length === 0 && <span className="text-xs text-purple-400/60 italic">None</span>}
                </div>
              </div>

              <div className="space-y-1 mt-3">
                <div className="text-[11px] font-semibold text-purple-300">Ingredients:</div>
                <div className="flex flex-wrap gap-1">
                  {collectedIngredients.map((iId) => (
                    <button
                      key={iId}
                      onClick={() => stage === 'cooking' && handleExecuteCookingStep(recipe.steps[currentStepIdx]?.targetTool, iId)}
                      className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-600 hover:border-amber-400 rounded text-[10px] uppercase font-bold text-emerald-200 transition-all"
                    >
                      {iId}
                    </button>
                  ))}
                  {collectedIngredients.length === 0 && <span className="text-xs text-purple-400/60 italic">None</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Stove Station */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="w-80 h-36 bg-[#1A0E31] border-4 border-[#3A2268] rounded-3xl p-4 flex flex-col justify-between relative shadow-2xl">
              <div className="w-full h-16 bg-[#120824] rounded-2xl border-2 border-purple-900/60 flex items-center justify-center relative overflow-hidden">
                <div className={`w-28 h-10 rounded-full border-4 transition-all ${stage === 'cooking' ? 'border-amber-500 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'border-purple-900'}`}></div>
              </div>

              {collectedTools.map((tId) => (
                <button
                  key={tId}
                  onClick={() => handleExecuteCookingStep(tId)}
                  className="bg-[#2D1A50] border-2 border-amber-400/80 px-3 py-1.5 rounded-xl font-bold text-xs hover:scale-105 transition-transform"
                >
                  Use {tId.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Task Guidance Box */}
          <div className="w-64 h-full bg-[#1A0E31]/80 border-2 border-purple-900/60 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-200 uppercase block mb-1">Active Objective</span>
              <div className="text-xs font-semibold text-purple-100">{feedback}</div>
            </div>

            {stage === 'dish_done' && (
              <div className="space-y-2 mt-2">
                <button
                  onClick={startNextDish}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
                >
                  ✨ Prepare Next Dish
                </button>
                <button
                  onClick={calculateFinalTelemetry}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
                >
                  📊 End & View Results
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RECIPE MODAL & MEMORIZATION SCREEN */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#20123A] border-2 border-purple-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-purple-800/50 pb-3">
              <div>
                <h2 className="text-2xl font-black text-amber-400">{recipe.title}</h2>
                <p className="text-xs text-purple-300 mt-1">{recipe.description}</p>
              </div>
              {stage !== 'memorize' && (
                <button onClick={() => setShowRecipeModal(false)} className="text-purple-400 font-bold text-sm">✕ Close</button>
              )}
            </div>

            {stage === 'memorize' ? (
              <div className="text-center space-y-4 py-4">
                <div className="text-4xl font-black text-sky-400">{memoryTimer}s</div>
                <p className="text-xs text-purple-200">Memorize tools and steps before the guide closes automatically!</p>
                <div className="space-y-1 text-left bg-[#1A0E31] p-4 rounded-2xl border border-purple-900/60">
                  <div className="text-xs font-bold text-amber-400">Required Steps:</div>
                  {recipe.steps.map((s, idx) => (
                    <div key={s.id} className="text-xs text-purple-200">• Step {idx + 1}: {s.action}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Required Steps Reference</h3>
                <div className="space-y-2">
                  {recipe.steps.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`p-2.5 rounded-xl border text-xs font-bold ${
                        idx === currentStepIdx
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : idx < currentStepIdx
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400 line-through'
                          : 'bg-[#1A0E31] border-purple-900 text-purple-400'
                      }`}
                    >
                      Step {idx + 1}: {s.action}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition-all mt-4"
                >
                  Continue Activity
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULTS SUMMARY MODAL */}
      {stage === 'completed' && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#20123A] border-2 border-purple-500 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-2xl font-black text-amber-400">Activity Telemetry Summary</h2>
            <div className="bg-[#1A0E31] p-4 rounded-2xl border border-purple-900/60 space-y-2 text-xs">
              <div className="text-lg font-extrabold text-emerald-400">Functional Independence Score: {fisScore}</div>
              <div>Dishes Completed: {telemetry.current.dishesCompleted}</div>
              <div>First Action Latency: {telemetry.current.firstActionLatencyMs ?? 0} ms</div>
              <div>Sequence Errors: {telemetry.current.sequenceErrors}</div>
              <div>Distractor Errors: {telemetry.current.distractorErrors}</div>
              <div>Hesitations (&gt;4s): {telemetry.current.hesitationsCount}</div>
              <div>Total Session Time: {Math.round(telemetry.current.completionTimeSeconds)}s</div>
            </div>
            <button onClick={() => router.push('/dashboard')} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl transition-all">
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}