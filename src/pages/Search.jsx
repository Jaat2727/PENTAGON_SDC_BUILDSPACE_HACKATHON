/*
  Search.jsx
  ----------
  Global search page. Debounced input searches across
  people, projects, and opportunities simultaneously.
  Results are shown in tab groups.
*/

import { Link } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import PageWrapper from "../components/layout/PageWrapper";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { HiOutlineSearch } from "react-icons/hi";
import { useState } from "react";

export default function Search() {
  const { query, results, loading, handleChange } = useSearch();
  const [tab, setTab] = useState("people");

  const tabs = [
    { key: "people",        label: "People",        count: results.people.length },
    { key: "projects",      label: "Projects",      count: results.projects.length },
    { key: "opportunities", label: "Opportunities", count: results.opportunities.length },
  ];

  const totalResults = results.people.length + results.projects.length + results.opportunities.length;

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-heading dark:text-white mb-6">Search</h1>

      {/* search bar */}
      <div className="relative max-w-xl mb-8">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search people, projects, or opportunities…"
          className="w-full rounded-xl border border-border dark:border-slate-600 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
          autoFocus
        />
      </div>

      {/* tabs */}
      {query && (
        <div className="flex gap-1 mb-6 border-b border-border dark:border-slate-700">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer -mb-px " +
                (tab === t.key
                  ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400"
                  : "text-muted hover:text-heading dark:hover:text-white")
              }
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      )}

      {/* loading state */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {/* results */}
      {!loading && query && (
        <>
          {totalResults === 0 && (
            <p className="text-center py-12 text-muted">No results for "{query}"</p>
          )}

          {/* people tab */}
          {tab === "people" && results.people.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.people.map((p) => (
                <Link
                  key={p.id}
                  to={`/u/${p.username || p.id}`}
                  className="rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <Avatar src={p.avatar_url} name={p.display_name} size="md" />
                  <div>
                    <p className="font-medium text-heading dark:text-white">{p.display_name}</p>
                    <p className="text-xs text-muted">@{p.username}</p>
                    {p.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.skills.slice(0, 3).map((s) => (
                          <Badge key={s} color="slate">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* projects tab */}
          {tab === "projects" && results.projects.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-heading dark:text-white">{p.title}</p>
                    <Badge color={p.status === "open" ? "green" : "red"}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-body dark:text-slate-400 line-clamp-2">{p.description}</p>
                </Link>
              ))}
            </div>
          )}

          {/* opportunities tab */}
          {tab === "opportunities" && results.opportunities.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.opportunities.map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-md transition-shadow"
                >
                  <Badge color="brand" className="mb-2">{o.type}</Badge>
                  <p className="font-medium text-heading dark:text-white">{o.title}</p>
                  <p className="text-sm text-body dark:text-slate-400 line-clamp-2 mt-1">{o.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* empty state before searching */}
      {!query && (
        <div className="text-center py-16 text-muted">
          <p className="text-lg">Start typing to search across BuildSpace</p>
        </div>
      )}
    </PageWrapper>
  );
}
