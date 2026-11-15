"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";

type Media = {
  poster: string;
  sources: ReadonlyArray<{ src: string; type: string }>;
  width: number;
  height: number;
  ariaLabel: string;
  playLabel: string;
  pauseLabel: string;
  placeholderLabel: string;
};
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

export function HeroMedia({ media }: { media: Media }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userChoice = useRef<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || media.sources.length === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection })
      .connection;
    let visible = false;
    const update = () => {
      const canAutoplay =
        !reduced.matches &&
        !connection?.saveData &&
        !["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
      if (
        visible &&
        document.visibilityState === "visible" &&
        (userChoice.current === "play" ||
          (userChoice.current !== "pause" && canAutoplay))
      ) {
        void video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    connection?.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
      video.pause();
    };
  }, [media.sources]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userChoice.current = "play";
      void video.play().catch(() => setPlaying(false));
    } else {
      userChoice.current = "pause";
      video.pause();
    }
  };

  return (
    <div className={styles.mediaFrame}>
      {media.sources.length ? (
        <>
          <video
            ref={videoRef}
            width={media.width}
            height={media.height}
            poster={media.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={media.ariaLabel}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setPlaying(false)}
          >
            {media.sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
          <button
            type="button"
            onClick={toggle}
            className={styles.videoToggle}
            aria-label={playing ? media.pauseLabel : media.playLabel}
          >
            <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
            {playing ? media.pauseLabel : media.playLabel}
          </button>
        </>
      ) : (
        <>
          <Image
            src={media.poster}
            width={media.width}
            height={media.height}
            alt={media.ariaLabel}
            preload
            unoptimized
          />
          <span className={styles.mediaPlaceholder}>
            {media.placeholderLabel}
          </span>
        </>
      )}
    </div>
  );
}
