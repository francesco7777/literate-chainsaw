"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createNews(formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get("title") ?? "");

  const { error } = await supabase.from("news").insert({
    title,
    slug: slugify(title),
    content: String(formData.get("content") ?? ""),
    image_url: String(formData.get("image_url") ?? "") || null,
    author: String(formData.get("author") ?? "") || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/news");
  redirect("/news");
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get("title") ?? "");

  const { error } = await supabase
    .from("news")
    .update({
      title,
      slug: slugify(title),
      content: String(formData.get("content") ?? ""),
      image_url: String(formData.get("image_url") ?? "") || null,
      author: String(formData.get("author") ?? "") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/news");
  redirect("/news");
}

export async function deleteNews(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/news");
}
