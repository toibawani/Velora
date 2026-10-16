# Design Decisions

These are the choices I made while building Velora, what I rejected, and why.
Short entries. Written in my voice. No buzzwords.

---

## No backend and localStorage behind one versioned registry

**What I chose:** The whole app runs in the browser. Content comes from files
in this repository. I do not run a server, I do not ask for accounts, and I do
not send anything anywhere. All state lives in localStorage under the key
`velora_*`.

**Why:** I tutor kids. They use this on shared school iPads. If there were a
backend, they would need a school account or a phone number. They have neither.
The "free reference book" model only works if anyone can open it, in five
seconds, without signing up.

**What I rejected:** A Supabase backend with Row Level Security, as hinted at in
the old README. I deleted it. A database costs money, needs maintenance, and
teaches the wrong lesson: that learning requires an account.

**Which registry:** I did not write one. The content is a flat directory. Each
file is one unit. If you want to add a topic, you open one file. If you want to
check the data, you read the file. The registry is the filesystem.

---

## Honest "not written yet" states instead of stub content

**What I chose:** Every Atlas topic that has not been written shows as "not
written yet". It does not open a half-finished page. It does not show a red
warning like a real error. It shows a simple, honest notice.

**Why:** A stub page teaches you to trust the site before you have earned that
trust. A "not written yet" page is a promise that something will be added,
and it is visible in the index so nobody thinks it is a bug when it is not.

**What I rejected:** Placeholder text that says "Coming soon" or "TBD". That is
a way of charging for something you have not made. Fake content is worse than
no content. It looks finished, so a reader thinks it is real.

---

## Why the tests are proven to fail

**What I chose:** The tests are written so they can fail. When a test checks
that a topic resolves to real content, it fails if the topic is dead. When a
test walks every screen in Chrome, it fails if any console error appears. When
a contrast check runs, it fails if any token drops below AA.

**Why:** A test that cannot fail is not a test. It is a print statement with a
pass mark. The contrast gate was proven to fail by forcing one token below AA
and watching CI go red. The atlas audit was proven to fail by tapping a topic
and watching the real app return nothing. The game audit was proven to fail by
breaking a selector and watching the games screen navigate away.

**What I rejected:** Tests that only check that you can render a component.
That proves the component renders, not that it works.

---

## Why the npm 10 lockfile

**What I chose:** The lockfile is generated with npm 10, not npm 8.

**Why:** `npm ci` installs exactly what is in the lockfile. If the lockfile is
from npm 8, `npm ci` on npm 10 will fail. The lockfile is a contract between
the package manager and the machine. npm 10 changed internal defaults and I
wanted a lockfile that does not surprise anyone who runs `npm ci` on a clean
machine.

**What I rejected:** Editing the lockfile by hand. It is generated. If you edit
it, you get a lockfile that does not match the code.

---

## Why the printed-index Atlas instead of cards

**What I chose:** The Atlas lists topics by subject, alphabetically. Each topic
is a row in a table-like index. You click a topic to open it.

**Why:** Cards are for browsing. The Atlas is for looking up. You do not
"browse" through 573 topics. You search for a specific thing and you want it
formatted consistently, every row the same width, every letter the same size.

**What I rejected:** A card grid. Cards take more vertical space, they wrap
differently at 375px, and they make a search result look like a gallery rather
than a list.

---

## Why no fake streaks, leaderboards or fake community

**What I chose:** No streaks. No daily login rewards. No leaderboards. No
comments, no likes, no upvotes, no avatars, no profiles.

**Why:** Streaks measure attendance, not learning. A kid who does 5 problems in
a row for a month has learned nothing. A leaderboard tells kids they are
"good at learning" or "bad at learning" based on speed and repetition, which
is exactly the opposite of what we want. Fake community means fake people
talking to each other, which is worse than no community at all. It teaches kids
that the internet is full of bots pretending to be people.

**What I rejected:** Gamification that rewards showing up rather than
understanding.

---

## What the status labels mean

**What I chose:** Each black hole and deep read entry has one of three labels:

- `Well-established` — direct measurement, or a prediction confirmed to many
  digits. The information paradox is not this.
- `Theoretical` — a coherent model with no direct test yet. The theory of
  relativity is this.
- `Unknown / contested` — active disagreement between competent people. The
  firewall debate is this.

**Why:** If you write about black holes, you have to be honest about what is
settled and what is not. A level about Hawking radiation is well-established.
A level about the singularity is theoretical. A level about the information
paradox is contested. Those are different kinds of knowledge and they deserve
different labels.

**What I rejected:** A single "reading level" rating that mixes accuracy with
difficulty. A topic can be hard and well-established. The label is about the
claim, not the reader.

---

## What the status labels mean (cont.) — the user counts

**What I chose:** Every count in the README comes from a script, not from my
memory. Run `node scripts/by-the-numbers.js` and you get the numbers. The
script reads the data files and prints the counts. It does not estimate.

**Why:** A recruiter can check the numbers by running the script. If I type
them by hand, I can make a mistake. If I read them from the data, the numbers
are the data.

**What I rejected:** A separate JSON file with statistics. That file would be
typed by hand and could drift from the app. The script reads the source of
truth and prints it.

---

## One more thing

There is more. More subjects still unwritten. More levels to write. More games
to make into actual products instead of content audits. This is a living
document and it will change as the app changes.
