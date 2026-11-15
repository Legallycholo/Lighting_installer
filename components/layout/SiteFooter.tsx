import Image from "next/image";
import Link from "next/link";
import { footer } from "@/content/home";
import { site, telHref } from "@/content/site";
import { featuredAreas } from "@/content/service-areas";
import { shell } from "@/content/shell";
import styles from "./Layout.module.css";
export function SiteFooter() {
  return (
    <footer className={styles.footer} id="site-footer">
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <Link className={styles.footerWordmark} href="/">
            <Image src={site.logo.src} alt="" width={64} height={64} />
            <span>
              {site.wordmark[0]}
              <small>{site.wordmark[1]}</small>
            </span>
          </Link>
          <p>{footer.blurb}</p>
          <div className={styles.socials}>
            {Object.entries(site.social)
              .filter(([, url]) => url)
              .map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  aria-label={shell.social[name as keyof typeof shell.social]}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {name === "instagram" ? "◎" : "f"}
                </a>
              ))}
          </div>
        </div>
        <div>
          <h2>{footer.contactLabel}</h2>
          <a className={styles.footerPhone} href={telHref(site.phone)}>
            {site.phone.display}
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p>
            {site.hours.daysLabel}
            <br />
            {site.hours.timeLabel}
          </p>
          <address>
            {site.address.street}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode}
          </address>
        </div>
        <div>
          <h2>{footer.exploreLabel}</h2>
          {footer.explore
            .filter((link) => link.href)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
        </div>
        <div>
          <h2>{footer.areasLabel}</h2>
          <p>{featuredAreas.join(" · ")}</p>
          <Link className={styles.footerZip} href="/christmas-light-quote">
            {footer.zipCheck}
          </Link>
        </div>
      </div>
      <div className={styles.legal}>
        <p>
          © {site.season.year} {site.legal.copyrightHolder}. {shell.copyright}
        </p>
        <p>
          {site.legal.licenseLine} {site.altLine}
        </p>
        <p>{shell.footerNote}</p>
      </div>
    </footer>
  );
}
