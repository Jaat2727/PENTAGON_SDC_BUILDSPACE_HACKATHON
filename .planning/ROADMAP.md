# Roadmap: BuildSpace

**Created:** 2026-04-07
**Milestone:** v1.0 — SDC Hack Week Release
**Phases:** 7
**Requirements:** 30 mapped

## Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Landing Page Redesign | Bold dark-first visual overhaul | DSGN-01..05 | 5 |
| 2 | Database Schema Updates | Add missing columns and tables | DB-01..04 | 4 |
| 3 | Loading & Empty States | Skeleton loaders + empty states + auth flash fix | UX-01..05 | 5 |
| 4 | Collaboration Flows | Join project + apply to opportunity wiring | COLLAB-01..06 | 4 |
| 5 | Find My Team | Skill-based teammate discovery feature | TEAM-01..05 | 4 |
| 6 | Onboarding Modal | Post-signup 3-step onboarding flow | ONBD-01..05 | 3 |
| 7 | Demo & Sharing | Seed data script + profile sharing | DEMO-01..04 | 3 |

---

## Phase Details

### Phase 1: Landing Page Redesign
**Goal:** Transform the landing page into a dark-first, Linear/Vercel-aesthetic showpiece that wins the UI/UX 30% category
**UI hint**: yes
**Requirements:** DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05
**Depends on:** nothing
**Success criteria:**
1. Landing page has deep indigo (#0F0F23) background with animated gradient mesh hero
2. Typography uses Sora for body and Space Mono for code elements
3. Feature cards have glassmorphism effect with hover micro-animations
4. Social proof section shows live stats (projects, users, opportunities counts)
5. Footer has polished link groups with gradient accent elements

---

### Phase 2: Database Schema Updates
**Goal:** Add all missing database columns and tables needed by subsequent phases
**UI hint**: no
**Requirements:** DB-01, DB-02, DB-03, DB-04
**Depends on:** nothing
**Success criteria:**
1. `profiles.onboarding_complete` boolean column exists with default FALSE
2. `profiles.looking_for_team` boolean column exists with default FALSE
3. `feed_posts.likes` integer column exists with default 0
4. `opportunity_applications` table created with proper foreign keys and unique constraint

---

### Phase 3: Loading & Empty States
**Goal:** Eliminate all blank-screen moments with skeleton loaders, illustrated empty states, and auth flash fix
**UI hint**: yes
**Requirements:** UX-01, UX-02, UX-03, UX-04, UX-05
**Depends on:** nothing
**Success criteria:**
1. Feed, Projects, Opportunities, Search, Profile pages show animated skeletons while loading
2. Feed page shows SVG illustration + prompt when no posts exist
3. Projects page shows SVG illustration + "Create your first project" CTA when empty
4. Opportunities page shows SVG illustration + "Post an opportunity" CTA when empty
5. App shows full-screen branded spinner while authStore.loading is true (no flash of wrong content)

---

### Phase 4: Collaboration Flows
**Goal:** Wire up join-project and apply-to-opportunity actions with notifications
**UI hint**: yes
**Requirements:** COLLAB-01, COLLAB-02, COLLAB-03, COLLAB-04, COLLAB-05, COLLAB-06
**Depends on:** Phase 2
**Success criteria:**
1. "Request to Join" button visible on ProjectDetail for non-members
2. Clicking it inserts a pending project_members row and sends notification to owner
3. "Apply" button visible on OpportunityCard for logged-in non-applicants
4. Clicking it opens a message modal, then inserts into opportunity_applications and notifies poster

---

### Phase 5: Find My Team
**Goal:** Build the signature "Find My Team" feature — the creativity/innovation hook for judges
**UI hint**: yes
**Requirements:** TEAM-01, TEAM-02, TEAM-03, TEAM-04, TEAM-05
**Depends on:** Phase 2
**Success criteria:**
1. Profile settings has "Looking for team" toggle that persists to profiles table
2. Dedicated /find-team page accessible from main nav
3. User can select desired teammate skills from a tag picker
4. Results show matching profiles with skill overlap percentage, avatar, and "Invite" action

---

### Phase 6: Onboarding Modal
**Goal:** Guide new users through a 3-step onboarding flow to boost engagement
**UI hint**: yes
**Requirements:** ONBD-01, ONBD-02, ONBD-03, ONBD-04, ONBD-05
**Depends on:** Phase 2
**Success criteria:**
1. Modal appears after first login when `onboarding_complete` is false
2. Step 1: User picks skills from a multi-select tag cloud
3. Step 2: User sees option to create project or browse existing ones

---

### Phase 7: Demo & Sharing
**Goal:** Create demo data and add profile sharing for presentation polish
**UI hint**: no
**Requirements:** DEMO-01, DEMO-02, DEMO-03, DEMO-04
**Depends on:** Phase 2
**Success criteria:**
1. seed.sql creates 5 realistic profiles with Indian developer names and varied tech stacks
2. seed.sql creates 3 projects with members and 10 feed posts
3. Profile page has "Share" button using Web Share API with clipboard fallback

---

## Dependency Graph

```
Phase 1 (Landing)      ─── independent
Phase 2 (DB Schema)    ─── independent
Phase 3 (Loading/UX)   ─── independent
Phase 4 (Collab)       ─── depends on Phase 2
Phase 5 (Find My Team) ─── depends on Phase 2
Phase 6 (Onboarding)   ─── depends on Phase 2
Phase 7 (Demo/Share)   ─── depends on Phase 2
```

**Optimal execution order:** Phase 1 & 2 in parallel → Phase 3 → Phase 4 & 5 in parallel → Phase 6 → Phase 7

---
*Roadmap created: 2026-04-07*
*Last updated: 2026-04-07 after initial creation*
