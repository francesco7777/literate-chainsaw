import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateNews } from "../actions";

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: item } = await supabase.from("news").select("*").eq("id", params.id).single();

  if (!item) notFound();

  const updateWithId = updateNews.bind(null, params.id);

  return (
    <div>
      <h1>News bearbeiten</h1>
      <form action={updateWithId}>
        <label>
          Titel
          <input type="text" name="title" defaultValue={item.title} required />
        </label>
        <label>
          Autor
          <input type="text" name="author" defaultValue={item.author ?? ""} />
        </label>
        <label>
          Bild-URL
          <input type="url" name="image_url" defaultValue={item.image_url ?? ""} placeholder="https://..." />
        </label>
        <label>
          Inhalt
          <textarea name="content" defaultValue={item.content} required />
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
