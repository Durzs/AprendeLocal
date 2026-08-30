interface LogoProps {
  className?: string;
  /** 'horizontal' para la barra de navegación o 'stacked' para acceso/portada */
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
        viewBox="0 0 270 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="AprendeLocal"
        role="img"
      >
        {/* 'aprende' */}
        <text
          x="0"
          y="30"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Montserrat', sans-serif"
          fontSize="33"
          fontWeight="800"
          letterSpacing="-0.03em"
          fill={textColor}
        >
          aprende
        </text>

        {/* 'l' */}
        <text
          x="142"
          y="30"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Montserrat', sans-serif"
          fontSize="33"
          fontWeight="800"
          letterSpacing="-0.03em"
          fill={textColor}
        >
          l
        </text>

        {/* 'o' como icono de diana concéntrica con simetría geométrica */}
        <g transform="translate(167, 20.5)">
          {/* Anillo exterior */}
          <circle cx="0" cy="0" r="11.5" stroke={textColor} strokeWidth="2.8" fill="none" />
          {/* Anillo medio verde bosque */}
          <circle cx="0" cy="0" r="8" fill="#7a9785" />
          {/* Núcleo terracota */}
          <circle cx="0" cy="0" r="4.5" fill="#cc6138" />
          {/* Centro blanco */}
          <circle cx="0" cy="0" r="1.6" fill="#ffffff" />
        </g>

        {/* 'cal' */}
        <text
          x="185"
          y="30"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Montserrat', sans-serif"
          fontSize="33"
          fontWeight="800"
          letterSpacing="-0.03em"
          fill={textColor}
        >
          cal
        </text>
      </svg>
    );
  }

  // Layout apilado con alineación y espaciado simétrico
  return (
    <svg
      viewBox="0 0 170 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AprendeLocal"
      role="img"
    >
      {/* Línea 1: 'aprende' */}
      <text
        x="0"
        y="38"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Montserrat', sans-serif"
        fontSize="42"
        fontWeight="800"
        letterSpacing="-0.035em"
        fill={textColor}
      >
        aprende
      </text>

      {/* Línea 2: 'l' */}
      <text
        x="0"
        y="88"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Montserrat', sans-serif"
        fontSize="42"
        fontWeight="800"
        letterSpacing="-0.035em"
        fill={textColor}
      >
        l
      </text>

      {/* 'o' concéntrica */}
      <g transform="translate(31, 76)">
        {/* Anillo exterior */}
        <circle cx="0" cy="0" r="15" stroke={textColor} strokeWidth="3.4" fill="none" />
        {/* Anillo medio verde bosque */}
        <circle cx="0" cy="0" r="10.5" fill="#7a9785" />
        {/* Núcleo terracota */}
        <circle cx="0" cy="0" r="5.8" fill="#cc6138" />
        {/* Centro blanco */}
        <circle cx="0" cy="0" r="2" fill="#ffffff" />
      </g>

      {/* 'cal' */}
      <text
        x="54"
        y="88"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Montserrat', sans-serif"
        fontSize="42"
        fontWeight="800"
        letterSpacing="-0.035em"
        fill={textColor}
      >
        cal
      </text>
    </svg>
  );
}
