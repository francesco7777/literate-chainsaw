import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteNews } from "./actions";

export default async function NewsListPage() {
  const supabase = createClient();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div>
      <div className="topbar">
        <h1>News</h1>
        <Link href="/news/new" className="btn">
          + Neuer Beitrag
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Datum</th>
            <th>Autor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(news ?? []).map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{new Date(item.published_at).toLocaleDateString("de-CH")}</td>
              <td>{item.author ?? "–"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/news/${item.id}`} className="btn btn-secondary">
                  Bearbeiten
                </Link>
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="btn btn-danger">
                    Löschen
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {(news ?? []).length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "var(--text-muted)" }}>
                Noch keine News vorhanden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
