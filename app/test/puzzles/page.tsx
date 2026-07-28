'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface PuzzleArtwork {
  id: string;
  title: string;
  description: string;
  renderSVG: () => ReactNode;
}

// 5 Built-in puzzle artworks rendered at 300x300 resolution
const PUZZLE_ARTWORKS: PuzzleArtwork[] = [
  {
    id: 'mountain-sunrise',
    title: 'Mountain Sunrise',
    description: 'Warm mountain horizon with geometric sun rays',
    renderSVG: () => (
      <g>
        <rect width="300" height="300" fill="#F4EAD4" />
        <circle cx="150" cy="140" r="75" fill="#E28743" />
        <polygon points="0,300 120,180 200,260 300,160 300,300" fill="#4A6C7C" />
        <polygon points="0,300 80,210 160,300" fill="#2C3338" opacity="0.25" />
        <circle cx="150" cy="140" r="45" fill="#EAB308" />
        <path d="M0,240 Q150,200 300,240 L300,300 L0,300 Z" fill="#1B2A4A" opacity="0.8" />
      </g>
    ),
  },
  {
    id: 'mandala-pattern',
    title: 'Cognitive Mandala',
    description: 'Symmetrical geometric floral pattern',
    renderSVG: () => (
      <g>
        <rect width="300" height="300" fill="#1B2A4A" />
        <circle cx="150" cy="150" r="110" fill="#4A6C7C" opacity="0.4" />
        <circle cx="150" cy="150" r="80" fill="#7A9A7D" opacity="0.6" />
        <g stroke="#F8F5F0" strokeWidth="4" fill="none">
          <circle cx="150" cy="150" r="120" />
          <circle cx="150" cy="150" r="90" />
          <path d="M150,30 L150,270 M30,150 L270,150 M65,65 L235,235 M65,235 L235,65" />
        </g>
        <circle cx="150" cy="150" r="35" fill="#C36055" />
      </g>
    ),
  },
  {
    id: 'autumn-canopy',
    title: 'Autumn Canopy',
    description: 'Layered woodland shapes and warm tones',
    renderSVG: () => (
      <g>
        <rect width="300" height="300" fill="#EAE4D9" />
        <circle cx="70" cy="120" r="60" fill="#C36055" />
        <circle cx="150" cy="90" r="75" fill="#E28743" />
        <circle cx="230" cy="130" r="55" fill="#7A9A7D" />
        <rect x="60" y="160" width="20" height="140" rx="6" fill="#2C3338" />
        <rect x="140" y="140" width="24" height="160" rx="6" fill="#2C3338" />
        <rect x="220" y="170" width="18" height="130" rx="6" fill="#2C3338" />
        <path d="M0,260 Q150,220 300,260 L300,300 L0,300 Z" fill="#4A6C7C" />
      </g>
    ),
  },
  {
    id: 'stained-glass',
    title: 'Interlocking Glass',
    description: 'High-contrast interlocking colored shapes',
    renderSVG: () => (
      <g>
        <rect width="300" height="300" fill="#F8F5F0" />
        <polygon points="0,0 150,0 0,150" fill="#1B2A4A" />
        <polygon points="150,0 300,0 300,150" fill="#C36055" />
        <polygon points="300,150 300,300 150,300" fill="#7A9A7D" />
        <polygon points="150,300 0,300 0,150" fill="#E28743" />
        <circle cx="150" cy="150" r="65" fill="#4A6C7C" />
        <rect x="115" y="115" width="70" height="70" fill="#F4EAD4" rx="8" />
      </g>
    ),
  },
  {
    id: 'celestial-orbits',
    title: 'Celestial Orbits',
    description: 'Planetary rings and cosmic orbits',
    renderSVG: () => (
      <g>
        <rect width="300" height="300" fill="#2C3338" />
        <circle cx="150" cy="150" r="50" fill="#EAB308" />
        <ellipse cx="150" cy="150" rx="120" ry="40" fill="none" stroke="#4A6C7C" strokeWidth="6" transform="rotate(-25 150 150)" />
        <ellipse cx="150" cy="150" rx="100" ry="25" fill="none" stroke="#C36055" strokeWidth="4" transform="rotate(35 150 150)" />
        <circle cx="60" cy="80" r="10" fill="#F8F5F0" />
        <circle cx="240" cy="220" r="14" fill="#7A9A7D" />
      </g>
    ),
  },
];

