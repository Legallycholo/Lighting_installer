import { comparison } from "@/content/home";
import { Highlight, QuoteLink } from "./Shared";
import styles from "./Home.module.css";

export function ComparisonSection() {
  return (
    <section className="section" aria-labelledby="comparison-heading">
      <div className="inner">
        <div className="s-head">
          <h2 id="comparison-heading" className="h2">
            <Highlight text={comparison.heading} />
          </h2>
          <p className="s-sub">{comparison.sub}</p>
        </div>
        <div className={styles.comparisonGrid}>
          <article className={styles.negative}>
            <p className="label">{comparison.bad.label}</p>
            <h3>{comparison.bad.title}</h3>
            <ul>
              {comparison.bad.points.map((point) => (
                <li key={point}>
                  <span aria-hidden="true">×</span>
                  {point}
                </li>
              ))}
            </ul>
          </article>
          <span className={styles.instead}>{comparison.connector}</span>
          <article className={styles.positive}>
            <p className="label">{comparison.good.label}</p>
            <h3>{comparison.good.title}</h3>
            <ul>
              {comparison.good.stages.map((stage) => (
                <li key={stage.title}>
                  <span aria-hidden="true">✓</span>
                  <div>
                    <strong>{stage.title}</strong>
                    <p>{stage.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
        <div className={styles.sectionEnd}>
          <p>
            {comparison.close.text}
            <strong>{comparison.close.strong}</strong>
          </p>
          <QuoteLink />
        </div>
      </div>
    </section>
  );
}
