import Image from "next/image";
import { gallery } from "@/content/home";
import { areasFootnote, featuredAreas } from "@/content/service-areas";
import { Highlight } from "./Shared";
import styles from "./Home.module.css";

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="section ink"
      aria-labelledby="gallery-heading"
    >
      <div className="inner">
        <div className="s-head">
          <h2 id="gallery-heading" className="h2">
            <Highlight text={gallery.heading} />
          </h2>
          <p className="s-sub">{gallery.sub}</p>
        </div>
        <div className={styles.galleryGrid}>
          {gallery.items.map((item, index) => (
            <figure
              className={`${styles.photo} ${styles[`photo${index + 1}`]}`}
              key={item.src}
            >
              <Image
                src={item.src}
                width={item.width}
                height={item.height}
                alt={item.alt}
                loading="lazy"
                unoptimized
              />
              <figcaption>{item.location}</figcaption>
            </figure>
          ))}
        </div>
        <p className={styles.galleryClaim}>
          {gallery.claim.text}
          <strong>{gallery.claim.strong}</strong>
        </p>
        <dl className={styles.stats}>
          {gallery.stats.map((stat) => (
            <div key={stat.l}>
              <dt>{stat.l}</dt>
              <dd>{stat.n}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.serviceAreas}>
          <p className="label">{gallery.areasLabel}</p>
          <ul>
            {featuredAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <p>{areasFootnote}</p>
        </div>
      </div>
    </section>
  );
}
