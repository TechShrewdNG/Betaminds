import { logout } from "@/app/admin/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="a-btn a-btn--sm" style={{ width: "100%" }}>
        Sign out
      </button>
    </form>
  );
}
