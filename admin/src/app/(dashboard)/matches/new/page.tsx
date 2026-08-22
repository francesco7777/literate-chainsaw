import { createClient } from "@/lib/supabase/server";
import { MatchForm } from "@/components/MatchForm";
import { createMatch } from "../actions";

export default async function NewMatchPage() {
  const supabase = createClient();
  const { data: teams } = await supabase.from("teams").select("id, name").order("sort_order");

  return (
    <div>
      <h1>Neues Spiel</h1>
      <MatchForm teams={teams ?? []} action={createMatch} />
    </div>
  );
}
