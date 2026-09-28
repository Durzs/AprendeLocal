import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

import { useTx } from "../../../shared/tx";

export default function HowItWorksSection() {
  const tx = useTx();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const durationPerStep = 4500; // 4.5s por etapa
  const tickInterval = 50;

  const stages = [
    {
      id: 0,
      name: tx("Territorio", "Território"),
      bgColor: "var(--tinta-950)", // el indigo de la marca
      title: tx("La clase empieza en el estero que está detrás de la cancha", "A aula começa no córrego que passa atrás da quadra"),
      desc: tx(
        "Dices qué hay a distancia de caminata de tu escuela y qué pasa ahí que en otra parte no pasaría igual. De eso sale el proyecto, no de un tema general.",
        "Você diz o que existe a uma caminhada da escola e o que acontece ali que em outro lugar não aconteceria igual. O projeto sai disso, não de um tema genérico."
      ),
      render3D: () => (
        <svg className="w-full h-full max-w-[420px] max-h-[380px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,40 240,95 140,150 40,95" fill="#34d399" stroke="#6ee7b7" strokeWidth="1.5" />
          <polygon points="40,95 140,150 140,225 40,170" fill="#10b981" />
          <polygon points="140,150 240,95 240,170 140,225" fill="#059669" />
          <polygon points="105,62 160,92 140,150 110,133" fill="#cfcaec" />
          <polygon points="110,133 140,150 140,225 110,208" fill="#7a6cd0" />
          <rect x="72" y="65" width="8" height="20" fill="#623218" />
          <polygon points="76,35 95,65 57,65" fill="#10b981" />
          <polygon points="76,48 91,72 61,72" fill="#059669" />
          <rect x="187" y="90" width="8" height="20" fill="#623218" />
          <polygon points="191,60 210,90 172,90" fill="#10b981" />
          <polygon points="191,73 206,97 176,97" fill="#059669" />
          <g transform="translate(150, 105)">
            <rect x="0" y="0" width="22" height="22" fill="#e2976f" stroke="#b8561f" strokeWidth="2.5" rx="3" />
            <line x1="11" y1="0" x2="11" y2="-20" stroke="#c9612a" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="11" cy="-23" r="5.5" fill="#c9612a" />
            <circle cx="11" cy="-23" r="14" stroke="#c9612a" strokeWidth="2" fill="none" opacity="0.6" className="animate-ping" />
          </g>
        </svg>
      )
    },
    {
      id: 1,
      name: tx("Terreno", "Campo"),
      bgColor: "#c9612a", // la terracota del logotipo, no el naranjo de botones
      title: tx("Se mide con una huincha, un palo y un reloj", "Mede-se com uma trena, um cabo de vassoura e um relógio"),
      desc: tx(
        "El curso sale, anota en la hoja de terreno y vuelve con números. Nada que haya que comprar: lo que hace falta está en la escuela o en una casa.",
        "A turma sai, anota na ficha de campo e volta com números. Nada que precise ser comprado: o que falta está na escola ou em casa."
      ),
      render3D: () => (
        <svg className="w-full h-full max-w-[420px] max-h-[380px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,40 235,95 140,150 45,95" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1.5" />
          <polygon points="45,95 140,150 140,215 45,160" fill="#cbd5e1" />
          <polygon points="140,150 235,95 235,160 140,215" fill="#94a3b8" />
          {/* Un cuaderno de terreno abierto y una huincha, que es con lo que
              se mide de verdad. Antes aquí había una caja de sensor con sonda
              de pH: la escuela rural no la tiene y la aplicación no la usa. */}
          <polygon points="140,62 200,95 140,128 80,95" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="140" y1="62" x2="140" y2="128" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="112" y1="86" x2="133" y2="98" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="104" y1="93" x2="126" y2="105" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="152" y1="98" x2="174" y2="86" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="160" y1="105" x2="180" y2="94" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path d="M112,183 C150,203 175,215 214,231" stroke="#e2976f" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M124,189 L124,196 M142,199 L142,206 M160,208 L160,215 M178,216 L178,223" stroke="#623218" strokeWidth="2" strokeLinecap="round" />
          <circle cx="106" cy="180" r="9" fill="var(--tinta-400)" stroke="var(--tinta-600)" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 2,
      name: tx("Currículum", "Currículo"),
      bgColor: "var(--tinta-800)",
      title: tx("Marcas los objetivos que te toca pasar y el proyecto sale de ahí", "Você marca as habilidades da BNCC que precisa trabalhar e o projeto sai daí"),
      desc: tx(
        "Los de las seis asignaturas, de 5º a 8º, en una lista. Cada problemática te dice cuáles abre y desde qué asignatura, y de ahí salen los indicadores con que se evalúa.",
        "As de seis componentes, do 6º ao 9º ano, numa lista só. Cada problemática mostra quais ela abre e por qual componente, e daí saem os indicadores de avaliação."
      ),
      render3D: () => (
        <svg className="w-full h-full max-w-[420px] max-h-[380px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,45 240,100 140,155 40,100" fill="var(--tinta-950)" stroke="var(--tinta-600)" strokeWidth="2" />
          <polygon points="40,100 140,155 140,205 40,150" fill="#050024" />
          <polygon points="140,155 240,100 240,150 140,205" fill="var(--tinta-800)" />
          <polygon points="140,20 220,65 140,115 60,65" fill="#ffffff" stroke="var(--tinta-600)" strokeWidth="2.5" />
          <line x1="95" y1="62" x2="185" y2="62" stroke="#cbd5e1" strokeWidth="2.5" />
          <line x1="90" y1="75" x2="190" y2="75" stroke="#cbd5e1" strokeWidth="2.5" />
          <line x1="90" y1="88" x2="165" y2="88" stroke="#c9612a" strokeWidth="3.5" strokeLinecap="round" />
          <g transform="translate(190, 40)">
            <circle cx="0" cy="0" r="16" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            <polyline points="-5,-1 -1,4 6,-5" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform="translate(50, 115) rotate(-28)">
            <rect x="0" y="0" width="10" height="52" rx="3" fill="#c9612a" />
            <polygon points="0,52 10,52 5,62" fill="#623218" />
          </g>
        </svg>
      )
    },
    {
      id: 3,
      name: tx("Comunidad", "Comunidade"),
      // El verde del logotipo, que es el color de esta etapa: la comunidad.
      // Antes valia ademas para entregarle el color a la seccion del
      // territorio, que iba en ese mismo verde a sangre; ahora esa seccion es
      // clara, asi que el verde se queda aqui por lo que significa y no por
      // lo que empalma.
      bgColor: "#1e2a24",
      title: tx("El curso le entrega lo que averiguó a alguien que lo esperaba", "A turma entrega o que descobriu a alguém que estava esperando"),
      desc: tx(
        "A quién se lo entregan lo escribes tú, porque eres el único que sabe quién es. Sin alguien de afuera esperándolo, el trabajo se queda en la mochila.",
        "Para quem vai a entrega, quem escreve é você, porque só você sabe quem é. Sem alguém de fora esperando, o trabalho fica na mochila."
      ),
      render3D: () => (
        <svg className="w-full h-full max-w-[420px] max-h-[380px] drop-shadow-2xl transition-transform duration-500 hover:scale-105" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,55 235,110 140,165 45,110" fill="var(--tinta-600)" stroke="var(--tinta-400)" strokeWidth="1.5" />
          <polygon points="45,110 140,165 140,220 45,165" fill="var(--tinta-800)" />
          <polygon points="140,165 235,110 235,165 140,220" fill="var(--tinta-800)" />
          <polygon points="140,20 185,45 140,70 95,45" fill="#e7b59a" stroke="#e2976f" strokeWidth="2" />
          <polygon points="95,45 140,70 140,115 95,90" fill="#e2976f" />
          <polygon points="140,70 185,45 185,90 140,115" fill="#b8561f" />
          <circle cx="140" cy="45" r="8" fill="var(--tinta-400)" />
          <circle cx="78" cy="90" r="13" fill="#c9612a" stroke="#ffffff" strokeWidth="2" />
          <circle cx="202" cy="90" r="13" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <g transform="translate(75, 170)">
            <rect x="0" y="0" width="130" height="28" rx="8" fill="var(--tinta-950)" stroke="#c9612a" strokeWidth="2" />
            {/* Decía «COMITÉ APR». Ese destinatario no lo pone la plataforma: lo
                escribe el docente, porque es el único que sabe quién recibe el
                trabajo en su comunidad. */}
            <text x="65" y="19" fill="#ffffff" fontFamily="sans-serif" fontSize="11" fontWeight="800" textAnchor="middle">{tx("🤝 LO ESCRIBES TÚ", "🤝 VOCÊ ESCREVE")}</text>
          </g>
        </svg>
      )
    }
  ];

  // Observador de intersección: Solo inicia y resetea a Paso 1 cuando el usuario llega a la sección
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentStep(0);
          setProgress(0);
          setIsInView(true);
        } else {
          setIsInView(false);
          setProgress(0);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Ciclo automático con barra de progreso cuando está a la vista y no pausado
  useEffect(() => {
    if (!isInView || isPaused) return;

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
  }, [isInView, isPaused, currentStep]);

  const activeStage = stages[currentStep];
  const titleWords = activeStage.title.split(" ");

  return (
    <section 
      ref={sectionRef}
      id="como-funciona"
      className="relative overflow-hidden transition-colors duration-700 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-14 flex flex-col justify-between"
      style={{ backgroundColor: activeStage.bgColor }}
    >
      {/* Header Superior: Título & Timeline */}
      <div className="max-w-7xl mx-auto w-full relative z-20 mb-6 sm:mb-8">
        {/* La misma franja de anotación con la que abren la portada y el
            territorio. Es lo que hace que las cinco secciones se lean como un
            solo documento y no como cinco páginas pegadas. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-5">
          <span className="rotulo text-tierra-300">{tx("Cómo funciona", "Como funciona")}</span>
          <span className="rotulo text-white/40">
            Etapa {String(currentStep + 1).padStart(2, "0")} de{" "}
            {String(stages.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/15 pb-4">
          <h2 className="display text-3xl text-white sm:text-4xl md:text-5xl [text-wrap:balance]">
            {tx("¿Cómo funciona AprendeLocal?", "Como funciona o AprendeLocal?")}
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
                  <span className={`cifra w-7 h-7 rounded-full font-semibold flex items-center justify-center text-xs transition ${
                    idx === currentStep 
                      ? "bg-white text-texto shadow-md ring-4 ring-white/20 scale-105" 
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
              aria-label={isPaused ? tx("Reanudar", "Retomar") : tx("Pausar", "Pausar")}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer ml-1"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>
        </div>

        {/* Barra de Progreso Superior */}
        <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-tierra-400 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Contenido Principal Compacto: Título + Descripción + 3D */}
      <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-20 py-2 sm:py-4">
        
        {/* Lado Izquierdo: Título y Descripción Limpia */}
        <div className="lg:col-span-6 space-y-4 text-left">
          
          {/* Iba en `extrabold` con `tracking-tight`, justo debajo de un h2 en
              `semibold` con -0.055em: dos maneras distintas de componer un
              titular, a dos centímetros una de otra. Ahora las dos son la
              misma, y la jerarquía la da el tamaño. */}
          <h3 className="display text-2xl sm:text-3xl lg:text-4xl leading-[1.08] text-white flex flex-wrap items-center">
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

          <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl transition-opacity duration-500">
            {activeStage.desc}
          </p>

        </div>

        {/* Lado Derecho: Modelo 3D Isométrico */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div className="w-full max-w-[440px] aspect-square flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center animate-bounce-slow">
              {activeStage.render3D()}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
