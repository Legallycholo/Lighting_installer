import Link from "next/link";
import { privacy } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import styles from "../support.module.css";

export const metadata = pageMetadata(
  privacy.title,
  privacy.description,
  "/privacy-policy",
);

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`content-main ${styles.page}`}
    >
      <article className={`board ${styles.board}`}>
        <span className="label label-lead">{privacy.eyebrow}</span>
        <h1>{privacy.title}</h1>
        <p className={styles.notice}>{privacy.intro}</p>
        {privacy.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <div className={styles.actions}>
          <Link className="btn btn-cream" href="/">
            {privacy.home}
          </Link>
        </div>
      </article>
    </main>
  );
}
