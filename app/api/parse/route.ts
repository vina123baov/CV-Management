import { NextResponse } from "next/server";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  const { cv_id } = await req.json();

  // Giả lập parse
  const parsed = {
    full_name: "Nguyen Van A",
    email: "a@example.com",
    technical_skills: ["React","TypeScript","Next.js"],
    work_experience: [{ company: "ABC", title: "FE Dev", years: 2 }]
  };

  // upsert vào cv_profiles
  await supabase.from("cv_profiles").upsert({
    cv_id,
    full_name: parsed.full_name,
    email: parsed.email,
    technical_skills: parsed.technical_skills,
    work_experience: parsed.work_experience
  }, { onConflict: "cv_id" });

  // update trạng thái
  await supabase.from("cvs").update({ status: "completed" }).eq("id", cv_id);

  return NextResponse.json({ ok: true });
}
