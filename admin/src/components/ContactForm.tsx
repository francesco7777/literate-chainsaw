type Contact = {
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  sort_order: number;
};

export function ContactForm({ contact, action }: { contact?: Contact; action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <label>
        Name
        <input type="text" name="name" defaultValue={contact?.name ?? ""} required />
      </label>
      <label>
        Funktion
        <input type="text" name="role" defaultValue={contact?.role ?? ""} placeholder="z.B. Präsident" required />
      </label>
      <label>
        E-Mail
        <input type="email" name="email" defaultValue={contact?.email ?? ""} />
      </label>
      <label>
        Telefon
        <input type="tel" name="phone" defaultValue={contact?.phone ?? ""} />
      </label>
      <label>
        Reihenfolge
        <input type="number" name="sort_order" defaultValue={contact?.sort_order ?? 0} />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn">
          Speichern
        </button>
      </div>
    </form>
  );
}
