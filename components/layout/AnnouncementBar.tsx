import { site } from "@/content/site";
import styles from "./Layout.module.css";
export function AnnouncementBar() {
  return (
    <div className={styles.announcement}>
      <strong>{site.season.announcementLead}</strong>
      <span className={styles.announcementTail}>
        {" "}
        {site.season.announcementTail}
      </span>
    </div>
  );
}
