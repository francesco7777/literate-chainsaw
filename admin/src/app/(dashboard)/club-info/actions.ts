"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateClubInfo(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("club_info")
    .update({
      address: String(formData.get("address") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      website: String(formData.get("website") ?? "") || null,
      facebook_url: String(formData.get("facebook_url") ?? "") || null,
      instagram_url: String(formData.get("instagram_url") ?? "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
  revalidatePath("/club-info");
}
