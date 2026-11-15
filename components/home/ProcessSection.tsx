import { process } from "@/content/home";
import type { CSSProperties } from "react";
import { Chain, Highlight, QuoteLink } from "./Shared";
import { ProcessReveal } from "./ProcessReveal";
import styles from "./Home.module.css";

export function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="section cream"
      aria-labelledby="process-heading"
    >
      <div className="inner">
        <div className="s-head">
          <h2 id="process-heading" className="h2">
            <Highlight text={process.heading} />
          </h2>
          <p className="s-sub">{process.sub}</p>
        </div>
        <ProcessReveal>
          {process.steps.map((step, index) => (
            <article
              className={styles.processCard}
              key={step.title}
              style={{ "--step": index } as CSSProperties}
            >
              <Chain className={styles.processChainLeft} />
              <Chain className={styles.processChainRight} />
              <span className={styles.stepNumber} aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className={styles.processTag}>{step.tag}</span>
            </article>
          ))}
        </ProcessReveal>
        <div className={styles.sectionEnd}>
          <QuoteLink />
        </div>
      </div>
    </section>
  );
}
