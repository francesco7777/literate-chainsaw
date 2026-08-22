import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SponsorForm } from "@/components/SponsorForm";
import { updateSponsor } from "../actions";

export default async function EditSponsorPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: sponsor } = await supabase.from("sponsors").select("*").eq("id", params.id).single();

  if (!sponsor) notFound();

  const updateWithId = updateSponsor.bind(null, params.id);

  return (
    <div>
      <h1>Sponsor bearbeiten</h1>
      <SponsorForm sponsor={sponsor} action={updateWithId} />
    </div>
  );
}
