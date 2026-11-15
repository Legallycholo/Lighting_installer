import Link from "next/link";
import Image from "next/image";
import { nav } from "@/content/home";
import { site, telHref } from "@/content/site";
import { shell } from "@/content/shell";
import { PhoneIcon } from "@/components/ui/Icons";
import { HolidayLightStrand } from "@/components/decorative/HolidayLightStrand";
import { AnnouncementBar } from "./AnnouncementBar";
import { MobileMenu } from "./MobileMenu";
import styles from "./Layout.module.css";
export function SiteHeader() {
  return (
    <header>
      <AnnouncementBar />
      <div className={styles.header}>
        <Link
          href="/"
          aria-label={`${site.shortName} — ${shell.home}`}
          className={styles.brand}
        >
          <Image
            src={site.logo.src}
            width={64}
            height={64}
            alt={site.logo.alt}
            priority
          />
        </Link>
        <nav className={styles.desktopNav} aria-label={shell.navigation}>
          {nav.links.map((link) => (
            <Link href={`/${link.hash}`} key={link.hash}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <a
            className={styles.phone}
            href={telHref(site.phone)}
            aria-label={`${site.cta.call} ${site.phone.display}`}
          >
            <PhoneIcon />
            <span>{site.phone.display}</span>
          </a>
          <Link
            className={`btn btn-red ${styles.headerQuote}`}
            href="/christmas-light-quote"
          >
            {site.cta.quote}
          </Link>
          <MobileMenu />
        </div>
      </div>
      <HolidayLightStrand />
    </header>
  );
}
