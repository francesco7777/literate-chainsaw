import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteContact } from "./actions";

export default async function ContactsListPage() {
  const supabase = createClient();
  const { data: contacts } = await supabase.from("contacts").select("*").order("sort_order");

  return (
    <div>
      <div className="topbar">
        <h1>Vorstand</h1>
        <Link href="/contacts/new" className="btn">
          + Neuer Kontakt
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Funktion</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(contacts ?? []).map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.role}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/contacts/${c.id}`} className="btn btn-secondary">
                  Bearbeiten
                </Link>
                <form action={deleteContact}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="btn btn-danger">
                    Löschen
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {(contacts ?? []).length === 0 && (
            <tr>
              <td colSpan={3} style={{ color: "var(--text-muted)" }}>
                Noch keine Kontakte erfasst.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
