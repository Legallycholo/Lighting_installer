import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { quoteContent } from "@/content/quote";
import { site, telHref, smsHref } from "@/content/site";
import styles from "@/components/quote/QuoteWizard.module.css";

export const metadata: Metadata = {
  title: quoteContent.seo.title,
  description: quoteContent.seo.description,
  alternates: { canonical: "/christmas-light-quote" },
};

export default function QuotePage() {
  const { heading, proof } = quoteContent.mast;
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <header className={styles.mast}>
        <h1>
          {heading.pre}
          <em>{heading.em}</em>
          {heading.post}
        </h1>
        <ul className={styles.proof}>
          {proof.map((item) => (
            <li key={item.text}>
              <span aria-hidden="true">✦</span> <strong>{item.b}</strong>
              {item.text}
            </li>
          ))}
        </ul>
      </header>
      <noscript>
        <div className={styles.noscript}>
          <p>
            {quoteContent.noscript.pre}
            <a href={telHref(site.phone)}>{site.phone.display}</a>
            {quoteContent.noscript.post}
          </p>
          <a href={smsHref(site.smsPhone)}>
            {site.cta.text} {site.smsPhone.display}
          </a>
        </div>
        <style>{`.quote-interactive { display: none !important; }`}</style>
      </noscript>
      <QuoteWizard />
    </main>
  );
}
