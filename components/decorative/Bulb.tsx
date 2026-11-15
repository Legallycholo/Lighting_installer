import type { CSSProperties } from "react";

export function Bulb({
  color = "var(--gold)",
  className = "",
  style,
}: {
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      style={{ color, ...style }}
      viewBox="0 0 16 26"
      fill="none"
    >
      <path
        d="M5.11 0.95H10.89A1.25 1.25 0 0 1 12.15 2.2V4.52A1.25 1.25 0 0 1 10.89 5.77H5.11A1.25 1.25 0 0 1 3.85 4.52V2.2A1.25 1.25 0 0 1 5.11 0.95Z"
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="1.4"
      />
      <path
        d="M8 6.5C13 6.5 14.1 9.46 14.1 13.55C14.1 18.15 10.7 23.78 9.34 24.63Q8 25.47 6.66 24.63C5.3 23.78 1.9 18.15 1.9 13.55C1.9 9.46 3 6.5 8 6.5Z"
        fill="currentColor"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M11.29 16.7Q10.41 19.76 9.04 22.82"
        stroke={color === "var(--cream)" ? "#243b3580" : "var(--cream)"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
