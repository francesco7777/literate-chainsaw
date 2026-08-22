import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const NAV = [
  { href: "/", label: "Übersicht" },
  { href: "/news", label: "News" },
  { href: "/matches", label: "Spielplan" },
  { href: "/teams", label: "Teams & Kader" },
  { href: "/sponsors", label: "Sponsoren" },
  { href: "/contacts", label: "Vorstand" },
  { href: "/club-info", label: "Vereinsangaben" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="FC Erlinsbach" />
          <strong>FC Erlinsbach</strong>
        </div>
        <nav>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{user?.email}</span>
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
