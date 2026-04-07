/*
  useAuth.js
  ----------
  Convenience hook that wraps common Supabase auth actions.
  Components call these instead of touching supabase.auth directly,
  keeps things tidy and testable.
*/

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // email + password sign-up (display_name goes into user metadata,
  // the DB trigger will pick it up to fill the profiles row)
  async function signUp({ email, password, displayName }) {
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (err) setError(err.message);
    setLoading(false);
    return !err;
  }

  // basic email + password login
  async function signIn({ email, password }) {
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) setError(err.message);
    setLoading(false);
    return !err;
  }

  // OAuth (GitHub by default)
  async function signInWithGitHub() {
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (err) setError(err.message);
    setLoading(false);
  }

  return { signUp, signIn, signInWithGitHub, loading, error, setError };
}
