import { Suspense } from "react";
import { countAdmins } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  let hasAdmin = true;
  try {
    hasAdmin = (await countAdmins()) > 0;
  } catch {
    hasAdmin = false;
  }

  return (
    <div className="a-login">
      <div className="a-login-card">
        <h1 className="a-title" style={{ fontSize: 21, marginBottom: 4 }}>
          Betaminds Admin
        </h1>
        <p className="a-sub" style={{ marginBottom: 22 }}>
          Edit page content and pictures, and read contact form submissions.
        </p>

        {hasAdmin ? (
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        ) : (
          <div className="a-notice" data-tone="error">
            No admin account exists yet. Run <code>npm run setup</code> to create
            the database and seed the first account from your{" "}
            <code>.env</code> file.
          </div>
        )}
      </div>
    </div>
  );
}
