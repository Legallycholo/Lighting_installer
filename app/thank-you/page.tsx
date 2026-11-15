import Link from "next/link";
import { thankYou } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import styles from "../support.module.css";

export const metadata = {
  ...pageMetadata(thankYou.title, thankYou.description, "/thank-you"),
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  const live =
    process.env.LEAD_MODE === "live" &&
    process.env.CONTENT_APPROVED === "true" &&
    Boolean(process.env.LEAD_WEBHOOK_URL);
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`content-main ${styles.page}`}
    >
      <div className={`board board-hung ${styles.board}`}>
        <span className="label label-lead">{thankYou.eyebrow}</span>
        <h1>{thankYou.title}</h1>
        <p>{thankYou.body}</p>
        {!live && <p className={styles.notice}>{thankYou.demo}</p>}
        <div className={styles.actions}>
          <Link className="btn btn-red" href="/christmas-light-quote">
            {thankYou.quote}
          </Link>
          <Link className="btn btn-cream" href="/">
            {thankYou.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
