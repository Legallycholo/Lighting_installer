import { reviews, reviewsSection } from "@/content/reviews";
import { site } from "@/content/site";
import { Star } from "./Shared";
import styles from "./Home.module.css";

function recordCopy(text: string) {
  return text
    .replaceAll("{homes}", site.stats.lastSeasonHomes)
    .replaceAll("{requests}", site.stats.lastSeasonRequests)
    .replaceAll("{hours}", String(site.stats.repairHours))
    .replaceAll("{sameDay}", site.stats.sameDayRate);
}

export function ReviewsSection() {
  const record = reviewsSection.record;
  return (
    <section id="reviews" className="section" aria-labelledby="reviews-heading">
      <div className="inner">
        <div className="s-head">
          <h2 id="reviews-heading" className="h2">
            {reviewsSection.heading[0]}
            <em>{reviewsSection.heading[1]}</em>
          </h2>
          <p className="s-sub">{reviewsSection.sub}</p>
        </div>
        <div className={styles.ledger}>
          <div className={styles.ledgerHead}>
            <div className={styles.rating}>
              <strong>{site.stats.rating}</strong>
              <span
                aria-label={`${site.stats.rating} ${reviewsSection.ratingLabel}`}
              >
                <span className={styles.stars} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} />
                  ))}
                </span>
                <span>{reviewsSection.ledgerMeta[0]}</span>
              </span>
            </div>
            <span className="label">{reviewsSection.ledgerMeta[1]}</span>
          </div>
          <div className={styles.reviewGrid}>
            {reviews.map((review, index) => (
              <figure
                key={index}
                className={`${styles.review} ${!review.featured ? styles.secondaryReview : ""}`}
              >
                <blockquote>
                  <h3>“{review.pull}”</h3>
                  <p>{review.text}</p>
                </blockquote>
                <figcaption>
                  <strong>{review.name}</strong>
                  <span>{review.attribution}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {site.reviewUrl && (
            <div className={styles.reviewLink}>
              <a
                href={site.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {reviewsSection.readAllLabel}
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          )}
        </div>
        <aside className={styles.record} aria-labelledby="record-heading">
          <h3 id="record-heading">{record.heading}</h3>
          <p>{recordCopy(record.paragraphs.intro)}</p>
          <div className={styles.recordMetrics}>
            <div>
              <strong>{site.stats.lastSeasonRequests}</strong>
              <span>{record.metrics.requests}</span>
            </div>
            <div>
              <strong>
                {site.stats.repairHours} {record.metrics.hours}
              </strong>
              <span>{record.metrics.response}</span>
            </div>
            <div>
              <strong>{site.stats.sameDayRate}</strong>
              <span>{record.metrics.sameDay}</span>
            </div>
          </div>
          <p>{record.paragraphs.why1}</p>
          <p>{recordCopy(record.paragraphs.why2)}</p>
          <p className={styles.recordLanding}>{record.paragraphs.landing}</p>
          <div className={styles.recordSignature}>
            <strong>{site.shortName}</strong>
            <span>{record.signatureNote}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
