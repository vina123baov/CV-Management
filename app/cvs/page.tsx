// app/cvs/page.tsx
import { uploadCv } from "./upload-action";

export default function CVsPage() {
  return (
    <section>
      <h1>Upload CV</h1>
      <p style={{ color: "#666" }}>Accept: .pdf .doc .docx</p>
      <form action={uploadCv} style={{ display: "grid", gap: 8, maxWidth: 420, marginTop: 12 }}>
        <input type="file" name="file" accept=".pdf,.doc,.docx" required />
        <button style={{ padding: "8px 12px" }}>Upload</button>
      </form>
    </section>
  );
}
