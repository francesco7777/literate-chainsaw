import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { signOut } from "./actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="FC Erlinsbach" />
          <strong>FC Erlinsbach</strong>
        </div>
        <Sidebar />
      </aside>
      <main className="main">
        <div className="topbar">
          <div className="user-chip">
            <span className="user-avatar">{initials}</span>
            {user?.email}
          </div>
          <form action={signOut}>
            <button type="submit" className="btn btn-secondary">
              Abmelden
            </button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}
