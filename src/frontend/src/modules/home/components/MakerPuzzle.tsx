import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/* ── piece definitions ── */
interface Piece {
  id: string;
  icon: string;
  labelKey: string;
  color: string;
}

const PIECES: Piece[] = [
  { id: "solar",  icon: "☀️", labelKey: "home.puzzle.pieces.solar",  color: "#f59e0b" },
  { id: "sensor", icon: "🌡️", labelKey: "home.puzzle.pieces.sensor", color: "#06b6d4" },
  { id: "board",  icon: "🔲", labelKey: "home.puzzle.pieces.board",  color: "#8b5cf6" },
  { id: "antenna",icon: "📡", labelKey: "home.puzzle.pieces.antenna",color: "#10b981" },
  { id: "battery",icon: "🔋", labelKey: "home.puzzle.pieces.battery",color: "#ef4444" },
];

/* ── slot layout on the "board" ── */
const SLOTS: { id: string; x: number; y: number }[] = [
  { id: "solar",   x: 50, y: 12 },
  { id: "sensor",  x: 18, y: 45 },
  { id: "board",   x: 50, y: 45 },
  { id: "antenna", x: 82, y: 45 },
  { id: "battery", x: 50, y: 78 },
];

/* ── connection lines between slots (SVG paths) ── */
const CONNECTIONS = [
  ["solar", "board"],
  ["sensor", "board"],
  ["antenna", "board"],
  ["board", "battery"],
];

export default function MakerPuzzle() {
  const { t } = useTranslation();
  const boardRef = useRef<HTMLDivElement>(null);

  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const placedCount = Object.keys(placed).length;
  const total = PIECES.length;

  /* ── drag handlers (pointer events = mouse + touch) ── */
  const handlePointerDown = useCallback(
    (pieceId: string, e: React.PointerEvent) => {
      if (placed[pieceId] || completed) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(pieceId);
      setDragPos({ x: e.clientX, y: e.clientY });
    },
    [placed, completed]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      setDragPos({ x: e.clientX, y: e.clientY });
    },
    [dragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !boardRef.current) {
        setDragging(null);
        setDragPos(null);
        return;
      }

      const board = boardRef.current.getBoundingClientRect();
      const x = ((e.clientX - board.left) / board.width) * 100;
      const y = ((e.clientY - board.top) / board.height) * 100;

      // find matching slot within 15% radius
      const slot = SLOTS.find(
        (s) => s.id === dragging && Math.hypot(s.x - x, s.y - y) < 15
      );

      if (slot) {
        const next = { ...placed, [dragging]: true };
        setPlaced(next);

        if (Object.keys(next).length === total) {
          setTimeout(() => {
            setCompleted(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }, 300);
        }
      }

      setDragging(null);
      setDragPos(null);
    },
    [dragging, placed, total]
  );

  const reset = () => {
    setPlaced({});
    setCompleted(false);
    setShowConfetti(false);
  };

  /* ── get slot center for SVG lines ── */
  const slotMap = Object.fromEntries(SLOTS.map((s) => [s.id, s]));

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 md:py-24"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-30">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute animate-confetti block rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
                background: ["#f59e0b", "#06b6d4", "#8b5cf6", "#10b981", "#ef4444", "#3b82f6"][
                  i % 6
                ],
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] md:text-5xl">
            {t("home.puzzle.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
            {t("home.puzzle.subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
          {/* ── Piece tray ── */}
          <div className="flex w-full flex-col gap-3 md:w-56 md:shrink-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t("home.puzzle.pieces.trayLabel")}
            </p>
            {PIECES.map((p) => {
              const isPlaced = placed[p.id];
              const isDragging = dragging === p.id;

              return (
                <div
                  key={p.id}
                  onPointerDown={(e) => handlePointerDown(p.id, e)}
                  className={[
                    "flex cursor-grab select-none items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                    isPlaced
                      ? "border-slate-100 bg-slate-50 text-slate-300"
                      : isDragging
                        ? "scale-105 border-slate-300 bg-white shadow-lg"
                        : "border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md",
                  ].join(" ")}
                  style={{
                    touchAction: "none",
                    opacity: isPlaced ? 0.4 : 1,
                  }}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span>{t(p.labelKey)}</span>
                  {isPlaced && <span className="ml-auto text-green-500">✓</span>}
                </div>
              );
            })}

            {/* Progress */}
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                <span>{t("home.puzzle.progress")}</span>
                <span>
                  {placedCount}/{total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(placedCount / total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Board ── */}
          <div className="flex-1">
            <div
              ref={boardRef}
              className={[
                "relative aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border-2 transition-all duration-500 mx-auto",
                completed
                  ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50"
                  : "border-dashed border-slate-200 bg-white",
              ].join(" ")}
            >
              {/* Background decorations */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
                <div className="absolute left-4 top-4 text-6xl">🌲</div>
                <div className="absolute bottom-4 right-4 text-6xl">🌴</div>
                <div className="absolute right-4 top-4 text-4xl">🇨🇱</div>
                <div className="absolute bottom-4 left-4 text-4xl">🇧🇷</div>
              </div>

              {/* SVG connection lines */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                {CONNECTIONS.map(([from, to]) => {
                  const a = slotMap[from];
                  const b = slotMap[to];
                  const isActive = placed[from] && placed[to];
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={isActive ? "#10b981" : "#e2e8f0"}
                      strokeWidth={isActive ? 0.8 : 0.5}
                      strokeDasharray={isActive ? "none" : "2 2"}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>

              {/* Drop slots */}
              {SLOTS.map((slot) => {
                const piece = PIECES.find((p) => p.id === slot.id)!;
                const isSlotFilled = placed[slot.id];

                return (
                  <div
                    key={slot.id}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                    style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  >
                    <div
                      className={[
                        "grid h-14 w-14 place-items-center rounded-2xl border-2 text-2xl transition-all duration-300 md:h-16 md:w-16",
                        isSlotFilled
                          ? "scale-110 border-green-300 bg-green-50 shadow-md shadow-green-200/50"
                          : dragging === slot.id
                            ? "scale-105 border-blue-300 bg-blue-50 animate-pulse"
                            : "border-dashed border-slate-200 bg-slate-50/50",
                      ].join(" ")}
                    >
                      {isSlotFilled ? (
                        <span className="animate-pop">{piece.icon}</span>
                      ) : (
                        <span className="text-base text-slate-300">?</span>
                      )}
                    </div>
                    <span
                      className={[
                        "text-[10px] font-medium transition-colors md:text-xs",
                        isSlotFilled ? "text-green-600" : "text-slate-300",
                      ].join(" ")}
                    >
                      {t(piece.labelKey)}
                    </span>
                  </div>
                );
              })}

              {/* Completed overlay */}
              {completed && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-fadeIn">
                  <div className="mb-2 text-5xl animate-bounce-slow">🎉</div>
                  <h3 className="text-xl font-bold text-slate-900 md:text-2xl">
                    {t("home.puzzle.completed.title")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {t("home.puzzle.completed.subtitle")}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      +50 XP
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      🏅 {t("home.puzzle.completed.badge")}
                    </span>
                  </div>
                  <button
                    onClick={reset}
                    className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                  >
                    {t("home.puzzle.completed.retry")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dragging ghost */}
      {dragging && dragPos && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xl shadow-xl"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          {PIECES.find((p) => p.id === dragging)?.icon}
        </div>
      )}

      {/* CSS animations via style tag */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti-fall linear forwards; }

        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop-in 0.4s ease-out; }

        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fade-in 0.5s ease-out; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
