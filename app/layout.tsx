// app/layout.tsx
export const metadata = { title: "CV Management" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ fontFamily: "system-ui, -apple-system", padding: 0, margin: 0 }}>
        <header style={{ padding: "10px 16px", borderBottom: "1px solid #eee", display: "flex", gap: 16 }}>
          <strong>CV Management</strong>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="/">Dashboard</a>
            <a href="/candidates">Candidates</a>
            <a href="/jobs">Jobs</a>
            <a href="/cvs">Upload CV</a>
            <a href="/login" style={{ marginLeft: "auto" }}>Login</a>
          </nav>
        </header>
        <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>{children}</main>
      </body>
    </html>
  );
}
