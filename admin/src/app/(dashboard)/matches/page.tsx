import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteMatch } from "./actions";

export default async function MatchesListPage() {
  const supabase = createClient();
  const { data: matches } = await supabase
    .from("matches")
    .select("*, teams(name)")
    .order("match_date", { ascending: false });

  return (
    <div>
      <div className="topbar">
        <h1>Spielplan</h1>
        <Link href="/matches/new" className="btn">
          + Neues Spiel
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Gegner</th>
            <th>Datum</th>
            <th>Status</th>
            <th>Resultat</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(matches ?? []).map((m: any) => (
            <tr key={m.id}>
              <td>{m.teams?.name ?? "–"}</td>
              <td>
                {m.home_away === "home" ? `vs. ${m.opponent}` : `bei ${m.opponent}`}
              </td>
              <td>{new Date(m.match_date).toLocaleString("de-CH")}</td>
              <td>{m.status}</td>
              <td>
                {m.home_score !== null && m.away_score !== null ? `${m.home_score}:${m.away_score}` : "–"}
              </td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/matches/${m.id}`} className="btn btn-secondary">
                  Bearbeiten
                </Link>
                <form action={deleteMatch}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="btn btn-danger">
                    Löschen
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {(matches ?? []).length === 0 && (
            <tr>
              <td colSpan={6} style={{ color: "var(--text-muted)" }}>
                Noch keine Spiele erfasst.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
