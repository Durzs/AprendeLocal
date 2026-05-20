import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/* ═══════════════════════════════════════════════
   PHASE 1 — Assembly puzzle data
   ═══════════════════════════════════════════════ */
interface Piece { id: string; icon: string; labelKey: string; color: string }

const PIECES: Piece[] = [
  { id: "solar",   icon: "☀️", labelKey: "home.puzzle.pieces.solar",   color: "#f59e0b" },
  { id: "sensor",  icon: "🌡️", labelKey: "home.puzzle.pieces.sensor",  color: "#06b6d4" },
  { id: "board",   icon: "🔲", labelKey: "home.puzzle.pieces.board",   color: "#8b5cf6" },
  { id: "antenna", icon: "📡", labelKey: "home.puzzle.pieces.antenna", color: "#10b981" },
  { id: "battery", icon: "🔋", labelKey: "home.puzzle.pieces.battery", color: "#ef4444" },
];

const SLOTS = [
  { id: "solar",   x: 50, y: 12 },
  { id: "sensor",  x: 18, y: 45 },
  { id: "board",   x: 50, y: 45 },
  { id: "antenna", x: 82, y: 45 },
  { id: "battery", x: 50, y: 78 },
];

const CONNECTIONS = [
  ["solar", "board"], ["sensor", "board"],
  ["antenna", "board"], ["board", "battery"],
];

/* ═══════════════════════════════════════════════
   PHASE 2 — Forest detection data
   ═══════════════════════════════════════════════ */
interface Creature {
  id: string;
  icon: string;
  nameKey: string;
  factKey: string;
  x: number;   // % from left
  y: number;   // % from top
  size: number; // click radius in px
}

