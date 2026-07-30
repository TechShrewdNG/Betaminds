import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";
import { getSession } from "@/lib/auth";
import { schemas } from "@/lib/content/schema";
import { countsByStatus } from "@/lib/submissions";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Betaminds Admin",
  // Never let a CMS screen show up in search results.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // The login screen renders inside this layout but without the shell.
  if (!session) {
    return <div className="admin">{children}</div>;
  }

  let newCount = 0;
  try {
    newCount = (await countsByStatus()).new ?? 0;
  } catch {
    // A missing table shouldn't break navigation; the badge just stays at zero.
  }

  return (
    <div className="admin">
      <div className="a-shell">
        <aside className="a-side">
          <Link href="/admin" className="a-brand">
            <span className="a-brand-mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/BETAMINDS-AFRICA.png" alt="" />
            </span>
            <span>
              <span className="a-brand-name">BETAMINDS</span>
              <span className="a-brand-sub">Admin</span>
            </span>
          </Link>

          <nav>
            <div className="a-navgroup">
              <p className="a-navlabel">Overview</p>
              <AdminNavLink href="/admin" exact>
                Dashboard
              </AdminNavLink>
              <AdminNavLink href="/admin/submissions">
                Submissions
                {newCount > 0 ? (
                  <span className="a-navcount" data-hot="true">
                    {newCount}
                  </span>
                ) : null}
              </AdminNavLink>
              <AdminNavLink href="/admin/media">Media library</AdminNavLink>
            </div>

            <div className="a-navgroup">
              <p className="a-navlabel">Content</p>
              {schemas.map((schema) => (
                <AdminNavLink key={schema.id} href={`/admin/content/${schema.id}`}>
                  {schema.title}
                </AdminNavLink>
              ))}
            </div>

            <div className="a-navgroup">
              <p className="a-navlabel">Account</p>
              <AdminNavLink href="/admin/account">Password</AdminNavLink>
              <AdminNavLink href="/">
                View site ↗
              </AdminNavLink>
            </div>
          </nav>

          <div className="a-side-foot">
            <div className="a-who">
              Signed in as
              <br />
              <strong>{session.email}</strong>
            </div>
            <LogoutButton />
          </div>
        </aside>

        <main className="a-main">{children}</main>
      </div>
    </div>
  );
}
