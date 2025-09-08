// app/jobs/[id]/page.tsx
import { createClient as createServer } from "@/utils/supabase/server";

export default async function JobDetail({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServer(); // ✅ không truyền tham số

  // Job info
  const { data: job, error: jErr } = await supabase
    .from("jobs")
    .select(
      "id, title, level, location, status, description, requirements"
    )
    .eq("id", params.id)
    .single();

  if (jErr) {
    return <div className="p-6 text-red-600">Error: {jErr.message}</div>;
  }

  // ✅ Chuẩn hoá requirements (có thể là string JSON hoặc object)
  let reqSkills: Array<{ name: string; min?: number }> = [];
  try {
    const reqObj =
      typeof job?.requirements === "string"
        ? JSON.parse(job.requirements)
        : job?.requirements ?? {};
    reqSkills = Array.isArray(reqObj?.skills) ? reqObj.skills : [];
  } catch {
    reqSkills = [];
  }

  // Top candidates for this job (from matches)
  const { data: rawTops } = await supabase
    .from("matches")
    .select(
      "score, explanation, candidates(id, full_name, seniority, current_title, location, email)"
    )
    .eq("job_id", params.id)
    .order("score", { ascending: false })
    .limit(20);

  // ✅ Normalize: candidates có thể là object hoặc mảng
  const tops =
    ((rawTops ?? []) as any[]).map((m) => {
      const cField = m?.candidates;
      const c = Array.isArray(cField) ? cField[0] : cField;
      return {
        score: m?.score ?? 0,
        explanation: m?.explanation ?? "",
        id: c?.id as string | undefined,
        full_name: c?.full_name as string | undefined,
        seniority: c?.seniority as string | undefined,
        current_title: c?.current_title as string | undefined,
        location: c?.location as string | undefined,
        email: c?.email as string | undefined,
      };
    }) as {
      score: number;
      explanation: string;
      id?: string;
      full_name?: string;
      seniority?: string;
      current_title?: string;
      location?: string;
      email?: string;
    }[];

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{job?.title}</h1>
        <p className="text-sm text-gray-500">
          {job?.level} • {job?.location} • {job?.status}
        </p>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{job?.description}</p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Requirements</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {reqSkills.length > 0 ? (
            reqSkills.map((s, idx) => (
              <li key={idx}>
                {s.name} {s.min ? `(min ${s.min})` : ""}
              </li>
            ))
          ) : (
            <li>—</li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Top Candidates</h2>
        {tops.length === 0 && (
          <div className="text-gray-500">
            Chưa có matches. Vào trang Candidate và bấm “Recompute matches”.
          </div>
        )}
        <div className="space-y-3">
          {tops.map((m, idx) => (
            <div key={idx} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {m.full_name ?? "—"} • {m.seniority ?? "—"} •{" "}
                  {m.current_title ?? "—"} • {m.location ?? "—"}
                  <span className="ml-2 text-xs rounded bg-green-50 px-2 py-0.5 text-green-700">
                    {m.score}%
                  </span>
                </div>
                {m.id && (
                  <a
                    href={`/candidates/${m.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Candidate
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
