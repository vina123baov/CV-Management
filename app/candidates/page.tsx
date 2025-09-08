import Link from "next/link";
import { createClient as createServer } from "@/utils/supabase/server";

export default async function CandidatesList({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const supabase = createServer();
  const q = (searchParams?.q ?? "").toString().trim();

  // Build query
  let query = supabase
    .from("candidates")
    .select(
      "id, full_name, email, location, updated_at, candidate_skills(level, skills(name))"
    )
    .order("updated_at", { ascending: false });

  if (q) {
    // tìm theo name/email/location
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,location.ilike.%${q}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error.message}
        <div className="text-gray-500 mt-2">
          (Nếu là <code>permission denied</code>, hãy đăng nhập ở /login hoặc tạm
          mở policy đọc public.)
        </div>
      </div>
    );
  }

  const rows =
    ((data ?? []) as any[]).map((r) => {
      const skills = (r.candidate_skills ?? []).map((cs: any) =>
        Array.isArray(cs.skills) ? cs.skills[0]?.name : cs.skills?.name
      );
      return {
        id: r.id as string,
        name: r.full_name as string,
        email: r.email as string,
        location: r.location as string,
        skills: skills.filter(Boolean) as string[],
        updated_at: r.updated_at as string,
      };
    }) ?? [];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Candidates</h1>

      <form method="GET" className="flex gap-2 max-w-xl">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name/email/location"
          className="flex-1 border rounded px-3 py-2"
        />
        <button className="border rounded px-3 py-2">Search</button>
      </form>

      {rows.length === 0 ? (
        <div className="text-gray-500">
          Không có dữ liệu.
          <ul className="list-disc pl-6">
            <li>Đã seed candidates chưa?</li>
            <li>Đã đăng nhập hoặc mở policy đọc public?</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between border rounded px-3 py-2"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">
                  {c.email} • {c.location}
                </div>
                {c.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 rounded px-2 py-0.5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                className="text-sm text-blue-600 hover:underline"
                href={`/candidates/${c.id}`}
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
