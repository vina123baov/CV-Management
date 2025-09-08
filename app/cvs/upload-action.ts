// app/cvs/upload-action.ts
"use server";
import { createClient } from "../../utils/supabase/server";
import { randomUUID } from "crypto";
import path from "node:path";

export async function uploadCv(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in first.");

  const file = formData.get("file") as File;
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".pdf";
  const fileKey = `${user.id}/${randomUUID()}${ext}`;

  const { error: upErr } = await supabase.storage
    .from("cvs")
    .upload(fileKey, buf, { contentType: file.type || "application/octet-stream" });
  if (upErr) throw upErr;

  const { data: signed } = await supabase.storage.from("cvs").createSignedUrl(fileKey, 60 * 15);

  await supabase.from("cvs").insert({
    user_id: user.id,
    filename: file.name,
    file_url: signed?.signedUrl ?? "",
    file_path: fileKey,
    file_size: file.size,
    file_type: ext.replace(".", ""),
    status: "pending",
  });
}
