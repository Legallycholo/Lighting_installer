import { hero } from "@/content/home";
import { site, telHref } from "@/content/site";
import { HeroMedia } from "./HeroMedia";
import { Chain, Highlight, QuoteLink, Spark } from "./Shared";
import styles from "./Home.module.css";

export function Hero() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <Spark className={styles.heroSpark} />
            <Spark className={`${styles.heroSpark} ${styles.heroSparkInk}`} />
            <Spark className={`${styles.heroSpark} ${styles.heroSparkSmall}`} />
            <h1 id="hero-heading" className={styles.heroTitle}>
              {hero.headline.map((line, index) => (
                <span key={index}>
                  <Highlight text={line} />
                </span>
              ))}
            </h1>
            <p className={styles.heroSub}>{hero.sub}</p>
            <p className={styles.heroPromise}>
              <strong>{hero.guaranteeStrong}</strong> {hero.guaranteeRest}
            </p>
            <div className={styles.heroActions}>
              <QuoteLink className="btn-xl" id="hero-primary-cta" />
              <a
                className={`btn btn-cream ${styles.heroCall}`}
                href={telHref(site.phone)}
              >
                {site.cta.call} {site.phone.display}
              </a>
            </div>
            <ul className={styles.heroFine}>
              {hero.fine.map((item) => (
                <li key={item}>
                  <Spark />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.heroHung}>
            <div className={styles.heroBoard}>
              <HeroMedia media={hero.video} />
            </div>
            <div className={styles.guarantee}>
              <Chain className={styles.chainLeft} />
              <Chain className={styles.chainRight} />
              <strong>{hero.plaque.figure}</strong>
              <div>
                <span>{hero.plaque.label}</span>
                <p>{hero.plaque.text}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.proofStrip}>
        <ul>
          {hero.trust.map((item) => (
            <li key={item}>
              <Spark />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
