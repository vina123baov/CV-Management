// app/page.tsx
import { createClient } from "../utils/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // vài số liệu cơ bản
  const [{ count: totalCandidates }, { count: totalJobs }] = await Promise.all([
    supabase.from("cv_profiles").select("*", { count: "exact", head: true }),
    supabase.from("job_positions").select("*", { count: "exact", head: true }),
  ]);

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "#666" }}>User: {user?.email ?? "Guest"}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Candidates</div>
          <div style={{ fontSize: 28 }}>{totalCandidates ?? 0}</div>
        </div>
        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Jobs</div>
          <div style={{ fontSize: 28 }}>{totalJobs ?? 0}</div>
        </div>
        <a href="/cvs" style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 12, color: "#666" }}>Quick action</div>
          <div style={{ fontSize: 20 }}>Upload new CV →</div>
        </a>
      </div>

      <div style={{ marginTop: 24 }}>
        <a href="/candidates">→ Go to Candidates</a> ·{" "}
        <a href="/jobs">→ Go to Jobs</a> ·{" "}
        <a href="/cvs">→ Go to Upload CV</a>
      </div>
    </section>
  );
}
