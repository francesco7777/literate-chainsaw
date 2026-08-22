"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readMatchFields(formData: FormData) {
  return {
    team_id: String(formData.get("team_id") ?? ""),
    opponent: String(formData.get("opponent") ?? ""),
    home_away: String(formData.get("home_away") ?? "home"),
    competition: String(formData.get("competition") ?? "") || null,
    location: String(formData.get("location") ?? "") || null,
    match_date: String(formData.get("match_date") ?? ""),
    home_score: formData.get("home_score") ? Number(formData.get("home_score")) : null,
    away_score: formData.get("away_score") ? Number(formData.get("away_score")) : null,
    status: String(formData.get("status") ?? "scheduled"),
  };
}

export async function createMatch(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("matches").insert(readMatchFields(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/matches");
  redirect("/matches");
}

export async function updateMatch(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("matches").update(readMatchFields(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/matches");
  redirect("/matches");
}

export async function deleteMatch(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/matches");
}
