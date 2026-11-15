export function HangingChain({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="14"
      height="48"
      viewBox="0 0 14 48"
      fill="none"
      stroke="var(--ink)"
      strokeWidth="2.2"
    >
      {[0, 10, 20, 30].map((y) => (
        <rect
          key={y}
          x="3"
          y={y + 1}
          width="8"
          height="16"
          rx="4"
          fill="var(--cream)"
        />
      ))}
    </svg>
  );
}
