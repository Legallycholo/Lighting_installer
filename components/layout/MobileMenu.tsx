"use client";
import { useRef } from "react";
import Link from "next/link";
import { nav } from "@/content/home";
import { site, telHref } from "@/content/site";
import { shell } from "@/content/shell";
import styles from "./Layout.module.css";
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={ref}
      className={styles.menu}
      onKeyDown={(e) => {
        if (e.key === "Escape" && ref.current) {
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label={shell.mobileNavigation}>
        <span className={styles.menuLines} aria-hidden="true" />
        <span className="sr-only">{shell.menu}</span>
      </summary>
      <nav
        className={styles.menuPanel}
        aria-label={shell.mobileNavigation}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a") && ref.current)
            ref.current.open = false;
        }}
      >
        <Link className="btn btn-red" href="/christmas-light-quote">
          {site.cta.quote}
        </Link>
        {nav.links.map((link) => (
          <Link href={`/${link.hash}`} key={link.hash}>
            {link.label}
          </Link>
        ))}
        <a href={telHref(site.phone)}>{site.phone.display}</a>
      </nav>
    </details>
  );
}
