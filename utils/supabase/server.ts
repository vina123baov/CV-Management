// utils/supabase/server.ts
import { cookies } from "next/headers";
import {
  createServerClient,
  type CookieOptions,
  type CookieMethodsServer,
} from "@supabase/ssr";

export function createClient() {
  const cookieStore = cookies();

  const cookieMethods: CookieMethodsServer = {
    get(name: string) { return cookieStore.get(name)?.value; },
    set(name: string, value: string, options: CookieOptions) {
      cookieStore.set({ name, value, ...options });
    },
    delete(name: string, options: CookieOptions) {
      cookieStore.set({ name, value: "", ...options });
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods }
  );
}
