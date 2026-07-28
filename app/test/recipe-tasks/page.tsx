'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface KitchenTool {
  id: string;
  name: string;
  location: 'wall-rack';
  iconSvg: React.ReactNode;
}

interface IngredientItem {
  id: string;
  name: string;
  location: 'fridge' | 'pantry';
  color: string;
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

const BASE_TOOLS: KitchenTool[] = [
  {
    id: 'skillet',
    name: 'Frying Pan',
    location: 'wall-rack',
    iconSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 50">
        <ellipse cx="40" cy="25" rx="30" ry="15" fill="#37474F" stroke="#102027" strokeWidth="4" />
        <rect x="68" y="21" width="30" height="8" rx="4" fill="#8D6E63" />
      </svg>
    ),
  },
  {
    id: 'spatula',
    name: 'Spatula',
    location: 'wall-rack',
    iconSvg: (
      <svg className="w-6 h-10" viewBox="0 0 40 80">
        <rect x="16" y="30" width="8" height="45" rx="2" fill="#8D6E63" />
        <rect x="10" y="5" width="20" height="30" rx="3" fill="#B0BEC5" />
      </svg>
    ),
  },
  {
    id: 'whisk',
    name: 'Whisk',
    location: 'wall-rack',
    iconSvg: (
      <svg className="w-6 h-10" viewBox="0 0 40 80">
        <rect x="18" y="45" width="4" height="30" fill="#263238" />
        <path d="M 10 10 C 10 35, 30 35, 30 10 C 30 45, 10 45, 10 10 Z" fill="none" stroke="#B0BEC5" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'pot',
    name: 'Sauce Pot',
    location: 'wall-rack',
    iconSvg: (
      <svg className="w-10 h-10" viewBox="0 0 80 60">
        <rect x="15" y="15" width="50" height="35" rx="6" fill="#546E7A" stroke="#263238" strokeWidth="3" />
        <rect x="5" y="22" width="10" height="8" rx="2" fill="#263238" />
        <rect x="65" y="22" width="10" height="8" rx="2" fill="#263238" />
      </svg>
    ),
  },
];

const INGREDIENT_POOL: IngredientItem[] = [
  { id: 'eggs', name: 'Fresh Eggs', location: 'fridge', color: '#FFF8E1' },
  { id: 'butter', name: 'Butter Block', location: 'fridge', color: '#FFF176' },
  { id: 'milk', name: 'Milk Carton', location: 'fridge', color: '#E0F7FA' },
  { id: 'cheese', name: 'Grated Cheese', location: 'fridge', color: '#FFB300' },
  { id: 'onions', name: 'Chopped Onions', location: 'fridge', color: '#E1BEE7' },
  { id: 'oil', name: 'Olive Oil', location: 'pantry', color: '#FBC02D' },
  { id: 'salt', name: 'Sea Salt', location: 'pantry', color: '#FFFFFF' },
  { id: 'pepper', name: 'Black Pepper', location: 'pantry', color: '#424242' },
  { id: 'herbs', name: 'Mixed Herbs', location: 'pantry', color: '#4CAF50' },
];

function generateUniqueRecipe(): RecipeData {
  const recipesList = [
    {
      title: 'Golden Herb Omelet',
      description: 'A light breakfast testing utensil retrieval & sequential cooking.',
      tools: ['skillet', 'spatula'],
      ingredients: ['eggs', 'butter', 'herbs', 'salt'],
      steps: [
        { id: 's1', action: 'Place Frying Pan on stove burner', targetTool: 'skillet' },
        { id: 's2', action: 'Melt Butter Block in pan', targetTool: 'skillet', targetIngredient: 'butter' },
        { id: 's3', action: 'Pour Fresh Eggs into pan', targetTool: 'skillet', targetIngredient: 'eggs' },
        { id: 's4', action: 'Season with Sea Salt', targetTool: 'skillet', targetIngredient: 'salt' },
        { id: 's5', action: 'Flip with Spatula & add Mixed Herbs', targetTool: 'spatula', targetIngredient: 'herbs' },
      ],
    },
    {
      title: 'Creamy Cheese Sauce',
      description: 'A smooth sauce exercise testing pot control and whisk timing.',
      tools: ['pot', 'whisk'],
      ingredients: ['butter', 'milk', 'cheese', 'pepper'],
      steps: [
        { id: 's1', action: 'Place Sauce Pot on burner', targetTool: 'pot' },
        { id: 's2', action: 'Add Butter Block to melt', targetTool: 'pot', targetIngredient: 'butter' },
        { id: 's3', action: 'Whisk in Milk Carton gradually', targetTool: 'whisk', targetIngredient: 'milk' },
        { id: 's4', action: 'Stir in Grated Cheese until smooth', targetTool: 'whisk', targetIngredient: 'cheese' },
        { id: 's5', action: 'Finish with Black Pepper', targetTool: 'pot', targetIngredient: 'pepper' },
      ],
    },
    {
      title: 'Sautéed Garlic Onions',
      description: 'High heat skillet preparation testing tool memory and seasoning.',
      tools: ['skillet', 'spatula'],
      ingredients: ['oil', 'onions', 'salt', 'pepper'],
      steps: [
        { id: 's1', action: 'Set Frying Pan on stove burner', targetTool: 'skillet' },
        { id: 's2', action: 'Pour Olive Oil into hot pan', targetTool: 'skillet', targetIngredient: 'oil' },
        { id: 's3', action: 'Add Chopped Onions to sauté', targetTool: 'skillet', targetIngredient: 'onions' },
        { id: 's4', action: 'Sauté using Spatula', targetTool: 'spatula' },
        { id: 's5', action: 'Season with Sea Salt & Black Pepper', targetTool: 'skillet', targetIngredient: 'salt' },
      ],
    },
  ];

  const randomRecipe = recipesList[Math.floor(Math.random() * recipesList.length)];

  return {
    title: randomRecipe.title,
    description: randomRecipe.description,
    requiredTools: BASE_TOOLS.filter((t) => randomRecipe.tools.includes(t.id)),
    requiredIngredients: INGREDIENT_POOL.filter((i) => randomRecipe.ingredients.includes(i.id)),
    steps: randomRecipe.steps,
  };
}

export default function InteractiveCookingGame() {
  const router = useRouter();

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [stage, setStage] = useState<'tools' | 'ingredients' | 'cooking' | 'completed'>('tools');

  const [collectedTools, setCollectedTools] = useState<string[]>([]);
  const [collectedIngredients, setCollectedIngredients] = useState<string[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stagedIngredientsInPan, setStagedIngredientsInPan] = useState<string[]>([]);

  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const [feedback, setFeedback] = useState<string>('Stage 1: Look at the Tool Shelf on the wall and click the tools you need!');
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [showRecipeModal, setShowRecipeModal] = useState(true);

  useEffect(() => {
    setRecipe(generateUniqueRecipe());
  }, []);

  if (!recipe) return <div className="min-h-screen bg-[#180E29] flex items-center justify-center text-white font-bold">Loading Kitchen...</div>;

  const handleSelectTool = (toolId: string) => {
    if (stage !== 'tools') return;

    const isRequired = recipe.requiredTools.some((t) => t.id === toolId);
    if (!isRequired) {
      setFeedback('That tool is not required for this recipe!');
      return;
    }

    if (!collectedTools.includes(toolId)) {
      const updated = [...collectedTools, toolId];
      setCollectedTools(updated);
      setFeedback(`Collected ${toolId.toUpperCase()}!`);

      if (updated.length === recipe.requiredTools.length) {
        setStage('ingredients');
        setFeedback('All tools collected! Now open the Fridge or Pantry to gather ingredients.');
        setShowRecipeModal(true);
      }
    }
  };

  const handleSelectIngredient = (ingId: string) => {
    if (stage !== 'ingredients') return;

    const isRequired = recipe.requiredIngredients.some((i) => i.id === ingId);
    if (!isRequired) {
      setFeedback('That ingredient is not needed for this recipe!');
      return;
    }

    if (!collectedIngredients.includes(ingId)) {
      const updated = [...collectedIngredients, ingId];
      setCollectedIngredients(updated);
      setFeedback(`Gathered ${ingId.toUpperCase()}!`);

      if (updated.length === recipe.requiredIngredients.length) {
        setStage('cooking');
        setFeedback('All ingredients gathered! Time to cook on the burner.');
        setShowRecipeModal(true);
        setIsFridgeOpen(false);
        setIsPantryOpen(false);
      }
    }
  };

  const handleExecuteCookingAction = (toolId: string, ingredientId?: string) => {
    if (stage !== 'cooking') return;

    const targetStep = recipe.steps[currentStepIdx];
    const toolMatches = targetStep.targetTool === toolId;
    const ingredientMatches = !targetStep.targetIngredient || targetStep.targetIngredient === ingredientId;

    if (toolMatches && ingredientMatches) {
      if (ingredientId && !stagedIngredientsInPan.includes(ingredientId)) {
        setStagedIngredientsInPan((prev) => [...prev, ingredientId]);
      }

      if (currentStepIdx + 1 < recipe.steps.length) {
        setCurrentStepIdx((prev) => prev + 1);
        setFeedback(`Step ${currentStepIdx + 1} Complete! Next step...`);
      } else {
        setStage('completed');
        setFeedback('Dish prepared perfectly! Outstanding sequential memory.');
      }
    } else {
      setFeedback('Incorrect cooking step! Check your recipe guide.');
    }
  };

  const handleUseHint = () => {
    setHintsUsedCount((prev) => prev + 1);

    if (stage === 'tools') {
      const missing = recipe.requiredTools.find((t) => !collectedTools.includes(t.id));
      if (missing) handleSelectTool(missing.id);
    } else if (stage === 'ingredients') {
      const missing = recipe.requiredIngredients.find((i) => !collectedIngredients.includes(i.id));
      if (missing) handleSelectIngredient(missing.id);
    } else if (stage === 'cooking') {
      const step = recipe.steps[currentStepIdx];
      handleExecuteCookingAction(step.targetTool, step.targetIngredient);
    }
  };

  return (
    <div className="min-h-screen bg-[#180E29] text-white font-sans select-none flex flex-col justify-between p-4">
      {/* Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between bg-[#281845] border border-purple-900/50 px-6 py-3 rounded-2xl shadow-xl">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/50 rounded-xl font-bold text-sm transition-all"
        >
          ‹ Exit Kitchen
        </button>

        <div className="flex items-center gap-4">
          <div className="bg-purple-900/60 px-4 py-1.5 rounded-full border border-purple-500/30 text-xs font-semibold">
            Stage: <span className="text-yellow-400 font-bold uppercase">{stage}</span>
          </div>

          <button
            onClick={() => setShowRecipeModal(true)}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-full text-xs shadow-md transition-all"
          >
            📋 Recipe Checklist
          </button>

          <button
            onClick={handleUseHint}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-full text-xs shadow-md transition-all"
          >
            💡 Hint / Assist ({hintsUsedCount})
          </button>
        </div>
      </header>

      {/* Main Kitchen Frame */}
      <main className="max-w-6xl w-full mx-auto my-3 h-[640px] bg-[#221338] border-4 border-[#3D2260] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between">
        {/* UPPER WALL SECTION */}
        <div className="relative w-full h-[45%] bg-[#81C784] border-b-8 border-[#4CAF50] px-8 flex items-end justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#66BB6A_3px,transparent_3px)] bg-[size:100%_24px] opacity-30"></div>

          {/* Fridge (Left) */}
          <div className="relative z-20 w-36 h-[115%] -translate-y-2 bg-[#FF4081] border-4 border-[#C2185B] rounded-t-3xl shadow-2xl flex flex-col justify-between p-3">
            <span className="text-[10px] font-black tracking-wider text-pink-100 uppercase border-b border-[#C2185B] pb-1">FRIDGE</span>
            <button
              onClick={() => { setIsFridgeOpen(!isFridgeOpen); setIsPantryOpen(false); }}
              className="w-full py-2 bg-pink-900/70 hover:bg-pink-950 text-white font-bold text-xs rounded-xl border border-pink-300/30 shadow-md transition-all"
            >
              {isFridgeOpen ? 'Close' : 'Open Fridge'}
            </button>
            <div className="w-2 h-10 bg-white/70 rounded-full self-end"></div>
          </div>

          {/* CENTER WALL: DEDICATED TOOL SHELF & RACK */}
          <div className="relative z-20 flex flex-col items-center justify-end -translate-y-2">
            <div className="text-xs font-black text-amber-950 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-500 mb-2 shadow-md">
              🛠️ TOOL SHELF
            </div>

            {/* Wooden Tool Shelf */}
            <div className="w-96 bg-[#8D6E63] border-2 border-[#5D4037] h-12 rounded-2xl shadow-2xl flex items-center justify-around px-4">
              {BASE_TOOLS.map((tool) => {
                const isSelected = collectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.id)}
                    className={`group relative flex flex-col items-center p-2 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-emerald-900/80 border-2 border-emerald-400 opacity-50 scale-95'
                        : 'bg-slate-900/90 border-2 border-amber-400 hover:scale-110 hover:bg-slate-800'
                    }`}
                  >
                    {tool.iconSvg}
                    <span className="text-[9px] font-extrabold text-amber-200 mt-1 uppercase">
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pantry Cabinet (Right Wall) */}
          <div className="relative z-20 w-36 h-[115%] -translate-y-2 bg-[#8D6E63] border-4 border-[#5D4037] rounded-t-3xl shadow-2xl flex flex-col justify-between p-3">
            <span className="text-[10px] font-black tracking-wider text-amber-100 uppercase border-b border-[#5D4037] pb-1">PANTRY</span>
            <button
              onClick={() => { setIsPantryOpen(!isPantryOpen); setIsFridgeOpen(false); }}
              className="w-full py-2 bg-amber-950/70 hover:bg-amber-900 text-white font-bold text-xs rounded-xl border border-amber-400/30 shadow-md transition-all"
            >
              {isPantryOpen ? 'Close' : 'Open Pantry'}
            </button>
            <div className="w-2 h-10 bg-amber-200/70 rounded-full self-start"></div>
          </div>
        </div>

        {/* FRIDGE MODAL OVERLAY */}
        {isFridgeOpen && (
          <div className="absolute top-12 left-6 z-30 w-72 bg-[#1A237E] border-4 border-[#3949AB] rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-indigo-400/30 pb-2 mb-3">
              <span className="text-xs font-bold text-indigo-200 uppercase">Fridge Items</span>
              <button onClick={() => setIsFridgeOpen(false)} className="text-xs text-indigo-300 font-bold">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INGREDIENT_POOL.filter((i) => i.location === 'fridge').map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => handleSelectIngredient(ing.id)}
                  className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                    collectedIngredients.includes(ing.id)
                      ? 'bg-emerald-950/80 border-emerald-500 opacity-40'
                      : 'bg-indigo-900/80 border-indigo-500 hover:bg-indigo-800'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: ing.color }}></div>
                  {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PANTRY MODAL OVERLAY */}
        {isPantryOpen && (
          <div className="absolute top-12 right-6 z-30 w-72 bg-[#4E342E] border-4 border-[#6D4C41] rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-amber-400/30 pb-2 mb-3">
              <span className="text-xs font-bold text-amber-200 uppercase">Pantry Items</span>
              <button onClick={() => setIsPantryOpen(false)} className="text-xs text-amber-300 font-bold">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INGREDIENT_POOL.filter((i) => i.location === 'pantry').map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => handleSelectIngredient(ing.id)}
                  className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                    collectedIngredients.includes(ing.id)
                      ? 'bg-emerald-950/80 border-emerald-500 opacity-40'
                      : 'bg-amber-900/80 border-amber-600 hover:bg-amber-800'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: ing.color }}></div>
                  {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LOWER COUNTER & COOKING STATION */}
        <div className="relative w-full h-[55%] bg-[#D78B43] border-t-8 border-[#A66324] p-6 flex justify-between items-center shadow-inner">
          {/* Inventory Counter */}
          <div className="w-64 h-full bg-[#A66324]/40 border-2 border-[#824B17] rounded-2xl p-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-100 uppercase tracking-wider block mb-2">Collected Tools & Food</span>
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-amber-200">Tools Gathered:</div>
                <div className="flex flex-wrap gap-1">
                  {collectedTools.map((tId) => (
                    <span key={tId} className="px-2 py-0.5 bg-amber-950/80 border border-amber-600 rounded text-[10px] uppercase font-bold text-amber-200">
                      {tId}
                    </span>
                  ))}
                  {collectedTools.length === 0 && <span className="text-xs text-amber-900 italic">None collected</span>}
                </div>
              </div>

