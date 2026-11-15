import Link from "next/link";
import { site } from "@/content/site";

export type HighlightedText = { pre: string; em: string; post: string };

export function Highlight({ text }: { text: HighlightedText }) {
  return (
    <>
      {text.pre}
      {text.em && <em>{text.em}</em>}
      {text.post}
    </>
  );
}

export function QuoteLink({
  className = "",
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <Link
      href="/christmas-light-quote"
      className={`btn btn-red ${className}`}
      id={id}
    >
      {site.cta.quote}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg className={`star ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 3.1 6.3 7 1-5.05 4.9 1.2 6.9L12 17.8l-6.25 3.3 1.2-6.9L1.9 9.3l7-1Z" />
    </svg>
  );
}

export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg className={`spk ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 1 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
    </svg>
  );
}

export function Chain({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="48"
      viewBox="0 0 14 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {[0, 10, 20, 30].map((y) => (
        <rect key={y} x="3" y={y + 2} width="8" height="15" rx="4" />
      ))}
    </svg>
  );
}
