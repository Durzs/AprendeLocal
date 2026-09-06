import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function HowItWorksSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const durationPerStep = 4500; // 4.5s por etapa
  const tickInterval = 50;

  const stages = [
    {
      id: 0,
      name: "Territorio",
      bgColor: "#0a0047", // 1. Azul Marino Profundo
      title: "Aprender desde el río, el bosque y la cuenca local",
      desc: "Transforma los ecosistemas locales y sus problemáticas socioambientales en el eje de indagación científica de tus estudiantes, fomentando pertenencia e identidad territorial.",
      render3D: () => (
        <svg className="w-full h-full max-w-[390px] max-h-[350px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,40 240,95 140,150 40,95" fill="#34d399" stroke="#6ee7b7" strokeWidth="1.5" />
          <polygon points="40,95 140,150 140,225 40,170" fill="#059669" />
          <polygon points="140,150 240,95 240,170 140,225" fill="#047857" />
          <polygon points="105,62 160,92 140,150 110,133" fill="#38bdf8" />
          <polygon points="110,133 140,150 140,225 110,208" fill="#0284c7" />
          <rect x="72" y="65" width="8" height="20" fill="#78350f" />
          <polygon points="76,35 95,65 57,65" fill="#10b981" />
          <polygon points="76,48 91,72 61,72" fill="#059669" />
          <rect x="187" y="90" width="8" height="20" fill="#78350f" />
          <polygon points="191,60 210,90 172,90" fill="#10b981" />
          <polygon points="191,73 206,97 176,97" fill="#059669" />
          <g transform="translate(150, 105)">
            <rect x="0" y="0" width="22" height="22" fill="#f59e0b" stroke="#ea580c" strokeWidth="2.5" rx="3" />
            <line x1="11" y1="0" x2="11" y2="-20" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="11" cy="-23" r="5.5" fill="#ef4444" />
            <circle cx="11" cy="-23" r="14" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.6" className="animate-ping" />
          </g>
        </svg>
      )
    },
    {
      id: 1,
      name: "Maker",
      bgColor: "#ea580c", // 2. Naranja Terracota Marca
      title: "Sensores e instrumentos de bajo costo construibles en el aula",
      desc: "Dispositivos accesibles para medir pH, turbidez, temperatura y clima que los estudiantes arman y calibran con sus manos sin depender de presupuestos elevados.",
      render3D: () => (
        <svg className="w-full h-full max-w-[390px] max-h-[350px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,40 235,95 140,150 45,95" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1.5" />
          <polygon points="45,95 140,150 140,215 45,160" fill="#cbd5e1" />
          <polygon points="140,150 235,95 235,160 140,215" fill="#94a3b8" />
          <polygon points="140,65 195,95 140,125 85,95" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <text x="140" y="101" fontFamily="monospace" fontSize="14" fontWeight="800" fill="#4ade80" textAnchor="middle">pH: 7.2</text>
          <circle cx="185" cy="72" r="6" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M140,175 C140,225 160,235 200,235" stroke="#f59e0b" strokeWidth="8" fill="none" strokeLinecap="round" />
          <rect x="200" y="225" width="28" height="18" rx="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 2,
      name: "Currículum",
      bgColor: "#1d4ed8", // 3. Azul Cobalto
      title: "Secuencias de 4 clases con objetivos curriculares listos",
      desc: "Unidades didácticas completas alineadas a las bases curriculares oficiales de ciencias, con preguntas de indagación, hojas de terreno y rúbricas formativas.",
      render3D: () => (
        <svg className="w-full h-full max-w-[390px] max-h-[350px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,45 240,100 140,155 40,100" fill="#0a0047" stroke="#3b82f6" strokeWidth="2" />
          <polygon points="40,100 140,155 140,205 40,150" fill="#050024" />
          <polygon points="140,155 240,100 240,150 140,205" fill="#140066" />
          <polygon points="140,20 220,65 140,115 60,65" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
          <line x1="95" y1="62" x2="185" y2="62" stroke="#cbd5e1" strokeWidth="2.5" />
          <line x1="90" y1="75" x2="190" y2="75" stroke="#cbd5e1" strokeWidth="2.5" />
          <line x1="90" y1="88" x2="165" y2="88" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          <g transform="translate(190, 40)">
            <circle cx="0" cy="0" r="16" fill="#22c55e" stroke="#ffffff" strokeWidth="2.5" />
            <polyline points="-5,-1 -1,4 6,-5" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform="translate(50, 115) rotate(-28)">
            <rect x="0" y="0" width="10" height="52" rx="3" fill="#f97316" />
            <polygon points="0,52 10,52 5,62" fill="#78350f" />
          </g>
        </svg>
      )
    },
    {
      id: 3,
      name: "Comunidad",
      bgColor: "#c2410c", // 4. Naranja Ámbar Cálido
      title: "Los datos recopilados generan impacto real en el territorio",
      desc: "Los hallazgos de los estudiantes no quedan archivados: se entregan formalmente al Comité de Agua Potable Rural (APR), familias y escuela para la toma de decisiones.",
      render3D: () => (
        <svg className="w-full h-full max-w-[390px] max-h-[350px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,55 235,110 140,165 45,110" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="45,110 140,165 140,220 45,165" fill="#1d4ed8" />
          <polygon points="140,165 235,110 235,165 140,220" fill="#1e40af" />
          <polygon points="140,20 185,45 140,70 95,45" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="95,45 140,70 140,115 95,90" fill="#f59e0b" />
          <polygon points="140,70 185,45 185,90 140,115" fill="#d97706" />
          <circle cx="140,45" r="8" fill="#38bdf8" />
          <circle cx="78" cy="90" r="13" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
          <circle cx="202" cy="90" r="13" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <g transform="translate(75, 170)">
            <rect x="0" y="0" width="130" height="28" rx="8" fill="#0a0047" stroke="#f97316" strokeWidth="2" />
            <text x="65" y="19" fill="#ffffff" fontFamily="sans-serif" fontSize="11" fontWeight="800" textAnchor="middle">🤝 COMITÉ APR</text>
          </g>
        </svg>
      )
    }
  ];

  // Ciclo automático con barra de progreso
  useEffect(() => {
    if (isPaused) return;

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += tickInterval;
      setProgress((elapsed / durationPerStep) * 100);

      if (elapsed >= durationPerStep) {
        elapsed = 0;
        setCurrentStep((prev) => (prev + 1) % stages.length);
        setProgress(0);
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [isPaused, currentStep]);

  const activeStage = stages[currentStep];
  const titleWords = activeStage.title.split(" ");

  return (
    <section 
      id="como-funciona"
      className="relative overflow-hidden transition-colors duration-700 px-4 sm:px-8 lg:px-16 pt-12 sm:pt-14 pb-10 sm:pb-12 flex flex-col justify-between"
      style={{ backgroundColor: activeStage.bgColor }}
    >
      {/* Header Superior: Título & Timeline */}
      <div className="max-w-6xl mx-auto w-full relative z-20 mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/15 pb-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            ¿Cómo funciona AprendeLocal?
          </h2>

          {/* Timeline Minimalista con Círculos y Botón de Pausa Compacto */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold">
              {stages.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => {
                    setCurrentStep(idx);
                    setProgress(0);
                  }}
                  className={`flex items-center gap-2 transition cursor-pointer ${
                    idx === currentStep ? "text-white font-bold" : "text-white/50 hover:text-white font-normal"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full font-extrabold flex items-center justify-center text-xs transition ${
                    idx === currentStep 
                      ? "bg-white text-slate-950 shadow-md ring-4 ring-white/20 scale-105" 
                      : "bg-white/15 text-white"
                  }`}>
                    {`0${idx + 1}`}
                  </span>
                  <span className="hidden sm:inline">{stage.name}</span>
                </button>
              ))}
            </div>

            {/* Botón Play / Pause solo icono */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Reanudar" : "Pausar"}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer ml-1"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>
        </div>

        {/* Barra de Progreso Superior */}
        <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-orange-400 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Contenido Principal Compacto: Título + Descripción + 3D */}
      <div className="max-w-6xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-20 py-2 sm:py-4">
        
        {/* Lado Izquierdo: Título y Descripción Limpia */}
        <div className="lg:col-span-6 space-y-4 text-left">
          
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight flex flex-wrap items-center">
            {titleWords.map((word, wIdx) => (
              <span
                key={`${currentStep}-${wIdx}`}
                className="inline-block mr-2 sm:mr-2.5 transition-all duration-500 ease-out animate-fadeInUp"
                style={{
                  animationDelay: `${wIdx * 45}ms`,
                  animationFillMode: "both"
                }}
              >
                {word}
              </span>
            ))}
          </h3>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-lg transition-opacity duration-500">
            {activeStage.desc}
          </p>

        </div>

        {/* Lado Derecho: Modelo 3D Isométrico */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div className="w-full max-w-[420px] aspect-square flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center animate-bounce-slow">
              {activeStage.render3D()}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
