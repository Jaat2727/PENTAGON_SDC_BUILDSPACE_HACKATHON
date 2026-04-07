# Requirements: BuildSpace

**Defined:** 2026-04-07
**Core Value:** Developers can discover compatible teammates and form project teams in under 2 minutes

## v1 Requirements

Requirements for hack week release. Each maps to roadmap phases.

### Visual Design

- [ ] **DSGN-01**: Landing page uses dark-first design with deep indigo background (#0F0F23) and gradient mesh hero animation
- [ ] **DSGN-02**: Landing page uses Sora for body text and Space Mono for code tags
- [ ] **DSGN-03**: Landing page features section with glassmorphism cards, hover animations, and icons
- [ ] **DSGN-04**: Landing page includes social proof section with live stats (projects count, users count)
- [ ] **DSGN-05**: Landing page has polished footer with link groups and gradient accents

### Loading & States

- [ ] **UX-01**: All data-fetching pages show animated skeleton loaders while loading
- [ ] **UX-02**: Feed page shows illustrated empty state when no posts exist
- [ ] **UX-03**: Projects page shows illustrated empty state when no projects exist
- [ ] **UX-04**: Opportunities page shows illustrated empty state when no opportunities exist
- [ ] **UX-05**: Auth store shows a full-screen loading spinner while initializing (no auth flash)

### Project Collaboration

- [ ] **COLLAB-01**: User can request to join a project from the ProjectDetail page
- [ ] **COLLAB-02**: Join request inserts a pending row into project_members table
- [ ] **COLLAB-03**: Project owner receives a notification when someone requests to join
- [ ] **COLLAB-04**: User can apply to an opportunity from the OpportunityCard
- [ ] **COLLAB-05**: Apply action inserts into opportunity_applications table with optional message
- [ ] **COLLAB-06**: Opportunity poster receives a notification when someone applies

### Find My Team

- [ ] **TEAM-01**: User can mark themselves as "looking for team" on their profile
- [ ] **TEAM-02**: User can select skills they're looking for in teammates
- [ ] **TEAM-03**: System queries profiles to find compatible teammates with matching skills
- [ ] **TEAM-04**: Results show teammate cards with skills overlap, profile link, and invite action
- [ ] **TEAM-05**: "Find My Team" is accessible from the main navigation

### Onboarding

- [ ] **ONBD-01**: After first signup, user sees a 3-step onboarding modal
- [ ] **ONBD-02**: Step 1: User selects their skills from a tag picker
- [ ] **ONBD-03**: Step 2: User can create a project or browse existing ones to join
- [ ] **ONBD-04**: Step 3: User posts their first feed update
- [ ] **ONBD-05**: Onboarding sets `onboarding_complete = true` in profiles table

### Demo & Sharing

- [ ] **DEMO-01**: Seed data script (seed.sql) with 5 profiles, 3 projects, 10 feed posts
- [ ] **DEMO-02**: Seed data includes realistic Indian developer names and tech stacks
- [ ] **DEMO-03**: User can share their profile via Web Share API
- [ ] **DEMO-04**: Profile sharing has clipboard fallback with copy confirmation toast

### Database Schema

- [ ] **DB-01**: profiles table has `onboarding_complete` boolean column
- [ ] **DB-02**: profiles table has `looking_for_team` boolean column
- [ ] **DB-03**: feed_posts table has `likes` integer column
- [ ] **DB-04**: opportunity_applications table created with id, opportunity_id, applicant_id, message, created_at, and unique constraint

## v2 Requirements

Deferred to post-hackathon. Tracked but not in current roadmap.

### Social Features

- **SOCL-01**: User can like feed posts with animated heart
- **SOCL-02**: User can comment on feed posts
- **SOCL-03**: User can follow other developers

### Advanced Matching

- **MATCH-01**: AI-powered team recommendations based on complementary skills
- **MATCH-02**: Project compatibility scoring

### Polish

- **PLSH-01**: Email notifications for important events
- **PLSH-02**: PWA support for mobile install
- **PLSH-03**: Admin dashboard for moderation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time chat | High complexity, not needed for hack week demo |
| Mobile native app | Web-only for this sprint |
| Payment/monetization | Not applicable for hackathon |
| CI/CD pipeline | Manual deploys for hackathon |
| Admin moderation tools | Not needed for demo |
| OAuth providers beyond GitHub | GitHub is sufficient for developer audience |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| DSGN-03 | Phase 1 | Pending |
| DSGN-04 | Phase 1 | Pending |
| DSGN-05 | Phase 1 | Pending |
| DB-01 | Phase 2 | Pending |
| DB-02 | Phase 2 | Pending |
| DB-03 | Phase 2 | Pending |
| DB-04 | Phase 2 | Pending |
| UX-01 | Phase 3 | Pending |
| UX-02 | Phase 3 | Pending |
| UX-03 | Phase 3 | Pending |
| UX-04 | Phase 3 | Pending |
| UX-05 | Phase 3 | Pending |
| COLLAB-01 | Phase 4 | Pending |
| COLLAB-02 | Phase 4 | Pending |
| COLLAB-03 | Phase 4 | Pending |
| COLLAB-04 | Phase 4 | Pending |
| COLLAB-05 | Phase 4 | Pending |
| COLLAB-06 | Phase 4 | Pending |
| TEAM-01 | Phase 5 | Pending |
| TEAM-02 | Phase 5 | Pending |
| TEAM-03 | Phase 5 | Pending |
| TEAM-04 | Phase 5 | Pending |
| TEAM-05 | Phase 5 | Pending |
| ONBD-01 | Phase 6 | Pending |
| ONBD-02 | Phase 6 | Pending |
| ONBD-03 | Phase 6 | Pending |
| ONBD-04 | Phase 6 | Pending |
| ONBD-05 | Phase 6 | Pending |
| DEMO-01 | Phase 7 | Pending |
| DEMO-02 | Phase 7 | Pending |
| DEMO-03 | Phase 7 | Pending |
| DEMO-04 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after initial definition*
