type Sponsor = {
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  sort_order: number;
};

export function SponsorForm({ sponsor, action }: { sponsor?: Sponsor; action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <label>
        Name
        <input type="text" name="name" defaultValue={sponsor?.name ?? ""} required />
      </label>
      <label>
        Logo-URL
        <input type="url" name="logo_url" defaultValue={sponsor?.logo_url ?? ""} placeholder="https://..." />
      </label>
      <label>
        Website
        <input type="url" name="website_url" defaultValue={sponsor?.website_url ?? ""} placeholder="https://..." />
      </label>
      <label>
        Stufe
        <select name="tier" defaultValue={sponsor?.tier ?? "bronze"}>
          <option value="gold">Gold</option>
          <option value="silver">Silber</option>
          <option value="bronze">Bronze</option>
        </select>
      </label>
      <label>
        Reihenfolge
        <input type="number" name="sort_order" defaultValue={sponsor?.sort_order ?? 0} />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn">
          Speichern
        </button>
      </div>
    </form>
  );
}