const CREATURES: Creature[] = [
  { id: "monito",    icon: "🐒", nameKey: "home.forest.creatures.monito.name",    factKey: "home.forest.creatures.monito.fact",    x: 14, y: 52, size: 28 },
  { id: "araucaria", icon: "🌲", nameKey: "home.forest.creatures.araucaria.name", factKey: "home.forest.creatures.araucaria.fact", x: 78, y: 22, size: 30 },
  { id: "woodpecker",icon: "🐦", nameKey: "home.forest.creatures.woodpecker.name",factKey: "home.forest.creatures.woodpecker.fact",x: 58, y: 30, size: 26 },
  { id: "frog",      icon: "🐸", nameKey: "home.forest.creatures.frog.name",      factKey: "home.forest.creatures.frog.fact",      x: 35, y: 78, size: 26 },
  { id: "fern",      icon: "🌿", nameKey: "home.forest.creatures.fern.name",      factKey: "home.forest.creatures.fern.fact",      x: 88, y: 72, size: 28 },
  { id: "orchid",    icon: "🌺", nameKey: "home.forest.creatures.orchid.name",     factKey: "home.forest.creatures.orchid.fact",    x: 25, y: 28, size: 26 },
];

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */
export default function MakerPuzzle() {
  const { t } = useTranslation();

  /* shared */
  const [phase, setPhase] = useState<1 | 2>(1);
  const [showConfetti, setShowConfetti] = useState(false);

  /* phase 1 */
  const boardRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced]     = useState<Record<string, boolean>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos]   = useState<{ x: number; y: number } | null>(null);
  const [p1Done, setP1Done]     = useState(false);

  /* phase 2 */
  const [found, setFound]           = useState<Record<string, boolean>>({});
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [p2Done, setP2Done]         = useState(false);
  const [scanPulse, setScanPulse]   = useState<{ x: number; y: number } | null>(null);

  const placedCount = Object.keys(placed).length;
  const foundCount  = Object.keys(found).length;

  /* ── Phase 1 handlers ── */
  const handlePointerDown = useCallback(
    (pieceId: string, e: React.PointerEvent) => {
      if (placed[pieceId] || p1Done) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(pieceId);
      setDragPos({ x: e.clientX, y: e.clientY });
    },
    [placed, p1Done]
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
      const slot = SLOTS.find((s) => s.id === dragging && Math.hypot(s.x - x, s.y - y) < 15);

      if (slot) {
        const next = { ...placed, [dragging]: true };
        setPlaced(next);
        if (Object.keys(next).length === PIECES.length) {
          setTimeout(() => {
            setP1Done(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }, 300);
        }
      }
      setDragging(null);
      setDragPos(null);
    },
    [dragging, placed]
  );

  const goToPhase2 = () => {
    setPhase(2);
    setShowConfetti(false);
  };

  /* ── Phase 2 handlers ── */
  const handleForestClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (p2Done) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 100;
    const cy = ((e.clientY - rect.top) / rect.height) * 100;

    // pulse ring
    setScanPulse({ x: cx, y: cy });
    setTimeout(() => setScanPulse(null), 800);

    // check if near a creature
    for (const c of CREATURES) {
      if (found[c.id]) continue;
      const dist = Math.hypot(c.x - cx, c.y - cy);
      if (dist < 8) {
        const next = { ...found, [c.id]: true };
        setFound(next);
        setActivePopup(c.id);
        setTimeout(() => setActivePopup(null), 3500);

        if (Object.keys(next).length === CREATURES.length) {
          setTimeout(() => {
            setP2Done(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }, 600);
        }
        return;
      }
    }
  };

  const resetAll = () => {
    setPhase(1);
    setPlaced({});
    setP1Done(false);
    setFound({});
    setP2Done(false);
    setActivePopup(null);
    setShowConfetti(false);
    setScanPulse(null);
  };

  const slotMap = Object.fromEntries(SLOTS.map((s) => [s.id, s]));

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 md:py-24"
      onPointerMove={phase === 1 ? handlePointerMove : undefined}
      onPointerUp={phase === 1 ? handlePointerUp : undefined}
    >
      {/* Confetti */}
      {showConfetti && <Confetti />}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="mb-10 text-center">
          {/* Phase indicator */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold shadow-sm">
            <span className={phase === 1 ? "text-violet-600" : "text-slate-400"}>
              {t("home.puzzle.phase1Tag")}
            </span>
            <span className="text-slate-300">→</span>
            <span className={phase === 2 ? "text-emerald-600" : "text-slate-400"}>
              {t("home.puzzle.phase2Tag")}
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] md:text-5xl">
            {phase === 1 ? t("home.puzzle.title") : t("home.forest.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
            {phase === 1 ? t("home.puzzle.subtitle") : t("home.forest.subtitle")}
          </p>
        </div>

        {/* ═══════ PHASE 1 — ASSEMBLY ═══════ */}
        {phase === 1 && (
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            {/* Piece tray */}
            <div className="flex w-full flex-col gap-3 md:w-56 md:shrink-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t("home.puzzle.pieces.trayLabel")}
              </p>
              {PIECES.map((p) => {
                const isPlaced = placed[p.id];
                const isDrag = dragging === p.id;
                return (
                  <div
                    key={p.id}
                    onPointerDown={(e) => handlePointerDown(p.id, e)}
                    className={[
                      "flex cursor-grab select-none items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                      isPlaced
                        ? "border-slate-100 bg-slate-50 text-slate-300"
                        : isDrag
                          ? "scale-105 border-slate-300 bg-white shadow-lg"
                          : "border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md",
                    ].join(" ")}
                    style={{ touchAction: "none", opacity: isPlaced ? 0.4 : 1 }}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span>{t(p.labelKey)}</span>
                    {isPlaced && <span className="ml-auto text-green-500">✓</span>}
                  </div>
                );
              })}
              <ProgressBar current={placedCount} total={PIECES.length} label={t("home.puzzle.progress")} />
            </div>

            {/* Board */}
            <div className="flex-1">
              <div
                ref={boardRef}
                className={[
                  "relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border-2 transition-all duration-500",
                  p1Done
                    ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50"
                    : "border-dashed border-slate-200 bg-white",
                ].join(" ")}
              >
                {/* Decorations */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
                  <div className="absolute left-4 top-4 text-6xl">🌲</div>
                  <div className="absolute bottom-4 right-4 text-6xl">🌴</div>
                  <div className="absolute right-4 top-4 text-4xl">🇨🇱</div>
                  <div className="absolute bottom-4 left-4 text-4xl">🇧🇷</div>
                </div>

                {/* Connection lines */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                  {CONNECTIONS.map(([from, to]) => {
                    const a = slotMap[from], b = slotMap[to];
                    const active = placed[from] && placed[to];
                    return (
                      <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                        stroke={active ? "#10b981" : "#e2e8f0"}
                        strokeWidth={active ? 0.8 : 0.5}
                        strokeDasharray={active ? "none" : "2 2"}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>

                {/* Slots */}
                {SLOTS.map((slot) => {
                  const piece = PIECES.find((p) => p.id === slot.id)!;
                  const filled = placed[slot.id];
                  return (
                    <div key={slot.id}
                      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                    >
                      <div className={[
                        "grid h-14 w-14 place-items-center rounded-2xl border-2 text-2xl transition-all duration-300 md:h-16 md:w-16",
                        filled ? "scale-110 border-green-300 bg-green-50 shadow-md shadow-green-200/50"
                          : dragging === slot.id ? "scale-105 border-blue-300 bg-blue-50 animate-pulse"
                          : "border-dashed border-slate-200 bg-slate-50/50",
                      ].join(" ")}>
                        {filled
                          ? <span className="animate-pop">{piece.icon}</span>
                          : <span className="text-base text-slate-300">?</span>}
                      </div>
                      <span className={["text-[10px] font-medium md:text-xs transition-colors",
                        filled ? "text-green-600" : "text-slate-300"].join(" ")}>
                        {t(piece.labelKey)}
                      </span>
                    </div>
                  );
                })}

                {/* Completed overlay */}
                {p1Done && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-fadeIn">
                    <div className="mb-2 text-5xl animate-bounce-slow">🎉</div>
                    <h3 className="text-xl font-bold text-slate-900 md:text-2xl">
                      {t("home.puzzle.completed.title")}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {t("home.puzzle.completed.subtitle")}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">+50 XP</span>
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">🏅 {t("home.puzzle.completed.badge")}</span>
                    </div>
                    <button onClick={goToPhase2}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700">
                      🌳 {t("home.puzzle.completed.deploy")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ PHASE 2 — FOREST DETECTION ═══════ */}
        {phase === 2 && (
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            {/* Species log */}
            <div className="flex w-full flex-col gap-3 md:w-60 md:shrink-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t("home.forest.logLabel")}
              </p>
              {CREATURES.map((c) => {
                const isFound = found[c.id];
                return (
                  <div key={c.id}
                    className={[
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                      isFound
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-100 bg-slate-50 text-slate-300",
                    ].join(" ")}
                  >
                    <span className="text-xl">{isFound ? c.icon : "❓"}</span>
                    <span>{isFound ? t(c.nameKey) : "???"}</span>
                    {isFound && <span className="ml-auto text-emerald-500">✓</span>}
                  </div>
                );
              })}
              <ProgressBar current={foundCount} total={CREATURES.length} label={t("home.forest.progress")} />
            </div>

            {/* Forest scene */}
            <div className="flex-1">
              <div
                onClick={handleForestClick}
                className={[
                  "relative mx-auto aspect-[4/3] w-full max-w-lg cursor-crosshair overflow-hidden rounded-[2rem] border-2 transition-all duration-500",
                  p2Done
                    ? "border-emerald-300 shadow-lg shadow-emerald-200/50"
                    : "border-emerald-200",
                ].join(" ")}
                style={{
                  background: "linear-gradient(180deg, #1a3a2a 0%, #0f2b1a 20%, #163d24 50%, #1e4d2e 70%, #2a5f38 85%, #1b3f26 100%)",
                }}
              >
                {/* Forest layers */}
                {/* Mist */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

                {/* Tree silhouettes — back layer */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  {/* Tall conifers (Araucaria-like) */}
                  <polygon points="40,280 50,60 60,280" fill="#0a1f12" />
                  <polygon points="45,120 50,60 55,120" fill="#0d2816" />
                  <polygon points="42,180 50,100 58,180" fill="#0d2816" />

                  <polygon points="340,280 350,50 360,280" fill="#0a1f12" />
                  <polygon points="345,110 350,50 355,110" fill="#0d2816" />
                  <polygon points="342,170 350,90 358,170" fill="#0d2816" />

                  {/* Broad canopy trees */}
                  <ellipse cx="120" cy="100" rx="50" ry="40" fill="#0d2816" />
                  <rect x="117" y="100" width="6" height="180" fill="#0a1f12" />

                  <ellipse cx="280" cy="90" rx="55" ry="45" fill="#0d2816" />
                  <rect x="277" y="90" width="6" height="190" fill="#0a1f12" />

                  <ellipse cx="200" cy="70" rx="60" ry="35" fill="#0f2b1a" />
                  <rect x="197" y="70" width="6" height="210" fill="#0a1f12" />

                  {/* Ground ferns */}
                  <ellipse cx="80"  cy="270" rx="30" ry="12" fill="#1a4a2e" />
                  <ellipse cx="180" cy="280" rx="25" ry="10" fill="#1a4a2e" />
                  <ellipse cx="320" cy="275" rx="28" ry="11" fill="#1a4a2e" />
                </svg>

                {/* Foreground leaves */}
                <div className="pointer-events-none absolute -left-4 bottom-0 text-5xl opacity-40 md:text-7xl">🌿</div>
                <div className="pointer-events-none absolute -right-2 top-8 rotate-12 text-4xl opacity-30 md:text-6xl">🍃</div>

                {/* Station icon (deployed) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-emerald-400/50 bg-emerald-900/60 text-xl shadow-lg backdrop-blur-sm md:h-14 md:w-14 md:text-2xl">
                      📡
                    </div>
                    {/* scanning rings */}
                    {!p2Done && (
                      <>
                        <div className="absolute inset-0 animate-ping-slow rounded-xl border border-emerald-400/30" />
                        <div className="absolute -inset-3 animate-ping-slower rounded-2xl border border-emerald-400/15" />
                      </>
                    )}
                  </div>
                </div>

                {/* Hidden creatures */}
                {CREATURES.map((c) => {
                  const isFound = found[c.id];
                  return (
                    <div
                      key={c.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    >
                      {isFound ? (
                        <div className="animate-pop text-2xl md:text-3xl drop-shadow-lg">
                          {c.icon}
                        </div>
                      ) : (
                        /* Subtle hint glow */
                        <div className="h-5 w-5 animate-glow rounded-full bg-emerald-400/20 md:h-6 md:w-6" />
                      )}
                    </div>
                  );
                })}

                {/* Scan pulse ring */}
                {scanPulse && (
                  <div
                    className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-scan-ring rounded-full border-2 border-emerald-400/60"
                    style={{ left: `${scanPulse.x}%`, top: `${scanPulse.y}%` }}
                  />
                )}

                {/* Popup when found */}
                {activePopup && (() => {
                  const c = CREATURES.find((cr) => cr.id === activePopup)!;
                  return (
                    <div className="absolute left-1/2 bottom-4 z-20 w-[85%] max-w-xs -translate-x-1/2 animate-fadeIn rounded-2xl border border-emerald-300/50 bg-white/95 p-4 shadow-xl backdrop-blur-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{c.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{t(c.nameKey)}</p>
                          <p className="mt-0.5 text-xs leading-5 text-slate-500">{t(c.factKey)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Completed overlay */}
                {p2Done && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="mb-2 text-5xl animate-bounce-slow">🌳</div>
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      {t("home.forest.completed.title")}
                    </h3>
                    <p className="mt-1 text-sm text-emerald-200">
                      {t("home.forest.completed.subtitle")}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold text-amber-900">+100 XP</span>
                      <span className="rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-semibold text-emerald-900">🏅 {t("home.forest.completed.badge")}</span>
                    </div>
                    <button onClick={resetAll}
                      className="mt-5 rounded-full border border-white/30 bg-white/20 px-5 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/30">
                      {t("home.forest.completed.restart")}
                    </button>
                  </div>
                )}
              </div>

              {/* Hint text */}
              {!p2Done && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  💡 {t("home.forest.hint")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dragging ghost (phase 1) */}
      {dragging && dragPos && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xl shadow-xl"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          {PIECES.find((p) => p.id === dragging)?.icon}
        </div>
      )}

      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti-fall linear forwards; }

        @keyframes pop-in {
          0%  { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); }
          100%{ transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop-in 0.4s ease-out; }

        @keyframes fade-in {
          0%  { opacity: 0; transform: scale(0.95); }
          100%{ opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fade-in 0.5s ease-out; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        @keyframes ping-slow {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .animate-ping-slow  { animation: ping-slow 2s ease-out infinite; }
        .animate-ping-slower { animation: ping-slow 3s ease-out infinite 0.5s; }

        @keyframes glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%      { opacity: 0.4;  transform: scale(1.2); }
        }
        .animate-glow { animation: glow 3s ease-in-out infinite; }

        @keyframes scan-ring {
          0%   { transform: translate(-50%,-50%) scale(0.3); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(3);   opacity: 0; }
        }
        .animate-scan-ring { animation: scan-ring 0.8s ease-out forwards; }
      `}</style>
    </section>
  );
}

/* ── Shared sub-components ── */
function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div className="mt-2">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{current}/{total}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Confetti() {
  return (
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
            background: ["#f59e0b","#06b6d4","#8b5cf6","#10b981","#ef4444","#3b82f6"][i % 6],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
