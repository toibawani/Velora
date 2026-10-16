# Issue 003: Only a few dictionary entries marked verified

## What is true right now

The Curious Dictionary has 138 entries across nine subjects. Each entry has
a `verified` flag that is absent by default. The verified flag means the
entry has been read back against the source and checked for accuracy.

Right now, very few entries have this flag. The flag is the editorial signal
that says "I read this book, I checked this claim, I am confident in this".

## What I want

1. Add a process for verifying dictionary entries
2. Track which entries are verified and which are not
3. Show the verified status on the entry page

## Why it matters

The dictionary is a reference work. It should be accurate. A verified entry
is one I checked against its source. An unverified entry is one I wrote from
other sources. Both are useful, but they should be labeled differently.

## Notes

- The DictionaryTerm type has a `verified` boolean field
- The console renders a caution for unverified entries
- This is an editorial workflow, not a code problem
