import { createClient } from "@/lib/supabase/server";
import { updateClubInfo } from "./actions";

export default async function ClubInfoPage() {
  const supabase = createClient();
  const { data: info } = await supabase.from("club_info").select("*").eq("id", 1).single();

  return (
    <div>
      <h1>Vereinsangaben</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Diese Angaben erscheinen im Bereich &quot;Verein&quot; der App.
      </p>
      <form action={updateClubInfo}>
        <label>
          Adresse
          <input type="text" name="address" defaultValue={info?.address ?? ""} />
        </label>
        <label>
          E-Mail
          <input type="email" name="email" defaultValue={info?.email ?? ""} />
        </label>
        <label>
          Telefon
          <input type="tel" name="phone" defaultValue={info?.phone ?? ""} />
        </label>
        <label>
          Website
          <input type="url" name="website" defaultValue={info?.website ?? ""} />
        </label>
        <label>
          Facebook-URL
          <input type="url" name="facebook_url" defaultValue={info?.facebook_url ?? ""} />
        </label>
        <label>
          Instagram-URL
          <input type="url" name="instagram_url" defaultValue={info?.instagram_url ?? ""} />
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