// Matrix definitions for 3x3 interlocking jigsaw piece edges
const H_EDGES = [
  ['out', 'in', 'out'],
  ['in', 'out', 'in'],
];
const V_EDGES = [
  ['out', 'in'],
  ['in', 'out'],
  ['out', 'in'],
];

// Generates precise interlocking SVG path for a specific 3x3 jigsaw piece
function getJigsawPath(row: number, col: number): string {
  const x = col * 100;
  const y = row * 100;

  const topEdge = row === 0 ? 'flat' : H_EDGES[row - 1][col] === 'out' ? 'in' : 'out';
  const rightEdge = col === 2 ? 'flat' : V_EDGES[row][col];
  const bottomEdge = row === 2 ? 'flat' : H_EDGES[row][col];
  const leftEdge = col === 0 ? 'flat' : V_EDGES[row][col - 1] === 'out' ? 'in' : 'out';

  let path = `M ${x} ${y} `;

  // Top edge
  if (topEdge === 'flat') path += `l 100 0 `;
  else if (topEdge === 'out') path += `l 35 0 c 0 -15, 10 -20, 15 -20 c 5 0, 15 5, 15 20 l 35 0 `;
  else path += `l 35 0 c 0 15, 10 20, 15 20 c 5 0, 15 -5, 15 -20 l 35 0 `;

  // Right edge
  if (rightEdge === 'flat') path += `l 0 100 `;
  else if (rightEdge === 'out') path += `l 0 35 c 15 0, 20 10, 20 15 c 0 5, -5 15, -20 15 l 0 35 `;
  else path += `l 0 35 c -15 0, -20 10, -20 15 c 0 5, 5 15, 20 15 l 0 35 `;

  // Bottom edge
  if (bottomEdge === 'flat') path += `l -100 0 `;
  else if (bottomEdge === 'out') path += `l -35 0 c 0 15, -10 20, -15 20 c -5 0, -15 -5, -15 -20 l -35 0 `;
  else path += `l -35 0 c 0 -15, -10 -20, -15 -20 c -5 0, -15 5, -15 20 l -35 0 `;

  // Left edge
  if (leftEdge === 'flat') path += `l 0 -100 `;
  else if (leftEdge === 'out') path += `l 0 -35 c -15 0, -20 -10, -20 -15 c 0 -5, 5 -15, 20 -15 l 0 -35 `;
  else path += `l 0 -35 c 15 0, 20 -10, 20 -15 c 0 -5, -5 -15, -20 -15 l 0 -35 `;

  return path + 'Z';
}

