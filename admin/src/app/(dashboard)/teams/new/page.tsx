import { createTeam } from "../actions";

export default function NewTeamPage() {
  return (
    <div>
      <h1>Neues Team</h1>
      <form action={createTeam}>
        <label>
          Name
          <input type="text" name="name" placeholder="z.B. 1. Mannschaft" required />
        </label>
        <label>
          Kategorie
          <select name="category" defaultValue="Aktive">
            <option value="Aktive">Aktive</option>
            <option value="Junioren">Junioren</option>
            <option value="Senioren">Senioren</option>
            <option value="Frauen">Frauen</option>
          </select>
        </label>
        <label>
          Liga
          <input type="text" name="league" placeholder="z.B. 4. Liga" />
        </label>
        <label>
          Reihenfolge
          <input type="number" name="sort_order" defaultValue={0} />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn">
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}
