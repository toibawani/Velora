# Five open issues I could fix in a weekend

Checked on 18 October 2026 with `gh search issues --label "good first issue"
--state open --no-assignee`. Every issue below was open and unassigned on that
date. Labels and assignees change, so open the link and read the thread before
starting. If someone has claimed it since, say so in the thread and pick the
next one.

The point of this list is not the code. It is to get one pull request merged in
a project somebody else maintains, because a merged PR is the one line on my
profile that another person has vouched for.

---

## 1. jest-dom: document toBeVisible with details elements

- Project: [testing-library/jest-dom](https://github.com/testing-library/jest-dom)
- Issue: [#395](https://github.com/testing-library/jest-dom/issues/395), opened
  20 August 2021, 2 comments, labelled `bug` and `good first issue`
- What it asks: `toBeVisible()` handles `<details>` elements, but only when the
  text is wrapped in another element, because `isAttributeVisible` reads
  `previousElement`. Unwrapped text inside `<details>` throws
  `TypeError: Cannot read property 'nodeName' of undefined`. The README says
  nothing about either case and has no example.
- Why it is doable: the reporter wrote the diagnosis and the failing markup.
  The work is a documentation change plus one regression test using the exact
  snippet in the issue. No API change is required if the current behaviour is
  kept, and the issue says that is probably fine.
- Files: `README.md` (the `toBeVisible` section), `src/to-be-visible.js`,
  `src/__tests__/to-be-visible.js`
- First move: reproduce the TypeError against a `<details>` with bare text, then
  open a PR that documents the requirement and adds the example.

## 2. eslint-plugin-testing-library: a rule for configure called inside a test

- Project:
  [testing-library/eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library)
- Issue: [#997](https://github.com/testing-library/eslint-plugin-testing-library/issues/997),
  opened 19 March 2025, 3 comments, labelled `good first issue` and `new rule`
- What it asks: a new rule, proposed name `prefer-top-level-configure`, that
  fails when `configure()` from `@testing-library/react` (or dom) is called
  inside a test rather than at module top level. The issue includes passing and
  failing examples.
- Why it is doable: it is the repo's normal new-rule shape, with a helper that
  already detects Testing Library imports and test calls. A rule, a doc page,
  tests, and two registration lines. The issue author offered to review a PR.
- Files: `src/rules/` (pick a nearby rule such as `no-debugging-utils.ts` as the
  template), `src/create-testing-library-rule/`, `src/rules/index.ts`,
  `src/index.ts`, `docs/rules/`, `tests/lib/rules/`
- First move: comment on the issue with the rule name and the two examples you
  will test, then send the rule and docs in one PR.

## 3. react.dev: mention that Component.render can return an iterator

- Project: [reactjs/react.dev](https://github.com/reactjs/react.dev)
- Issue: [#286](https://github.com/reactjs/react.dev/issues/286), opened 14
  November 2017, 6 comments, labelled `good first issue`, `difficulty: medium`
  and `type: documentation`
- What it asks: the `Component` reference does not say that `render()` may
  return an iterator. It works in production but not in development unless the
  return value is iterable, which is the detail worth writing down.
- Why it is doable: one reference page, one or two paragraphs and an example.
  The linked React issue explains the constraint. The risk is overclaiming, so
  quote behaviour that the linked discussion establishes rather than inventing
  new API promises.
- Files: `src/content/reference/react/Component.md` (the `render` section)
- First move: read the linked facebook/react#11502 thread, then draft the two
  sentences in the issue before opening the PR.

## 4. a11yproject.com: audit the skip navigation article

- Project:
  [a11yproject/a11yproject.com](https://github.com/a11yproject/a11yproject.com)
- Issue: [#773](https://github.com/a11yproject/a11yproject.com/issues/773),
  opened 2 March 2023, 5 comments, labelled `post`, `good first issue` and
  `article audit`
- What it asks: the skip navigation article needs to be fleshed out, and the
  section about the JavaScript polyfill is out of date. This is an article
  audit, not just a typo pass.
- Why it is doable: it is one Markdown post with a known structure, and the
  site has a skip link implementation in the same repo to point at. The
  maintainers labelled it good first issue on purpose.
- Files: `src/posts/skip-nav-links.md`, and for the working example
  `src/_includes/nav/skipnav.njk` plus `src/css/components/_c-skipnav.scss`
- First move: read the audit checklist in the linked #669 discussion, then open
  a PR that updates the polyfill section and says what changed.

## 5. ARIA APG: replace the toolbar font menu with a select-only combobox

- Project: [w3c/aria-practices](https://github.com/w3c/aria-practices)
- Issue: [#2752](https://github.com/w3c/aria-practices/issues/2752), opened 14
  April 2020, no comments, labelled `good first issue` and `Practice Page`
- What it asks: the toolbar example uses a menu button to set the font family,
  which the APG's own combobox guidance says not to do. Change it to a
  select-only combobox and update the keyboard and role documentation for that
  control.
- Why it is doable: the example already contains a select-only combobox
  implementation to copy, the change is confined to one example, and the issue
  lists the three deliverables. It is more careful than clever, which is the
  right kind of first PR for a spec-adjacent repo.
- Files: `content/patterns/toolbar/examples/toolbar.html`,
  `content/patterns/toolbar/examples/js/FontMenu.js`,
  `content/patterns/toolbar/examples/js/FontMenuButton.js`,
  `content/patterns/toolbar/toolbar-pattern.html` (documentation section)
- First move: run the example with a keyboard only, write down the current
  behaviour, then mirror the select-only combobox example.

---

## How I would run one of these

1. Open the issue and check for an assignment or a "working on this" comment.
2. Comment with what you understand and the shape of your change. One short
   paragraph. Wait for a maintainer or a few days, whichever comes first.
3. Fork, branch, make the smallest change that satisfies the issue, and run the
   project's own tests and lint.
4. Add a test for behaviour, or a before/after note for documentation. A doc PR
   with no evidence of what was wrong is hard to review.
5. Open the PR with the issue number, what changed, how you checked it, and a
   screenshot for anything visual.
6. If the maintainers ask for changes, make them in the same PR. Do not open a
   second one.

Two extras if those are taken: a11yproject.com
[#940](https://github.com/a11yproject/a11yproject.com/issues/940) (expand and
collapse whole checklist sections) and
[#1478](https://github.com/a11yproject/a11yproject.com/issues/1478) (dead and
wrong links, which is exactly the check this repo needed too). Both were open
and unassigned on 18 October 2026.
