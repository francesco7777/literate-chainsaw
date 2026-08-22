import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardHome() {
  const supabase = createClient();
  const [news, matches, teams, sponsors, contacts] = await Promise.all([
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase.from("matches").select("id", { count: "exact", head: true }),
    supabase.from("teams").select("id", { count: "exact", head: true }),
    supabase.from("sponsors").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "News", count: news.count ?? 0, href: "/news" },
    { label: "Spiele", count: matches.count ?? 0, href: "/matches" },
    { label: "Teams", count: teams.count ?? 0, href: "/teams" },
    { label: "Sponsoren", count: sponsors.count ?? 0, href: "/sponsors" },
    { label: "Vorstand", count: contacts.count ?? 0, href: "/contacts" },
  ];

  return (
    <div>
      <h1>Übersicht</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Willkommen im Admin-Backend. Änderungen erscheinen sofort in der App.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginTop: 20 }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--green)" }}>{c.count}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14 }}>{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
