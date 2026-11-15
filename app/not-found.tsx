import Link from "next/link";
import { notFound } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import styles from "./support.module.css";

export const metadata = {
  ...pageMetadata(notFound.title, notFound.description, "/404"),
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`content-main ${styles.page}`}
    >
      <div className={`board ${styles.board}`}>
        <span className="label label-lead">{notFound.eyebrow}</span>
        <h1>{notFound.title}</h1>
        <p>{notFound.body}</p>
        <div className={styles.actions}>
          <Link className="btn btn-red" href="/">
            {notFound.home}
          </Link>
          <Link className="btn btn-cream" href="/christmas-light-quote">
            {notFound.quote}
          </Link>
        </div>
      </div>
    </main>
  );
}
