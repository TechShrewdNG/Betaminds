import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSubmission,
  orderedEntries,
  fieldLabel,
  displaySchema,
  KIND_LABEL,
  STATUSES,
  type SubmissionKind,
} from "@/lib/submissions";
import { setSubmissionStatus, deleteSubmission } from "@/app/admin/actions";
import { SubmissionNotes } from "@/components/admin/SubmissionNotes";

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  // Field order and labels come from the current form definition, so renaming a
  // question in the CMS renames it here too.
  const { order, labels } = await displaySchema(submission.kind);
  const entries = orderedEntries(submission.data, order);
  const label = KIND_LABEL[submission.kind as SubmissionKind] ?? submission.kind;

  return (
    <>
      <div className="a-head">
        <div>
          <Link href="/admin/submissions" className="a-btn a-btn--ghost a-btn--sm">
            ← All submissions
          </Link>
          <h1 className="a-title" style={{ marginTop: 10 }}>
            {submission.name || submission.email || label}
          </h1>
          <p className="a-sub">
            {label} ·{" "}
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(submission.createdAt)}
          </p>
        </div>
        {submission.email ? (
          <a
            className="a-btn a-btn--primary"
            href={`mailto:${submission.email}?subject=${encodeURIComponent(
              `Re: your ${label.toLowerCase()} — Betaminds Africa`,
            )}`}
          >
            Reply by email
          </a>
        ) : null}
      </div>

      {/* Status is a row of small forms rather than a select, so changing it is
          one click from anywhere in the workflow. */}
      <div className="a-card" style={{ marginBottom: 14 }}>
        <div className="a-row">
          <span className="a-label" style={{ margin: 0 }}>
            Status
          </span>
          {STATUSES.map((status) => (
            <form action={setSubmissionStatus} key={status}>
              <input type="hidden" name="id" value={submission.id} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                className={`a-btn a-btn--sm ${
                  submission.status === status ? "a-btn--primary" : ""
                }`}
              >
                {status}
              </button>
            </form>
          ))}
        </div>
      </div>

      <div className="a-tablewrap" style={{ marginBottom: 14 }}>
        <table className="a-table" style={{ minWidth: 0 }}>
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key}>
                <th style={{ width: 240, verticalAlign: "top" }}>
                  {fieldLabel(key, labels)}
                </th>
                <td style={{ whiteSpace: "pre-wrap" }}>
                  {value ? (
                    key === "email" ? (
                      <a href={`mailto:${value}`}>{value}</a>
                    ) : (
                      value
                    )
                  ) : (
                    <span className="a-dim">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubmissionNotes id={submission.id} notes={submission.notes} />

      <form
        action={deleteSubmission}
        style={{ marginTop: 22 }}
        // A submission is somebody's enquiry; make deleting it deliberate.
      >
        <input type="hidden" name="id" value={submission.id} />
        <button type="submit" className="a-btn a-btn--sm a-btn--danger">
          Delete this submission
        </button>
        <p className="a-help">
          Archiving keeps a record and takes it out of the inbox. Deleting is
          permanent.
        </p>
      </form>
    </>
  );
}
