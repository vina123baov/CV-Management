'use server';

import { createClient as createServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signIn(formData: FormData): Promise<void> {
  const supabase = createServer();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  revalidatePath('/');
  redirect('/candidates');
}

export async function signUp(formData: FormData): Promise<void> {
  const supabase = createServer();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  revalidatePath('/');
  redirect('/candidates');
}

export async function signOut(): Promise<void> {
  const supabase = createServer();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/login');
}
