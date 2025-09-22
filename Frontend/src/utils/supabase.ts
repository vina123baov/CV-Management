// src/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

console.log("Supabase Environment Check:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration:");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✓ Present" : "✗ Missing");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Present" : "✗ Missing");
  
  throw new Error(
    "Missing Supabase env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('cv_candidates').select('id').limit(1);
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      return { success: false, error: error.message };
    }
    
    console.log("✓ Supabase connection successful");
    return { success: true, data };
  } catch (err) {
    console.error("Supabase connection error:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
};