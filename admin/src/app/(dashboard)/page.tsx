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
      <div className="page-header">
        <h1>Übersicht</h1>
        <p>Willkommen im Admin-Backend. Änderungen erscheinen sofort in der App.</p>
      </div>
      <div className="stat-grid">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card stat-card">
            <span className="stat-value">{c.count}</span>
            <span className="stat-label">{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
