"use client";

import { useFormState } from "react-dom";
import { signIn } from "./actions";

export default function LoginPage() {
  const [state, formAction] = useFormState(signIn, null);

  return (
    <div className="login-wrap">
      <div className="login-card">
        <img src="/logo.png" alt="FC Erlinsbach" />
        <h1>FC Erlinsbach</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 0, marginBottom: 20 }}>
          Admin-Login
        </p>
        <form action={formAction}>
          <label>
            E-Mail
            <input type="email" name="email" required autoComplete="email" />
          </label>
          <label>
            Passwort
            <input type="password" name="password" required autoComplete="current-password" />
          </label>
          {state?.error && <p className="error">{state.error}</p>}
          <button type="submit" className="btn">
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}
