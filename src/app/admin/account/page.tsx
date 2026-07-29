import { getSession } from "@/lib/auth";
import { PasswordForm } from "@/components/admin/PasswordForm";

export default async function AccountPage() {
  const session = await getSession();

  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-title">Password</h1>
          <p className="a-sub">
            Signed in as <strong>{session?.email}</strong>. Change the seeded
            password before the site goes live.
          </p>
        </div>
      </div>

      <div className="a-card" style={{ maxWidth: 460 }}>
        <PasswordForm />
      </div>
    </>
  );
}
