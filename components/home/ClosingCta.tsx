import { closing } from "@/content/home";
import { site, telHref } from "@/content/site";
import { Highlight, QuoteLink, Spark } from "./Shared";
import styles from "./Home.module.css";

export function ClosingCta() {
  return (
    <section
      className={`section ink ${styles.closing}`}
      aria-labelledby="closing-heading"
    >
      <div className="inner">
        <p className="label">{closing.eyebrow}</p>
        <h2 id="closing-heading" className="h2">
          <Highlight text={closing.heading} />
        </h2>
        <p className="s-sub">{closing.sub}</p>
        <div className={styles.closingActions}>
          <QuoteLink className="btn-xl" />
          <a href={telHref(site.phone)}>
            {closing.callPrefix}
            <strong>{site.phone.display}</strong>
          </a>
        </div>
        <ul className={styles.closingProof}>
          {closing.proof.map((item, index) => (
            <li key={index}>
              <Spark />
              {item.pre}
              <strong>{item.b}</strong>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
