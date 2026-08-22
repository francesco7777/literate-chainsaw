import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteSponsor } from "./actions";

export default async function SponsorsListPage() {
  const supabase = createClient();
  const { data: sponsors } = await supabase.from("sponsors").select("*").order("sort_order");

  return (
    <div>
      <div className="topbar">
        <h1>Sponsoren</h1>
        <Link href="/sponsors/new" className="btn">
          + Neuer Sponsor
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stufe</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(sponsors ?? []).map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.tier}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/sponsors/${s.id}`} className="btn btn-secondary">
                  Bearbeiten
                </Link>
                <form action={deleteSponsor}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="btn btn-danger">
                    Löschen
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {(sponsors ?? []).length === 0 && (
            <tr>
              <td colSpan={3} style={{ color: "var(--text-muted)" }}>
                Noch keine Sponsoren erfasst.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
