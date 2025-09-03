import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase + Next.js OK</h1>
      <pre>User: {JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}