"use client";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import styles from "./Home.module.css";

export function ProcessReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  // Content is fully visible before enhancement, including without JavaScript.
  return (
    <div className={styles.processGrid} ref={root}>
      {children}
    </div>
  );
}
