import { createNews } from "../actions";

export default function NewNewsPage() {
  return (
    <div>
      <h1>Neuer News-Beitrag</h1>
      <form action={createNews}>
        <label>
          Titel
          <input type="text" name="title" required />
        </label>
        <label>
          Autor
          <input type="text" name="author" />
        </label>
        <label>
          Bild-URL
          <input type="url" name="image_url" placeholder="https://..." />
        </label>
        <label>
          Inhalt
          <textarea name="content" required />
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
