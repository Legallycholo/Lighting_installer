import { Bulb } from "@/components/decorative/Bulb";
import { quoteSteps, wizardUI } from "@/content/quote";
import styles from "./QuoteWizard.module.css";

export function QuoteProgressStrand({
  step,
  started,
  success,
}: {
  step: number;
  started: boolean;
  success: boolean;
}) {
  return (
    <ol className={styles.progress} aria-label={wizardUI.progressLabel}>
      {quoteSteps.map((label, index) => (
        <li
          key={label}
          aria-current={
            started && !success && step === index ? "step" : undefined
          }
          data-lit={success || (started && index < step)}
        >
          <Bulb
            color={
              success || (started && index < step)
                ? "var(--gold)"
                : "var(--teal)"
            }
            className={styles.progressBulb}
          />
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
