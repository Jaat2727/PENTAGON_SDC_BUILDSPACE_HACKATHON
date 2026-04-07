/*
  useBookmarks.js
  ---------------
  Manages project bookmarks with a dual-storage strategy:
  - Logged-in users → Supabase `bookmarks` table
  - Anonymous users → localStorage

  On login, any localStorage bookmarks are merged into Supabase
  so the user never loses their saves.
*/

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, SUPABASE_CONFIG_VALID } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";

const LS_KEY = "bs_bookmarks";

function readLocalBookmarks() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalBookmarks(ids) {
  localStorage.setItem(LS_KEY, JSON.stringify(ids));
}

export function useBookmarks() {
  const user = useAuthStore((s) => s.user);
  const [bookmarkedIds, setBookmarkedIds] = useState(readLocalBookmarks);
  const [loading, setLoading] = useState(false);
  const hasMerged = useRef(false);

  // ── Fetch from Supabase when user logs in ──
  useEffect(() => {
    if (!user || !SUPABASE_CONFIG_VALID) return;

    let cancelled = false;

    async function fetchAndMerge() {
      setLoading(true);

      // 1. Fetch existing bookmarks from DB
      const { data, error } = await supabase
        .from("bookmarks")
        .select("project_id")
        .eq("user_id", user.id);

      if (cancelled) return;

      const dbIds = error ? [] : data.map((r) => r.project_id);

      // 2. Merge localStorage bookmarks into DB (only once per session)
      const localIds = readLocalBookmarks();
      const newIds = localIds.filter((id) => !dbIds.includes(id));

      if (newIds.length > 0 && !hasMerged.current) {
        hasMerged.current = true;
        const rows = newIds.map((id) => ({
          user_id: user.id,
          project_id: id,
        }));
        await supabase.from("bookmarks").upsert(rows, {
          onConflict: "user_id,project_id",
        });
      }

      // 3. Set combined state
      const combined = [...new Set([...dbIds, ...localIds])];
      if (!cancelled) {
        setBookmarkedIds(combined);
        writeLocalBookmarks(combined);
        setLoading(false);
      }
    }

    fetchAndMerge();
    return () => { cancelled = true; };
  }, [user]);

  // ── Keep localStorage in sync (always, for both auth states) ──
  useEffect(() => {
    writeLocalBookmarks(bookmarkedIds);
  }, [bookmarkedIds]);

  // ── Toggle a bookmark ──
  const toggleBookmark = useCallback(
    async (projectId) => {
      const isCurrentlyBookmarked = bookmarkedIds.includes(projectId);

      // Optimistic update
      setBookmarkedIds((prev) =>
        isCurrentlyBookmarked
          ? prev.filter((id) => id !== projectId)
          : [...prev, projectId]
      );

      // If logged in, persist to Supabase
      if (user && SUPABASE_CONFIG_VALID) {
        if (isCurrentlyBookmarked) {
          await supabase
            .from("bookmarks")
            .delete()
            .eq("user_id", user.id)
            .eq("project_id", projectId);
        } else {
          await supabase.from("bookmarks").upsert(
            { user_id: user.id, project_id: projectId },
            { onConflict: "user_id,project_id" }
          );
        }
      }
    },
    [bookmarkedIds, user]
  );

  return { bookmarkedIds, toggleBookmark, loading };
}
