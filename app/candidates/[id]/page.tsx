// app/candidates/[id]/page.tsx
import { createClient as createServer } from "@/utils/supabase/server";
import RecomputeMatchesButton from "./recompute-button";

export default async function CandidateDetail({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServer();

  // Candidate info
  const { data: cand, error: cErr } = await supabase
    .from("candidates")
    .select(
      "id, full_name, email, phone, seniority, current_title, location, status, match_score, updated_at"
    )
    .eq("id", params.id)
    .single();

  if (cErr) return <div className="p-6 text-red-600">Error: {cErr.message}</div>;

  // Candidate skills
  const { data: rawSkills } = await supabase
    .from("candidate_skills")
    .select("level, skills(name)")
    .eq("candidate_id", params.id);

  // Normalize: skills có thể là object hoặc mảng
  const skills =
    ((rawSkills ?? []) as any[]).map((r) => {
      const skillField = r?.skills;
      const name = Array.isArray(skillField) ? skillField[0]?.name : skillField?.name;
      return { name: (name ?? "").toString(), level: r?.level ?? null };
    }).filter((s) => s.name.length > 0);

  // Suggested Jobs (from matches)
  const { data: rawMatches } = await supabase
    .from("matches")
    .select("score, explanation, jobs(id, title, location, level, status)")
    .eq("candidate_id", params.id)
    .order("score", { ascending: false });

  // Normalize: jobs cũng có thể là object hoặc mảng
  const matches =
    ((rawMatches ?? []) as any[]).map((m) => {
      const jobField = m?.jobs;
      const job = Array.isArray(jobField) ? jobField[0] : jobField;
      return {
        score: m?.score ?? 0,
        explanation: m?.explanation ?? "",
        jobId: job?.id as string | undefined,
        title: job?.title as string | undefined,
        location: job?.location as string | undefined,
        level: job?.level as string | undefined,
        status: job?.status as string | undefined,
      };
    }) as {
      score: number;
      explanation: string;
      jobId?: string;
      title?: string;
      location?: string;
      level?: string;
      status?: string;
    }[];

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{cand.full_name}</h1>
          <p className="text-sm text-gray-500">
            {cand.current_title} • {cand.seniority} • {cand.location}
          </p>
          <p className="text-sm text-gray-500">
            {cand.email} • {cand.phone}
          </p>
        </div>

        <RecomputeMatchesButton candidateId={cand.id} />
      </header>

      <section>
        <h2 className="text-lg font-medium mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, idx) => (
            <span key={idx} className="px-2 py-1 rounded bg-gray-100 text-sm">
              {s.name} {s.level ? `(Lv ${s.level})` : ""}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Suggested Jobs</h2>
        {matches.length === 0 && (
          <div className="text-gray-500">Chưa có matches. Nhấn “Recompute matches”.</div>
        )}
        <div className="space-y-3">
          {matches.map((m, idx) => (
            <div key={idx} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {m.title ?? "—"} • {m.location ?? "—"} • {m.level ?? "—"}
                  <span className="ml-2 text-xs rounded bg-green-50 px-2 py-0.5 text-green-700">
                    {m.score}%
                  </span>
                </div>
                {m.jobId && (
                  <a
                    href={`/jobs/${m.jobId}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Job
                  </a>
                )}
              </div>
              {m.explanation && (
                <pre className="whitespace-pre-wrap text-xs text-gray-600 mt-2">
                  {m.explanation}
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
