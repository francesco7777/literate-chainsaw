import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchForm } from "@/components/MatchForm";
import { updateMatch } from "../actions";

export default async function EditMatchPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: match }, { data: teams }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", params.id).single(),
    supabase.from("teams").select("id, name").order("sort_order"),
  ]);

  if (!match) notFound();

  const updateWithId = updateMatch.bind(null, params.id);

  return (
    <div>
      <h1>Spiel bearbeiten</h1>
      <MatchForm teams={teams ?? []} match={match} action={updateWithId} />
    </div>
  );
}
