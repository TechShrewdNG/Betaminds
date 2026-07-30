import Link from "next/link";
import {
  listSubmissions,
  KIND_LABEL,
  SUBMISSION_KINDS,
  STATUSES,
  type SubmissionKind,
} from "@/lib/submissions";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; status?: string; q?: string }>;
}) {
  const filters = await searchParams;
  const kind = filters.kind ?? "all";
  const status = filters.status ?? "all";
  const query = filters.q ?? "";

  const rows = await listSubmissions({ kind, status, query });

  const exportParams = new URLSearchParams();
  if (kind !== "all") exportParams.set("kind", kind);
  if (status !== "all") exportParams.set("status", status);
  if (query) exportParams.set("q", query);
  const exportHref = `/admin/submissions/export${
    exportParams.size > 0 ? `?${exportParams}` : ""
  }`;

  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-title">Submissions</h1>
          <p className="a-sub">
            Everything sent from the site: project briefs, discovery
            questionnaires, Academy applications, Summit interest and newsletter
            signups.
          </p>
        </div>
        <a className="a-btn" href={exportHref}>
          Export CSV
        </a>
      </div>

      {/* GET form so filters live in the URL and can be bookmarked or shared. */}
      <form className="a-filters">
        <div className="a-field">
          <label className="a-label" htmlFor="kind">
            Type
          </label>
          <select id="kind" name="kind" className="a-select" defaultValue={kind}>
            <option value="all">All types</option>
            {SUBMISSION_KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="a-field">
          <label className="a-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="a-select"
            defaultValue={status}
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="a-field" style={{ minWidth: 220 }}>
          <label className="a-label" htmlFor="q">
            Search
          </label>
          <input
            id="q"
            name="q"
            className="a-input"
            defaultValue={query}
            placeholder="Name, email or summary"
          />
        </div>

        <button type="submit" className="a-btn">
          Apply
        </button>
        {kind !== "all" || status !== "all" || query ? (
          <Link href="/admin/submissions" className="a-btn a-btn--ghost">
            Clear
          </Link>
        ) : null}
      </form>

      {rows.length === 0 ? (
        <div className="a-card a-empty">
          Nothing here yet. Submissions from the site&rsquo;s forms land in this
          inbox.
        </div>
      ) : (
        <div className="a-tablewrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Type</th>
                <th>From</th>
                <th>Summary</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="a-nowrap a-dim">{formatDate(row.createdAt)}</td>
                  <td className="a-nowrap">
                    {KIND_LABEL[row.kind as SubmissionKind] ?? row.kind}
                  </td>
                  <td>
                    {row.name ? (
                      <div className="a-strong">{row.name}</div>
                    ) : null}
                    <a href={`mailto:${row.email}`} className="a-dim">
                      {row.email}
                    </a>
                  </td>
                  <td>
                    <div className="a-clip">{row.summary}</div>
                  </td>
                  <td>
                    <span className="a-chip" data-status={row.status}>
                      {row.status}
                    </span>
                  </td>
                  <td className="a-nowrap">
                    <Link
                      href={`/admin/submissions/${row.id}`}
                      className="a-btn a-btn--sm"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length >= 500 ? (
        <p className="a-help" style={{ marginTop: 12 }}>
          Showing the 500 most recent. Narrow the filters to see older ones, or
          export to CSV.
        </p>
      ) : null}
    </>
  );
}
