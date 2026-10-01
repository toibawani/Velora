# VELORA Viral Content Strategy & PR Playbook

> **Purpose:** A comprehensive growth framework for spreading VELORA organically across student communities, academic Twitter/X, Reddit, LinkedIn, and YouTube — without paid advertising.

---

## Read this before you use any of this

VELORA has no backend. Everything a user does lives in that one browser, and the
app cannot know who else is using it. That constrains this document more than
anything else in it, so the rules come first.

**Three categories, and they are not interchangeable:**

| Category | What it means | Can it ship today? |
|---|---|---|
| **Device-local** | Uses only what this device already holds — the learner's own questions, notes, progress, and the name they chose for this browser | Yes |
| **Backend-dependent** | Needs a server: referrals, entitlements, certificates that mean anything, cross-user comparison | No — blocked on a backend project |
| **Unverifiable** | Requires a number the app cannot produce: "1,400 students use this", peer counts, global rankings | Never, as a claim |

**The hard rule.** No feature may display a number the app did not compute from
this device's own data, and no document may claim a user count, ranking or
credential the app cannot verify. A leaderboard with invented rows, a "refer 3
friends" flow with no referral tracking, or a "verified credential" issued by a
client-side page are not marketing copy; they are lies the user cannot detect,
which makes them worse than no feature.

Everything below is marked with its category. Items marked **backend-dependent**
are kept as design intent for whoever builds the server, not as work that can be
pulled from this repository today.

---

## 🎯 Core Viral Thesis

VELORA grows when **learning itself becomes shareable**.

| Feature | Shareability Mechanism | Category |
|---|---|---|
| Certificate of Mastery | LinkedIn profile addition → professional network reach | **backend-dependent** — a self-issued certificate means nothing to a recruiter, and should not be described as "verified" without an issuer |
| Achievement Badge | WhatsApp / X viral share with pre-filled text | **device-local** — the badge is derived from the learner's own progress, and sharing an image of it is honest |
| Referral System | 7-day Pro Preview as tangible gift to a friend | **backend-dependent** — an entitlement cannot exist without a server to grant and track it |
| Community Discussion | "This explanation finally made X click for me" — screenshot-worthy moments | **device-local, reframed** — VELORA's Community screen is a private question desk. There are no peers in it. Share your own notes; do not describe them as other learners' |
| Daily Spark | Single beautiful question → share the curiosity | **device-local** |

---

## 📣 Channel Playbook

### 1. Academic Twitter / X

**Target accounts to get noticed by:**
- @Sean_Carroll (physicist, podcast host) — tag with physics simulation posts
- @3blue1brown — share VELORA's interactive tensor equation explanations
- @exurb1a — philosophical discussions match his audience perfectly

**Content cadences:**
- **#VeloraQuestion of the Day** — post a single intellectually provocative question with a short answer teaser
- **Thread series: "What schools never taught you about [topic]"** — 8-tweet threads that link back to VELORA's deep-dive modules
- **Behind the learning** — screenshots of the black hole canvas simulation to generate curiosity

**Ideal tweet format:**
```
Most people learn that black holes "pull" things in.

Here's what actually happens ↓

[Canvas simulation screenshot]

[Thread of 5 tweets with Schwarzschild radius, light cones, Penrose diagrams]

Full interactive exploration on VELORA 🌌 [link]
```

---

### 2. Reddit Strategy

**Target subreddits:**
- r/Physics (1.7M) — post simulation explainers as OC (Original Content)
- r/philosophy (4.2M) — anonymous Socratic debate threads
- r/learnmath — interactive proof walkthroughs
- r/india / r/JEENeet — direct student audience for NCERT + JEE alignment features
- r/neuroscience — share the spaced repetition + forgetting curve methodology

**Reddit content format rules:**
- Never post as "our app does X" — always post as "I made something that helped me understand X"
- Screenshot the actual UI — visual posts get 4x more upvotes than text-only
- Respond to every comment within 2 hours on launch posts

**Ideal Reddit post template:**
```
Title: "I spent 3 hours animating how the event horizon actually works [OC]"

Body: I've always struggled to visualize why nothing can escape a black hole — not even light. 
Most explanations just say "the escape velocity exceeds c" which doesn't actually help you understand it.

So I built this [simulation] — it shows light cones tipping past vertical as you approach the Schwarzschild radius.

[GIF of canvas simulation]

Happy to explain any of the physics in the comments.
```

---

### 3. YouTube / Video Strategy

**Format: 8-minute "Understanding [topic] from first principles" videos**

- **Episode 1:** "How Einstein proved space literally curves (no equations)"
- **Episode 2:** "Why Socrates claimed he was the wisest man in Athens by knowing nothing"
- **Episode 3:** "The telescope that showed us a black hole for the first time"

Each video ends with: "I built an interactive version of this on VELORA — link in bio."

**SEO-optimized titles:**
- "Why black holes don't actually 'suck' (the real physics)"
- "Understanding general relativity without a PhD"
- "The Socratic method: how to argue without being wrong"

---

### 4. LinkedIn Strategy

**Target audience:** Recent graduates, professionals wanting to reskill, educators

**Content types:**
1. **Certificate posts** — "I just earned a verified credential in Astrophysics & General Relativity on VELORA" → 1-click LinkedIn share from certificate modal
   **backend-dependent, and blocked on wording as well as infrastructure.** Do not publish this line until a certificate is issued and verifiable by someone other than the learner. A client-side certificate labelled "verified" is a false claim, and it is the kind that survives contact with a sceptical recruiter.
