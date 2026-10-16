# Issue 006: 375px checks on new lessons

## What is true right now

The layout audit (scripts/layoutCheck.js) checks horizontal overflow at 1440
and 375 pixels. It measures scrollWidth vs clientWidth on each screen. But
the check is only run on the main screens. When a new lesson is added, it is
not checked at 375px for overflow.

A new lesson might have content that fits at 1440px but overflows at 375px.
The audit does not catch it because the lesson is not in the SCREENS list.

## What I want

1. Add a new lesson to the layout check SCREENS list
2. Or add a generic check that walks all rendered screens
3. Document the 375px requirement for new content

## Why it matters

The app is used at 375px by someone. If the content overflows, they see a
horizontal scroll, which is a poor experience. This is a real user problem,
not a theoretical one.

## Notes

- The layout check uses real Chrome with Puppeteer
- The check measures scrollWidth - clientWidth at 375px
- The SCREENS list defines what screens are tested
- Adding a new lesson requires adding it to this list
