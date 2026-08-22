"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readContactFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    email: String(formData.get("email") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createContact(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("contacts").insert(readContactFields(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function updateContact(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("contacts").update(readContactFields(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function deleteContact(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/contacts");
}
