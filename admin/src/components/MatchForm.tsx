type Team = { id: string; name: string };
type Match = {
  team_id: string;
  opponent: string;
  home_away: string;
  competition: string | null;
  location: string | null;
  match_date: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
};

export function MatchForm({
  teams,
  match,
  action,
}: {
  teams: Team[];
  match?: Match;
  action: (formData: FormData) => void;
}) {
  const dateValue = match ? new Date(match.match_date).toISOString().slice(0, 16) : "";

  return (
    <form action={action}>
      <label>
        Team
        <select name="team_id" defaultValue={match?.team_id ?? teams[0]?.id} required>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Gegner
        <input type="text" name="opponent" defaultValue={match?.opponent ?? ""} required />
      </label>
      <div className="form-row">
        <label style={{ flex: 1 }}>
          Heim/Auswärts
          <select name="home_away" defaultValue={match?.home_away ?? "home"}>
            <option value="home">Heim</option>
            <option value="away">Auswärts</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          Status
          <select name="status" defaultValue={match?.status ?? "scheduled"}>
            <option value="scheduled">Geplant</option>
            <option value="finished">Beendet</option>
            <option value="cancelled">Abgesagt</option>
            <option value="postponed">Verschoben</option>
          </select>
        </label>
      </div>
      <label>
        Datum & Zeit
        <input type="datetime-local" name="match_date" defaultValue={dateValue} required />
      </label>
      <label>
        Wettbewerb
        <input type="text" name="competition" defaultValue={match?.competition ?? ""} placeholder="z.B. Meisterschaft" />
      </label>
      <label>
        Ort
        <input type="text" name="location" defaultValue={match?.location ?? ""} placeholder="z.B. Sportplatz Chrüzächer" />
      </label>
      <div className="form-row">
        <label style={{ flex: 1 }}>
          Tore Heim
          <input type="number" name="home_score" defaultValue={match?.home_score ?? ""} />
        </label>
        <label style={{ flex: 1 }}>
          Tore Auswärts
          <input type="number" name="away_score" defaultValue={match?.away_score ?? ""} />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn">
          Speichern
        </button>
      </div>
    </form>
  );
}
