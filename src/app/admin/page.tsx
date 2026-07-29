import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  countsByKind,
  countsByStatus,
  listSubmissions,
  KIND_LABEL,
  SUBMISSION_KINDS,
  type SubmissionKind,
} from "@/lib/submissions";
import { schemas } from "@/lib/content/schema";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

export default async function DashboardPage() {
  const [statuses, kinds, recent, mediaCount, edited] = await Promise.all([
    countsByStatus(),
    countsByKind(),
    listSubmissions({ status: "all", kind: "all" }).then((rows) =>
      rows.slice(0, 8),
    ),
    prisma.mediaAsset.count(),
    prisma.document.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
  ]);

  const total = Object.values(kinds).reduce((sum, n) => sum + n, 0);

  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-title">Dashboard</h1>
          <p className="a-sub">
            Edit any page&rsquo;s copy and pictures from the sidebar. Everything
            people send from the site lands in Submissions.
          </p>
        </div>
      </div>

      <div className="a-grid a-grid-4" style={{ marginBottom: 22 }}>
        <div className="a-card">
          <div className="a-stat">{statuses.new ?? 0}</div>
          <div className="a-stat-label">New submissions</div>
        </div>
        <div className="a-card">
          <div className="a-stat">{total}</div>
          <div className="a-stat-label">Total submissions</div>
        </div>
        <div className="a-card">
          <div className="a-stat">{mediaCount}</div>
          <div className="a-stat-label">Images uploaded</div>
        </div>
        <div className="a-card">
          <div className="a-stat">{schemas.length}</div>
          <div className="a-stat-label">Editable documents</div>
        </div>
      </div>

      {mediaCount === 0 ? (
        <div className="a-notice" style={{ marginBottom: 22 }}>
          <strong>Photography is still placeholder.</strong> Every image on the
          site comes from the design handoff&rsquo;s stock stand-ins. Upload the
          real assets in the{" "}
          <Link href="/admin/media">media library</Link>, then point each
          page&rsquo;s image field at them.
        </div>
      ) : null}

      <div className="a-grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div>
          <h2 className="a-title" style={{ fontSize: 17, marginBottom: 12 }}>
            Latest submissions
          </h2>
          {recent.length === 0 ? (
            <div className="a-card a-empty">
              Nothing yet. The brief form, discovery questionnaire, Academy
              application, Summit interest form and newsletter all report here.
            </div>
          ) : (
            <div className="a-tablewrap">
              <table className="a-table" style={{ minWidth: 0 }}>
                <thead>
                  <tr>
                    <th>Received</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row) => (
                    <tr key={row.id}>
                      <td className="a-nowrap a-dim">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="a-nowrap">
                        {KIND_LABEL[row.kind as SubmissionKind] ?? row.kind}
                      </td>
                      <td>
                        <div className="a-clip" style={{ maxWidth: 200 }}>
                          {row.name || row.email}
                        </div>
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
        </div>

        <div>
          <h2 className="a-title" style={{ fontSize: 17, marginBottom: 12 }}>
            By type
          </h2>
          <div className="a-card">
            {SUBMISSION_KINDS.map((kind) => (
              <div
                key={kind}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "7px 0",
                }}
              >
                <Link href={`/admin/submissions?kind=${kind}`}>
                  {KIND_LABEL[kind]}
                </Link>
                <span className="a-dim">{kinds[kind] ?? 0}</span>
              </div>
            ))}
          </div>

          <h2
            className="a-title"
            style={{ fontSize: 17, margin: "22px 0 12px" }}
          >
            Recently edited
          </h2>
          <div className="a-card">
            {edited.length === 0 ? (
              <span className="a-dim">
                No page has been edited yet — everything is showing the copy from
                the design handoff.
              </span>
            ) : (
              edited.map((doc) => {
                const schema = schemas.find((s) => s.id === doc.id);
                return (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "7px 0",
                    }}
                  >
                    <Link href={`/admin/content/${doc.id}`}>
                      {schema?.title ?? doc.id}
                    </Link>
                    <span className="a-dim a-nowrap">
                      {formatDate(doc.updatedAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
