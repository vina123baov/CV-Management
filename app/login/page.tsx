// app/login/page.tsx
import { signIn, signUp, signOut } from './action';

export default function LoginPage() {
  // wrappers: đúng kiểu (formData) => Promise<void>
  async function signInAction(formData: FormData): Promise<void> {
    'use server';
    await signIn(formData);
  }

  async function signUpAction(formData: FormData): Promise<void> {
    'use server';
    await signUp(formData);
  }

  async function signOutAction(_fd: FormData): Promise<void> {
    'use server';
    await signOut();
  }

  return (
    <section style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Auth</h1>

      <h3>Sign in</h3>
      <form action={signInAction} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button>Sign in</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Sign up</h3>
      <form action={signUpAction} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button>Sign up</button>
      </form>

      <form action={signOutAction} style={{ marginTop: 16 }}>
        <button>Sign out</button>
      </form>
    </section>
  );
}
