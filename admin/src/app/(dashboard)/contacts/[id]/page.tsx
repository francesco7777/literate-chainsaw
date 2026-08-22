import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/ContactForm";
import { updateContact } from "../actions";

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: contact } = await supabase.from("contacts").select("*").eq("id", params.id).single();

  if (!contact) notFound();

  const updateWithId = updateContact.bind(null, params.id);

  return (
    <div>
      <h1>Kontakt bearbeiten</h1>
      <ContactForm contact={contact} action={updateWithId} />
    </div>
  );
}
