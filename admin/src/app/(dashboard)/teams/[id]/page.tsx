import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addPlayer, deletePlayer, deleteTeam, updateTeam } from "../actions";

export default async function EditTeamPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: team }, { data: players }] = await Promise.all([
    supabase.from("teams").select("*").eq("id", params.id).single(),
    supabase.from("players").select("*").eq("team_id", params.id).order("sort_order"),
  ]);

  if (!team) notFound();

  const updateWithId = updateTeam.bind(null, params.id);
  const addPlayerWithId = addPlayer.bind(null, params.id);
  const deletePlayerWithId = deletePlayer.bind(null, params.id);

  return (
    <div>
      <h1>{team.name}</h1>

      <div className="card">
        <h3>Team-Angaben</h3>
        <form action={updateWithId}>
          <label>
            Name
            <input type="text" name="name" defaultValue={team.name} required />
          </label>
          <label>
            Kategorie
            <select name="category" defaultValue={team.category}>
              <option value="Aktive">Aktive</option>
              <option value="Junioren">Junioren</option>
              <option value="Senioren">Senioren</option>
              <option value="Frauen">Frauen</option>
            </select>
          </label>
          <label>
            Liga
            <input type="text" name="league" defaultValue={team.league ?? ""} />
          </label>
          <label>
            Reihenfolge
            <input type="number" name="sort_order" defaultValue={team.sort_order} />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn">
              Speichern
            </button>
          </div>
        </form>
        <form action={deleteTeam} style={{ marginTop: 12 }}>
          <input type="hidden" name="id" value={team.id} />
          <button type="submit" className="btn btn-danger">
            Team löschen
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Kader</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(players ?? []).map((p) => (
              <tr key={p.id}>
                <td>{p.jersey_number ?? "–"}</td>
                <td>
                  {p.first_name} {p.last_name}
                </td>
                <td>{p.position ?? "–"}</td>
                <td>
                  <form action={deletePlayerWithId}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="btn btn-danger">
                      Entfernen
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(players ?? []).length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: "var(--text-muted)" }}>
                  Noch kein Kader erfasst.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 style={{ marginTop: 24 }}>Spieler hinzufügen</h3>
        <form action={addPlayerWithId}>
          <div className="form-row">
            <label style={{ flex: 1 }}>
              Vorname
              <input type="text" name="first_name" required />
            </label>
            <label style={{ flex: 1 }}>
              Nachname
              <input type="text" name="last_name" required />
            </label>
          </div>
          <div className="form-row">
            <label style={{ flex: 1 }}>
              Position
              <input type="text" name="position" placeholder="z.B. Torwart" />
            </label>
            <label style={{ width: 100 }}>
              Nummer
              <input type="number" name="jersey_number" />
            </label>
          </div>
          <label>
            Foto-URL
            <input type="url" name="photo_url" placeholder="https://..." />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn">
              Hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
