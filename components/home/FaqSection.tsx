import { faqItems, faqSection } from "@/content/faq";
import styles from "./Home.module.css";

export function FaqSection() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-heading">
      <div className="inner">
        <div className="s-head">
          <h2 id="faq-heading" className="h2">
            {faqSection.heading[0]}
            <em>{faqSection.heading[1]}</em>
          </h2>
          <p className="s-sub">{faqSection.sub}</p>
        </div>
        <div className={styles.faqList}>
          {faqItems.map((item, index) => (
            <details key={item.id} className={styles.faq} open={index === 0}>
              <summary>
                {item.question}
                <span className={styles.faqIcon} aria-hidden="true" />
              </summary>
              <div>
                {item.answer.map((part, i) =>
                  typeof part === "string" ? (
                    <span key={i}>{part}</span>
                  ) : (
                    <strong key={i}>{part.b}</strong>
                  ),
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
