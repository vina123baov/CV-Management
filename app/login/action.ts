'use server';

import { createClient as createServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function signIn(formData: FormData): Promise<void> {
  const supabase = createServer();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // về lại /login và show lỗi thay vì throw
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/');
  redirect('/candidates');
}

export async function signUp(formData: FormData): Promise<void> {
  const supabase = createServer();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback`, // nếu bật confirm email
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Nếu bật confirm email: bảo người dùng check mail
  if (!data.session) {
    redirect(`/login?info=${encodeURIComponent('Đã gửi email xác nhận. Vui lòng xác nhận rồi đăng nhập.')}`);
  }

  // Nếu tắt confirm email thì đã có session → vào thẳng app
  revalidatePath('/');
  redirect('/candidates');
}

export async function signOut(): Promise<void> {
  const supabase = createServer();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/login?info=Signed%20out');
}
