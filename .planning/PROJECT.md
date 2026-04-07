# BuildSpace

## What This Is

BuildSpace is a developer collaboration platform built for IIT Madras SDC Hack Week. It connects builders who want to find teammates, launch side projects, and join hackathon squads. The platform features developer profiles, team project management, opportunity boards, and a real-time activity feed — all powered by React + Vite + Supabase.

## Core Value

Developers can discover compatible teammates and form project teams in under 2 minutes — the "Find My Team" skill-matching flow is the signature differentiator.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ React 18 + Vite scaffold with 10 routes — existing
- ✓ Supabase integration with auth (GitHub OAuth) — existing
- ✓ Developer profiles with avatar uploads — existing
- ✓ Project creation and listing with member management — existing
- ✓ Opportunity board with type filters and search — existing
- ✓ Real-time activity feed with quick-post — existing
- ✓ Notification system (realtime) — existing
- ✓ Global search across profiles/projects/opportunities — existing
- ✓ Settings page with profile editing — existing
- ✓ Dark/light mode toggle with Zustand — existing
- ✓ Zustand auth store with session persistence — existing
- ✓ Tailwind CSS v4 design system with custom tokens — existing
- ✓ Build passes at 37KB gzipped — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Landing page bold visual redesign (dark-first, Linear/Vercel aesthetic)
- [ ] Loading skeletons on all data-fetching components
- [ ] Empty states with illustrated prompts on feed, projects, opportunities
- [ ] Auth flash fix — loading state while authStore initializes
- [ ] Join request flow on ProjectDetail (insert project_members + notification)
- [ ] Opportunity apply flow (insert opportunity_applications + notification)
- [ ] "Find My Team" feature — skill-based teammate matching
- [ ] Onboarding modal after signup (3 steps: skills, project, feed post)
- [ ] Seed data script (seed.sql) with demo content
- [ ] Profile sharing via Web Share API with clipboard fallback

### Out of Scope

- Real-time chat — high complexity, not needed for hack week demo
- Mobile native app — web-only for this sprint
- Payment/monetization — not applicable for hackathon
- Email notifications — in-app only for MVP
- Admin dashboard — not needed for demo
- CI/CD pipeline — manual deploys for hackathon

## Context

- **Event:** IIT Madras SDC Hack Week
- **Evaluation criteria:** UI/UX Design (30%), Functionality (25%), Creativity & Innovation (20%), Technical Implementation (15%), Real-World Usefulness (10%)
- **Existing stack:** React 19 + Vite 8 + Tailwind CSS v4 + Supabase + Zustand + react-router-dom v7
- **Database tables:** profiles, projects, project_members, opportunities, feed_posts (realtime), notifications (realtime)
- **Design direction:** Dark-first, Linear/Vercel aesthetic. Deep indigo bg (#0F0F23), indigo accent (#6366F1), Space Mono for code tags, Sora for body text. Animated gradient mesh hero.
- **Build target:** Must pass `npm run build` after every change. Currently 37KB gzipped.
- **Code philosophy:** Do not refactor working code — only add and improve.

## Constraints

- **Timeline**: Hack week — every hour counts
- **Tech stack**: React + Vite + Tailwind CSS v4 + Supabase (locked)
- **Build size**: Must stay under 50KB gzipped
- **Code stability**: Never refactor working code — additive changes only
- **Build health**: `npm run build` must pass after every task

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark-first design with indigo palette | Judges score UI/UX at 30% — biggest single win | — Pending |
| "Find My Team" as creative hook | Creativity & Innovation is 20% — need a standout feature | — Pending |
| Sora + Space Mono typography | Modern, distinctive look that separates from default Tailwind | — Pending |
| Skip research phase | Brownfield project, user knows the domain completely | ✓ Good |
| YOLO mode with standard granularity | Hack week speed — no time for interactive review cycles | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-07 after initialization*
