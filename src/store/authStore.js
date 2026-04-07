/*
  authStore.js
  ------------
  Global auth state powered by Zustand.
  Keeps the current session + user object in memory so any
  component can grab it without prop-drilling.

  Usage:
    const user = useAuthStore(s => s.user);
    const signOut = useAuthStore(s => s.signOut);
*/

import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  /* called once on app mount — restores existing session */
  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
    });

    // listen for future auth changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  /* sign out — clears everything */
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

export default useAuthStore;
