interface LogoProps {
  className?: string;
  /** 'horizontal' para la barra de navegación (header) o 'stacked' (apilado) */
  layout?: "horizontal" | "stacked";
  /** Color del texto: 'currentColor', '#ffffff' o tono personalizado */
  textColor?: string;
}

export default function AprendeLocalLogo({
  className = "h-8 w-auto",
  layout = "horizontal",
  textColor = "currentColor",
}: LogoProps) {
  if (layout === "horizontal") {
    return (
      <svg
        viewBox="0 0 300 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="AprendeLocal"
        role="img"
      >
        {/* 'aprende' */}
        <text
          x="0"
          y="36"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif"
          fontSize="36"
          fontWeight="800"
          letterSpacing="-0.035em"
          fill={textColor}
        >
          aprende
        </text>

        {/* 'l' */}
        <text
          x="154"
          y="36"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif"
          fontSize="36"
          fontWeight="800"
          letterSpacing="-0.035em"
          fill={textColor}
        >
          l
        </text>

        {/* 'o' como icono de diana concéntrica */}
        <g transform="translate(178, 25)">
          {/* Anillo exterior blanco / tono texto */}
          <circle cx="0" cy="0" r="13" stroke={textColor} strokeWidth="3" fill="none" />
          {/* Anillo medio verde bosque */}
          <circle cx="0" cy="0" r="9" fill="#7a9785" />
          {/* Núcleo terracota */}
          <circle cx="0" cy="0" r="5" fill="#cc6138" />
          {/* Centro blanco sutil */}
          <circle cx="0" cy="0" r="1.8" fill="#ffffff" />
        </g>

        {/* 'cal' */}
        <text
          x="198"
          y="36"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif"
          fontSize="36"
          fontWeight="800"
          letterSpacing="-0.035em"
          fill={textColor}
        >
          cal
        </text>
      </svg>
    );
  }

  // Layout apilado (2 líneas) para pantallas de inicio/login
  return (
    <svg
      viewBox="0 0 190 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AprendeLocal"
      role="img"
    >
      {/* Línea 1: 'aprende' */}
      <text
        x="0"
        y="42"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif"
        fontSize="46"
        fontWeight="800"
        letterSpacing="-0.04em"
        fill={textColor}
      >
        aprende
      </text>

      {/* Línea 2: 'l' */}
      <text
        x="0"
        y="98"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif"
        fontSize="46"
        fontWeight="800"
        letterSpacing="-0.04em"
        fill={textColor}
      >
        l
      </text>

      {/* 'o' concéntrica */}
      <g transform="translate(32, 84)">
        {/* Anillo exterior */}
        <circle cx="0" cy="0" r="17" stroke={textColor} strokeWidth="3.8" fill="none" />
        {/* Anillo medio verde bosque */}
        <circle cx="0" cy="0" r="12" fill="#7a9785" />
        {/* Núcleo terracota */}
        <circle cx="0" cy="0" r="6.5" fill="#cc6138" />
        {/* Centro blanco */}
        <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
      </g>

      {/* 'cal' */}
      <text
        x="58"
        y="98"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif"
        fontSize="46"
        fontWeight="800"
        letterSpacing="-0.04em"
        fill={textColor}
      >
        cal
      </text>
    </svg>
  );
}
