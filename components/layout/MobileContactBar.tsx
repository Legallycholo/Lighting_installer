"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site, telHref, smsHref } from "@/content/site";
import { shell } from "@/content/shell";
import { PhoneIcon, TextIcon } from "@/components/ui/Icons";
import styles from "./Layout.module.css";
export function MobileContactBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let heroVisible = pathname === "/";
    let footerVisible = false;
    const update = () =>
      setVisible(
        !heroVisible && !footerVisible && pathname !== "/christmas-light-quote",
      );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.id === "hero-primary-cta")
          heroVisible = entry.isIntersecting;
        if (entry.target.id === "site-footer")
          footerVisible = entry.isIntersecting;
      }
      update();
    });
    const hero = document.getElementById("hero-primary-cta");
    const footer = document.getElementById("site-footer");
    if (hero) observer.observe(hero);
    if (footer) observer.observe(footer);
    const timer = window.setTimeout(update, 0);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);
  return (
    <nav
      aria-label={shell.contactBar}
      aria-hidden={!visible}
      inert={!visible}
      className={`${styles.contactBar} ${visible ? styles.contactVisible : ""}`}
    >
      <a href={telHref(site.phone)}>
        <PhoneIcon />
        {site.cta.call}
      </a>
      <a href={smsHref(site.smsPhone)}>
        <TextIcon />
        {site.cta.text}
      </a>
    </nav>
  );
}
