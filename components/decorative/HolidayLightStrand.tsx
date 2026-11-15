import type { CSSProperties } from "react";
import { Bulb } from "./Bulb";
import styles from "./HolidayLightStrand.module.css";

const colors = [
  ["gold", "red", "cream", "gold", "gold", "red"],
  ["cream", "gold", "gold", "red", "cream", "gold"],
];
const x = [8.3, 25, 41.7, 58.3, 75, 91.7];
const y = [13.2, 21.4, 25.5, 25.5, 21.4, 13.2];

export function HolidayLightStrand() {
  return (
    <div
      className={styles.strand}
      aria-hidden="true"
      data-testid="header-strand"
    >
      {[0, 1, 2, 3].map((segment) => (
        <div className={styles.segment} key={segment}>
          <svg
            className={styles.wire}
            viewBox="0 0 100 44"
            preserveAspectRatio="none"
          >
            <path
              d="M0,3 Q50,40 100,3"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {colors[segment % 2].map((color, index) => (
            <Bulb
              key={index}
              color={`var(--${color})`}
              className={styles.bulb}
              style={
                {
                  left: `${x[index]}%`,
                  top: `${y[index]}px`,
                  "--delay": `${(segment * 6 + index) * 55}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
