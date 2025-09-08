// app/login/page.tsx
import { signIn, signUp, signOut } from "./actions";

export default function LoginPage() {
  return (
    <section>
      <h1>Auth</h1>
      <h3>Sign in</h3>
      <form action={signIn} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button>Sign in</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Sign up</h3>
      <form action={signUp} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button>Sign up</button>
      </form>

      <form action={signOut} style={{ marginTop: 16 }}>
        <button>Sign out</button>
      </form>
    </section>
  );
}
