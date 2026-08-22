"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTeam(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("teams").insert({
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? "Aktive"),
    league: String(formData.get("league") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/teams");
  redirect("/teams");
}

export async function updateTeam(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("teams")
    .update({
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? "Aktive"),
      league: String(formData.get("league") ?? "") || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/teams");
  revalidatePath(`/teams/${id}`);
}

export async function deleteTeam(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/teams");
  redirect("/teams");
}

export async function addPlayer(teamId: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("players").insert({
    team_id: teamId,
    first_name: String(formData.get("first_name") ?? ""),
    last_name: String(formData.get("last_name") ?? ""),
    position: String(formData.get("position") ?? "") || null,
    jersey_number: formData.get("jersey_number") ? Number(formData.get("jersey_number")) : null,
    photo_url: String(formData.get("photo_url") ?? "") || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/teams/${teamId}`);
}

export async function deletePlayer(teamId: string, formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/teams/${teamId}`);
}
