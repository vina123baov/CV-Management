// app/candidates/page.tsx
import { createClient } from "../../utils/supabase/server";

export default async function CandidatesPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();
  const q = searchParams.q ?? "";

  const { data, error } = q
    ? await supabase.rpc("search_candidates", { q })
    : await supabase
        .from("cv_profiles")
        .select("id, full_name, email, technical_skills, updated_at")
        .order("updated_at", { ascending: false });

  if (error) return <pre>Error: {error.message}</pre>;

  return (
    <section>
      <h1>Candidates</h1>
      <form style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input name="q" placeholder="Search name/email/skills" defaultValue={q} style={{ padding: 8, flex: 1 }} />
        <button style={{ padding: "8px 12px" }}>Search</button>
      </form>

      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Email</th>
            <th style={{ padding: 8 }}>Skills</th>
            <th style={{ padding: 8, width: 160 }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((c: any) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #f3f3f3" }}>
              <td style={{ padding: 8 }}>{c.full_name ?? "-"}</td>
              <td style={{ padding: 8 }}>{c.email ?? "-"}</td>
              <td style={{ padding: 8 }}>
                {(c.technical_skills ?? []).slice(0, 6).map((s: string, i: number) => (
                  <span key={i} style={{ fontSize: 12, padding: "2px 6px", border: "1px solid #eee", marginRight: 6, borderRadius: 12 }}>
                    {s}
                  </span>
                ))}
              </td>
              <td style={{ padding: 8 }}>{c.updated_at ? new Date(c.updated_at).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