2. **Thought leadership** — "Education is broken because it optimizes for exam grades, not intellectual depth. Here's what real learning looks like."
3. **Educator testimonials** — Teachers sharing VELORA lesson plans from the InstitutionalMode educator portal
   **device-local**, provided the words come from an educator who actually used it. Do not stage quotes.

---

### 5. WhatsApp / Indian Market Strategy

**Key insight:** 60%+ of student discovery in India happens via WhatsApp group shares

- Design shareable Daily Spark cards as images (800×800 PNG with black background + question text) — **device-local**
- Enable WhatsApp share on every achievement modal — **device-local**
- Create "Study Squad" flow: refer 3 friends → unlock a shared group learning sprint — **backend-dependent.** The app cannot count referrals, grant an entitlement, or know that three people exist. Shipping this as a client-side counter would mean showing a fake progress bar, so it stays here as design intent until a server exists.

**Referral message template (auto-generated) — backend-dependent. Do not generate referral links yet.**
```
Hey! I've been learning astrophysics & philosophy on this app called VELORA — 
it's completely different from anything else I've tried (no boring videos). 
Use my link to get 7 days of Pro free 🌌

[referral link]
```
Until a backend exists there is no Pro tier and no link to put in that slot.
A share message promising something the app cannot deliver is the exact failure
this document is trying to prevent. The honest device-local version shares what
the learner actually did:
```
I've been working through black holes and Nietzsche on VELORA (physics, philosophy, history — no account needed, everything stays in your browser).
```

---

## 🗞️ PR & Press Templates

### Press Release Framework

**Headline formula:** "[A claim you can actually evidence] — VELORA is [differentiator]"

**Example that is safe to publish today:**
> "VELORA is a browser-based learning space for physics, philosophy and history — with no account, no sign-up and no server. Everything a learner writes down stays on their own device."

**Example that is not:**
> "1,400 students are exploring black holes, Socratic philosophy, and ancient history through visual simulations — and none of them call it homework"

That line was in this document until now, and nothing in VELORA can produce
"1,400 students". There is no server, no analytics endpoint and no user count
anywhere in the codebase. Publishing it would be a fabricated claim in a press
release, which is the worst place for one. If a real number is ever needed, it
has to come from a real measurement — and today there is nothing to measure.

**Target publications:**
- YourStory.com (Indian startup press)
- EdSurge (global edtech journalism)
- The Marginalian (Maria Popova — intellectual curiosity audience)
- Wired Education section
- TechCrunch Education

**Pitch angle:** 
The story isn't "education app launches." The story is: **"What happens when you design learning for intellectual pleasure instead of exam performance?"**

---

### Journalist Pitch Template

```
Subject: A student just spent 8 hours learning about black holes — voluntarily

Hi [Name],

I want to share something counterintuitive with you: in an era of 60-second attention spans, 
we have students spending 4-8 hours voluntarily exploring astrophysics and Socratic philosophy.

VELORA is an educational platform we built on a simple bet: 
learning is intrinsically compelling when the design respects the learner's intelligence.

No gamification. No streaks. No push notifications. Just deeply immersive visual exploration.

I think this is a story your readers would find genuinely interesting — particularly the 
contrast with how most edtech is built (dopamine loops vs. genuine understanding).

Happy to share early access + a demo if you'd like to explore.

Best,
Toiba Wani
Founder, VELORA
toibawani14@gmail.com
```

---

## 📊 Launch Day Checklist

- [ ] Post first Daily Spark on Twitter/X with full visual
- [ ] Submit to ProductHunt (schedule for Tuesday 12:01am PST)
- [ ] Post on r/Physics, r/philosophy simultaneously
- [ ] Send personalized DMs to 20 academic Twitter accounts
- [ ] Email 5 journalists with the pitch template above
- [ ] Share in 10 relevant Discord servers (learning communities)
- [ ] Post the black hole canvas simulation as a GIF on all platforms
- [ ] Activate the referral system — share your own code publicly
      **blocked, backend-dependent.** There is no referral tracking and no Pro tier to grant. Replace this line with: *share a Daily Spark card or your own progress screenshot.*

---

## 🌱 Long-Term Growth Flywheel

The flywheel as originally written assumed a certificate, a referral link and a Pro
tier. None of those exist, so the original diagram is kept here only to show what
was assumed:

```
User learns deeply
    ↓
User earns verifiable certificate      ← backend-dependent: nothing verifies this
    ↓  
User shares on LinkedIn → Network sees VELORA
    ↓
New user signs up via referral link → Gets 7-day Pro   ← backend-dependent
    ↓
New user has deep learning experience
    ↓
New user shares achievement badge → Virality continues
```

The loop that actually works with no server:

```
Learner explores something worth talking about
    ↓
They write their own question and notes          ← the question desk, on their device
    ↓
They share that, or a Daily Spark, or their progress screenshot   ← their words, their work
    ↓
Someone else finds the app, spends no time on a sign-up form       ← there is no sign-up
    ↓
They reach their own first "oh, that's why"
```

**The core thesis, unchanged:** the product is the marketing. What changed is
that each step now says something the app can be held to.

---

## Backend-dependent backlog

None of this is in the repository, and none of it can be until a server exists:
referral tracking and entitlements; certificates an outside party can verify; any
cross-user feature at all, including leaderboards, peer comparison and comments;
and real usage analytics, which is what would finally make a press statistic
honest.

---

*Last updated: August 2026 | Maintained by: VELORA Growth Team*
