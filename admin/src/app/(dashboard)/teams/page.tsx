import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function TeamsListPage() {
  const supabase = createClient();
  const { data: teams } = await supabase.from("teams").select("*").order("sort_order");

  return (
    <div>
      <div className="topbar">
        <h1>Teams</h1>
        <Link href="/teams/new" className="btn">
          + Neues Team
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Kategorie</th>
            <th>Liga</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(teams ?? []).map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.category}</td>
              <td>{t.league ?? "–"}</td>
              <td>
                <Link href={`/teams/${t.id}`} className="btn btn-secondary">
                  Bearbeiten & Kader
                </Link>
              </td>
            </tr>
          ))}
          {(teams ?? []).length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "var(--text-muted)" }}>
                Noch keine Teams erfasst.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
