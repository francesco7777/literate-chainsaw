import { ContactForm } from "@/components/ContactForm";
import { createContact } from "../actions";

export default function NewContactPage() {
  return (
    <div>
      <h1>Neuer Kontakt</h1>
      <ContactForm action={createContact} />
    </div>
  );
}
