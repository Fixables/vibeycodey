interface LogoIconProps {
  size?: number;
  className?: string;
  /** bare=true renders only the leaf SVG with no background — for use on dark/green surfaces */
  bare?: boolean;
}

export function LogoIcon({ size = 36, className = '', bare = false }: LogoIconProps) {
  const leafSize = bare ? size : size * 0.62;
  const leaf = (
    <svg
      width={leafSize}
      height={leafSize}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 2C7.5 2 4 5 4.5 9.5C5 14 7.5 18 11 19C14.5 18 17 14 17.5 9.5C18 5 14.5 2 11 2Z"
        fill="white"
      />
      <path
        d="M11 19V15"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M11 5C11 5 9 9 10 13"
        stroke="#2C5F2E"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );

  if (bare) return leaf;

  return (
    <div
      className={`bg-[#2C5F2E] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#4A8C4F] transition-colors ${className}`}
      style={{ width: size, height: size }}
    >
      {leaf}
    </div>
  );
}
