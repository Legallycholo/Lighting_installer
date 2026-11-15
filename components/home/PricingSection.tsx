import type { CSSProperties } from "react";
import { pricing } from "@/content/home";
import { QuoteLink, Spark } from "./Shared";
import styles from "./Home.module.css";
const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export function PricingSection() {
  return (
    <section className="section cream" aria-labelledby="pricing-heading">
      <div className="inner">
        <div className="s-head">
          <h2 id="pricing-heading" className="h2">
            {pricing.heading}
          </h2>
          <p className="s-sub">{pricing.sub}</p>
        </div>
        <div className={styles.pricingMain}>
          <p className={styles.price}>
            {money(pricing.low)}
            <span>–</span>
            {money(pricing.high)}
          </p>
          <p className="label">{pricing.seasonLabel}</p>
          <div
            className={styles.gauge}
            style={
              {
                "--fill-start": `${pricing.gauge.fillStart}%`,
                "--fill-width": `${pricing.gauge.fillWidth}%`,
                "--most-at": `${pricing.gauge.mostAt}%`,
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <span className={styles.mostLabel}>{pricing.gauge.mostLabel}</span>
            <div className={styles.gaugeTrack}>
              <span />
            </div>
            <div className={styles.gaugeLabels}>
              <span>{money(pricing.low)}</span>
              <span>{money(pricing.high)}</span>
              <span>{pricing.gauge.tail}</span>
            </div>
          </div>
          <p className={styles.typical}>
            {pricing.typical.pre}
            <strong>{money(pricing.typical.typical)}</strong>
            {pricing.typical.mid}
            {money(pricing.typical.estate)}
            {pricing.typical.post}
          </p>
          <article className={styles.value}>
            <Spark />
            <p className="label">{pricing.value.label}</p>
            <h3>{pricing.value.title}</h3>
            <p>
              {pricing.value.text.pre}
              <strong>{pricing.value.text.strong}</strong>
              {pricing.value.text.post}
            </p>
          </article>
          <QuoteLink />
        </div>
      </div>
    </section>
  );
}