export default function TimedJigsawPuzzlePage() {
  const router = useRouter();

  const [activeArtwork, setActiveArtwork] = useState<PuzzleArtwork | null>(null);
  
  // Board state: Array of length 9 representing grid slots 0..8 (null = empty slot, or piece ID 0..8)
  const [boardSlots, setBoardSlots] = useState<(number | null)[]>(Array(9).fill(null));
  
  // Unplaced pieces remaining in tray
  const [trayPieces, setTrayPieces] = useState<number[]>([]);
  
  // Currently selected piece (from tray or board)
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);

  // Metrics
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load a non-repeating random puzzle
  const initGame = useCallback(() => {
    const saved = localStorage.getItem('mindtrace_completed_jigsaws');
    let completedIds: string[] = saved ? JSON.parse(saved) : [];

    let available = PUZZLE_ARTWORKS.filter((p) => !completedIds.includes(p.id));
    if (available.length === 0) {
      completedIds = [];
      localStorage.setItem('mindtrace_completed_jigsaws', JSON.stringify([]));
      available = [...PUZZLE_ARTWORKS];
    }

    const chosen = available[Math.floor(Math.random() * available.length)];
    setActiveArtwork(chosen);

    // Shuffle piece IDs 0 through 8 for the tray
    const shuffled = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
    setTrayPieces(shuffled);
    setBoardSlots(Array(9).fill(null));
    setSelectedPieceId(null);
    setMoves(0);
    setSeconds(0);
    setIsCompleted(false);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && !isCompleted) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isCompleted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Place selected piece into target board slot
  const placePieceInSlot = (slotIndex: number) => {
    if (selectedPieceId === null || isCompleted) return;

    const currentSlotPiece = boardSlots[slotIndex];
    const newBoard = [...boardSlots];
    newBoard[slotIndex] = selectedPieceId;

    // Update tray
    let newTray = trayPieces.filter((id) => id !== selectedPieceId);
    if (currentSlotPiece !== null && currentSlotPiece !== selectedPieceId) {
      newTray.push(currentSlotPiece); // Swap old piece back to tray
    }

    setBoardSlots(newBoard);
    setTrayPieces(newTray);
    setSelectedPieceId(null);
    setMoves((m) => m + 1);

    // Check if solved (all slots 0..8 match piece IDs 0..8)
    const solved = newBoard.every((pieceId, idx) => pieceId === idx);
    if (solved) {
      setIsCompleted(true);
      setTimerActive(false);

      if (activeArtwork) {
        const saved = localStorage.getItem('mindtrace_completed_jigsaws');
        const ids: string[] = saved ? JSON.parse(saved) : [];
        if (!ids.includes(activeArtwork.id)) {
          ids.push(activeArtwork.id);
          localStorage.setItem('mindtrace_completed_jigsaws', JSON.stringify(ids));
        }
      }
    }
  };

  // Click on a piece on the board to pick it back up or select it
  const handleBoardSlotClick = (slotIndex: number) => {
    const pieceInSlot = boardSlots[slotIndex];

    if (selectedPieceId !== null) {
      // Place piece into slot
      placePieceInSlot(slotIndex);
    } else if (pieceInSlot !== null) {
      // Pick up piece from board
      setSelectedPieceId(pieceInSlot);
      const newBoard = [...boardSlots];
      newBoard[slotIndex] = null;
      setBoardSlots(newBoard);
    }
  };

  if (!activeArtwork) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center text-[#6B7280]">
        Loading Jigsaw...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2C3338] font-sans antialiased flex flex-col justify-between p-4 sm:p-6 select-none">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#E8E2D5]">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-[#6B7280] hover:text-[#2C3338] font-semibold text-sm transition-colors flex items-center gap-2"
        >
          ← Dashboard
        </button>

        <div className="flex items-center gap-6">
          <div className="text-sm font-bold text-[#2C3338] flex items-center gap-1.5">
            <span>⏱️</span> {formatTime(seconds)}
          </div>
          <div className="text-sm font-bold text-[#6B7280] flex items-center gap-1.5">
            <span>🧩</span> {moves} moves
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-4 space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3338]">
            {activeArtwork.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium">
            Assemble the jigsaw pieces to match the target image.
          </p>
        </div>

        {/* Workspace Layout: Target Image | Assembly Grid | Piece Tray */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-8 w-full">
          
          {/* Target Reference Image Card */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider">
              Target Image
            </span>
            <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-[#EAE4D9] rounded-2xl p-2.5 border-2 border-[#E0D7C8] shadow-xs flex flex-col items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full h-full rounded-xl overflow-hidden shadow-inner">
                {activeArtwork.renderSVG()}
              </svg>
            </div>
          </div>

          {/* Assembly Board Container */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider">
              Assembly Board
            </span>
            
            <div className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] bg-[#EAE4D9] rounded-2xl border-2 border-[#E0D7C8] shadow-md overflow-visible">
              
              {/* Background Guide Outline Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="border border-dashed border-[#1B2A4A]" />
                ))}
              </div>

              {/* Placed Pieces SVG Board */}
              <svg viewBox="0 0 300 300" className="w-full h-full absolute inset-0 overflow-visible">
                <defs>
                  {Array(9).fill(0).map((_, pieceId) => {
                    const r = Math.floor(pieceId / 3);
                    const c = pieceId % 3;
                    return (
                      <clipPath id={`clip-piece-${pieceId}`} key={pieceId}>
                        <path d={getJigsawPath(r, c)} />
                      </clipPath>
                    );
                  })}
                </defs>

                {/* Render Placed Pieces */}
                {boardSlots.map((pieceId, slotIndex) => {
                  if (pieceId === null) return null;

                  const targetRow = Math.floor(slotIndex / 3);
                  const targetCol = slotIndex % 3;
                  const sourceRow = Math.floor(pieceId / 3);
                  const sourceCol = pieceId % 3;

                  // Translate piece if placed in a different slot
                  const dx = (targetCol - sourceCol) * 100;
                  const dy = (targetRow - sourceRow) * 100;

                  return (
                    <g
                      key={`placed-${slotIndex}`}
                      transform={`translate(${dx}, ${dy})`}
                      onClick={() => handleBoardSlotClick(slotIndex)}
                      className="cursor-pointer hover:opacity-95"
                    >
                      <g clipPath={`url(#clip-piece-${pieceId})`}>
                        {activeArtwork.renderSVG()}
                      </g>
                      <path
                        d={getJigsawPath(sourceRow, sourceCol)}
                        fill="none"
                        stroke="#1B2A4A"
                        strokeWidth="2"
                        strokeOpacity="0.4"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Click Target Overlay Slots */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {boardSlots.map((pieceId, slotIdx) => (
                  <button
                    key={slotIdx}
                    onClick={() => handleBoardSlotClick(slotIdx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const pId = e.dataTransfer.getData('text/plain');
                      if (pId !== '') {
                        setSelectedPieceId(parseInt(pId, 10));
                        placePieceInSlot(slotIdx);
                      }
                    }}
                    className={`
                      w-full h-full transition-colors flex items-center justify-center rounded-lg
                      ${pieceId === null && selectedPieceId !== null ? 'hover:bg-[#1B2A4A]/10 border-2 border-dashed border-[#1B2A4A]/40' : ''}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Jigsaw Pieces Tray */}
          <div className="flex flex-col gap-2 w-full max-w-[280px]">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider">
                Piece Tray ({trayPieces.length})
              </span>
              {selectedPieceId !== null && (
                <button
                  onClick={() => setSelectedPieceId(null)}
                  className="text-xs text-[#C36055] font-bold"
                >
                  Deselect
                </button>
              )}
            </div>

            <div className="bg-[#EAE4D9] rounded-2xl p-4 border border-[#E0D7C8]">
              {/* Tray Pieces Grid */}
              <div className="grid grid-cols-3 gap-3 min-h-[200px] items-center justify-items-center">
                {trayPieces.map((pieceId) => {
                  const r = Math.floor(pieceId / 3);
                  const c = pieceId % 3;
                  const isSelected = selectedPieceId === pieceId;

                  return (
                    <button
                      key={pieceId}
                      draggable
                      onDragStart={(e) => {
                        setSelectedPieceId(pieceId);
                        e.dataTransfer.setData('text/plain', pieceId.toString());
                      }}
                      onClick={() => setSelectedPieceId(isSelected ? null : pieceId)}
                      className={`
                        relative w-[72px] h-[72px] rounded-xl p-1 transition-all cursor-grab active:cursor-grabbing
                        flex items-center justify-center bg-[#F8F5F0] border
                        ${isSelected ? 'ring-4 ring-[#1B2A4A] border-[#1B2A4A] scale-105 shadow-md' : 'border-[#E0D7C8] hover:border-[#4A6C7C]'}
                      `}
                    >
                      <svg
                        viewBox={`${c * 100 - 15} ${r * 100 - 15} 130 130`}
                        className="w-full h-full overflow-visible"
                      >
                        <defs>
                          <clipPath id={`clip-tray-${pieceId}`}>
                            <path d={getJigsawPath(r, c)} />
                          </clipPath>
                        </defs>
                        <g clipPath={`url(#clip-tray-${pieceId})`}>
                          {activeArtwork.renderSVG()}
                        </g>
                        <path
                          d={getJigsawPath(r, c)}
                          fill="none"
                          stroke="#1B2A4A"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </button>
                  );
                })}

                {trayPieces.length === 0 && (
                  <div className="col-span-3 text-center text-xs font-semibold text-[#7A9A7D] py-8">
                    All pieces placed! Check grid to finish.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Completion Modal */}
        {isCompleted && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[#F8F5F0] border border-[#E0D7C8] rounded-2xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-3xl mx-auto shadow-sm">
                🧩
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-[#2C3338]">Jigsaw Assembled!</h2>
                <p className="text-sm text-[#6B7280]">
                  Excellent spatial and cognitive execution.
                </p>
              </div>

              <div className="bg-[#EAE4D9] rounded-xl p-4 border border-[#E0D7C8] grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#6B7280] font-semibold uppercase">Time</div>
                  <div className="text-xl font-extrabold text-[#2C3338] mt-0.5">
                    {formatTime(seconds)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] font-semibold uppercase">Moves</div>
                  <div className="text-xl font-extrabold text-[#2C3338] mt-0.5">
                    {moves}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={initGame}
                  className="w-full py-3 bg-[#1B2A4A] hover:bg-[#121D34] text-white font-semibold rounded-xl transition-all shadow-xs text-sm"
                >
                  Play Another Jigsaw
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 bg-[#EAE4D9] hover:bg-[#E0D7C8] text-[#2C3338] font-semibold rounded-xl transition-all text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="max-w-6xl mx-auto w-full text-center py-2 border-t border-[#E8E2D5]">
        <p className="text-xs text-[#9CA3AF] font-medium">
          Cognitive Exercise • Real Jigsaw Piece Assembly & Pattern Matching
        </p>
      </footer>

    </div>
  );
}