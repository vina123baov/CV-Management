// app/api/match/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServer } from "@/utils/supabase/server";
import { computeScore } from "@/lib/match";

type JobRequirement = { name: string; min?: number | null };

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { candidate_id?: string; job_id?: string };
  if (!body?.candidate_id) {
    return NextResponse.json({ error: "candidate_id is required" }, { status: 400 });
  }

  const supabase = createServer();

  // 1) Candidate skills (normalize để tránh TS 2352)
  const { data: cskills, error: csErr } = await supabase
    .from("candidate_skills")
    .select("level, skills(name)")
    .eq("candidate_id", body.candidate_id);

  if (csErr) return NextResponse.json({ error: csErr.message }, { status: 500 });

  const candidateSkills =
    ((cskills ?? []) as any[]).map((r) => {
      const skillField = r?.skills;
      const skillName = Array.isArray(skillField) ? skillField[0]?.name : skillField?.name;
      return {
        name: (skillName ?? "").toString(),
        level: r?.level ?? null,
      };
    }).filter((s) => s.name.length > 0);

  // 2) Jobs cần tính
  type JobRow = { id: string; title: string; requirements: any };
  let jobs: JobRow[] = [];

  if (body.job_id) {
    const { data: job, error: jErr } = await supabase
      .from("jobs")
      .select("id, title, requirements")
      .eq("id", body.job_id)
      .single();
    if (jErr) return NextResponse.json({ error: jErr.message }, { status: 500 });
    if (job) jobs = [job as JobRow];
  } else {
    const { data: all, error: jErr } = await supabase
      .from("jobs")
      .select("id, title, requirements")
      .eq("status", "open");
    if (jErr) return NextResponse.json({ error: jErr.message }, { status: 500 });
    jobs = (all as JobRow[]) ?? [];
  }

  // 3) Tính điểm & upsert
  const results: Array<{ job_id: string; score?: number; updated?: boolean; error?: string }> = [];

  for (const job of jobs) {
    // Chuẩn hoá requirements (object hoặc string JSON)
    let reqs: JobRequirement[] = [];
    try {
      const reqObj =
        typeof job.requirements === "string"
          ? JSON.parse(job.requirements)
          : job.requirements ?? {};
      const arr = Array.isArray(reqObj?.skills) ? reqObj.skills : [];
      reqs = arr
        .map((x: any) => ({
          name: (x?.name ?? "").toString(),
          min: typeof x?.min === "number" ? x.min : null,
        }))
        .filter((x: JobRequirement) => x.name.length > 0);
    } catch {
      reqs = [];
    }

    const { score, explanation } = computeScore(candidateSkills, reqs);

    const { error: upErr } = await supabase
      .from("matches")
      .upsert(
        {
          candidate_id: body.candidate_id!,
          job_id: job.id,
          score,
          explanation,
        },
        { onConflict: "candidate_id,job_id" }
      );

    if (upErr) {
      results.push({ job_id: job.id, error: upErr.message });
    } else {
      results.push({ job_id: job.id, score, updated: true });
    }
  }

  return NextResponse.json({ ok: true, results });
}