              <div className="space-y-1 mt-3">
                <div className="text-[11px] font-semibold text-amber-200">Ingredients Gathered:</div>
                <div className="flex flex-wrap gap-1">
                  {collectedIngredients.map((iId) => (
                    <button
                      key={iId}
                      onClick={() => stage === 'cooking' && handleExecuteCookingAction(recipe.steps[currentStepIdx]?.targetTool, iId)}
                      className="px-2 py-0.5 bg-emerald-950 border border-emerald-600 hover:border-yellow-400 rounded text-[10px] uppercase font-bold text-emerald-200 transition-all"
                    >
                      {iId}
                    </button>
                  ))}
                  {collectedIngredients.length === 0 && <span className="text-xs text-amber-900 italic">None gathered</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Stove & Burner Unit */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="w-80 h-36 bg-[#4A148C] border-4 border-[#310A5D] rounded-3xl shadow-2xl p-4 flex flex-col justify-between relative">
              <div className="w-full h-16 bg-[#261035] rounded-2xl border-2 border-purple-900 flex items-center justify-center relative overflow-hidden">
                <div className={`w-28 h-10 rounded-full border-4 transition-all ${stage === 'cooking' ? 'border-orange-500 bg-orange-600/20 shadow-[0_0_20px_rgba(255,109,0,0.6)]' : 'border-gray-700'}`}></div>
              </div>

              <div className="flex justify-between items-center px-4">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
                  <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-md"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-600"></div>
              </div>

              {collectedTools.map((tId) => (
                <button
                  key={tId}
                  onClick={() => handleExecuteCookingAction(tId)}
                  className="absolute -top-10 left-12 bg-slate-900 border-2 border-amber-400 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xl hover:scale-105 transition-transform"
                >
                  Use {tId.toUpperCase()}
                </button>
              ))}

              <div className="absolute -top-6 right-16 flex flex-wrap gap-1 max-w-[120px]">
                {stagedIngredientsInPan.map((ing, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-yellow-400 text-slate-950 font-black text-[9px] rounded-full shadow-sm animate-pulse">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Task Guidance Box */}
          <div className="w-64 h-full bg-[#A66324]/40 border-2 border-[#824B17] rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-100 uppercase tracking-wider block mb-1">Current Task</span>
              <div className="text-sm font-extrabold text-white">
                {stage === 'tools' && 'Click the required tools from the Tool Shelf on the top wall.'}
                {stage === 'ingredients' && 'Open the Fridge or Pantry to find your recipe ingredients.'}
                {stage === 'cooking' && `Step ${currentStepIdx + 1}: ${recipe.steps[currentStepIdx]?.action}`}
                {stage === 'completed' && 'Recipe Completed Successfully!'}
              </div>
            </div>

            {stage === 'completed' && (
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl shadow-lg transition-all"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer System Status */}
      <footer className="max-w-6xl w-full mx-auto bg-[#281845] border border-purple-900/50 px-6 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold text-purple-200">
        <div>System Feedback: <span className="text-yellow-300 font-bold ml-1">{feedback}</span></div>
        <div>Hints Penalty Score: <span className="text-sky-300 font-bold">{hintsUsedCount * 10} pts</span></div>
      </footer>

      {/* RECIPE CHECKLIST MODAL */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#231438] border-2 border-purple-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-purple-800/50 pb-3">
              <div>
                <h2 className="text-2xl font-black text-amber-400">{recipe.title}</h2>
                <p className="text-xs text-purple-300 mt-1">{recipe.description}</p>
              </div>
              <button onClick={() => setShowRecipeModal(false)} className="text-purple-400 font-bold text-sm">✕ Close</button>
            </div>

            <div className="space-y-4">
              {stage === 'tools' && (
                <div>
                  <h3 className="text-xs font-extrabold text-yellow-300 uppercase tracking-wider mb-2">Stage 1: Memorize & Gather Tools</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {recipe.requiredTools.map((t) => (
                      <div key={t.id} className="p-2 bg-purple-900/40 border border-purple-700/50 rounded-xl text-xs font-bold text-purple-100">
                        • {t.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage === 'ingredients' && (
                <div>
                  <h3 className="text-xs font-extrabold text-yellow-300 uppercase tracking-wider mb-2">Stage 2: Memorize & Gather Ingredients</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {recipe.requiredIngredients.map((i) => (
                      <div key={i.id} className="p-2 bg-purple-900/40 border border-purple-700/50 rounded-xl text-xs font-bold text-purple-100">
                        • {i.name} ({i.location})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage === 'cooking' && (
                <div>
                  <h3 className="text-xs font-extrabold text-yellow-300 uppercase tracking-wider mb-2">Stage 3: Cooking Sequence Steps</h3>
                  <div className="space-y-2">
                    {recipe.steps.map((s, idx) => (
                      <div
                        key={s.id}
                        className={`p-2.5 rounded-xl border text-xs font-bold ${
                          idx === currentStepIdx
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : idx < currentStepIdx
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400 line-through'
                            : 'bg-purple-950/40 border-purple-900 text-purple-400'
                        }`}
                      >
                        Step {idx + 1}: {s.action}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowRecipeModal(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition-all"
            >
              Start / Continue Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}