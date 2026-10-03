import type { Project } from "@/lib/projects";
import { projectMeta } from "@/lib/projects";
import styles from "./ui.module.css";

/**
 * A single work-sample tile: thumbnail, name, industry · service and — once
 * a case-study PDF has been uploaded for it in /admin — a link that opens
 * it in a new tab.
 *
 * Without a PDF the tile still shows the work rather than disappearing, but
 * it renders as plain markup instead of a link. A tile with nowhere to send
 * the click would be a dead link, which is worse than an unclickable one.
 *
 * Shared by the three grids that show project tiles (the projects index,
 * the homepage rail and the media-services proof strip) so the pdf-or-plain
 * decision, and the markup itself, exist in one place.
 */
export function ProjectTile({
  project,
  readLabel,
}: {
  project: Project;
  /** Shown next to the name only once there's a PDF to read. Omit entirely
   *  on grids — like media-services' proof strip — that never show it. */
  readLabel?: string;
}) {
  const body = (
    <>
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={project.name}
          className={`${styles.tileImg} ratio-4-3`}
          loading="lazy"
        />
      ) : (
        <div className="ratio-4-3" style={{ background: "var(--surface-alt)" }} />
      )}
      <div className={styles.workHover}>
        <div className={styles.workMeta}>{projectMeta(project)}</div>
        <div className={styles.workName}>{project.name}</div>
        {readLabel && project.pdf ? (
          <span className={styles.workView}>{readLabel}</span>
        ) : null}
      </div>
    </>
  );

  return project.pdf ? (
    <a
      href={project.pdf}
      target="_blank"
      rel="noreferrer noopener"
      className={styles.tile}
    >
      {body}
    </a>
  ) : (
    <div className={styles.tile}>{body}</div>
  );
}
