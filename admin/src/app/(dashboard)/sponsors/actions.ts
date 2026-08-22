"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readSponsorFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    logo_url: String(formData.get("logo_url") ?? "") || null,
    website_url: String(formData.get("website_url") ?? "") || null,
    tier: String(formData.get("tier") ?? "bronze"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createSponsor(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("sponsors").insert(readSponsorFields(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/sponsors");
  redirect("/sponsors");
}

export async function updateSponsor(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("sponsors").update(readSponsorFields(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sponsors");
  redirect("/sponsors");
}

export async function deleteSponsor(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("sponsors").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sponsors");
}
