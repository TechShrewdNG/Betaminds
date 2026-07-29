import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { listSubmissions, toCsv } from "@/lib/submissions";

/** CSV export of the current inbox filters. */
export async function GET(request: NextRequest) {
  // Middleware already gates /admin/*, but a download route is worth checking
  // directly rather than relying on the matcher staying correct.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const rows = await listSubmissions({
    kind: params.get("kind") ?? "all",
    status: params.get("status") ?? "all",
    query: params.get("q") ?? "",
  });

  const stamp = new Date().toISOString().slice(0, 10);

  // The BOM keeps Excel from mangling the accented characters in the copy.
  return new NextResponse(`\uFEFF${toCsv(rows)}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="betaminds-submissions-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
