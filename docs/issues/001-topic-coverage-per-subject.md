# Issue 001: Atlas topic coverage per subject

## What is true right now

The Atlas indexes 573 topics across nine subjects. Only philosophy has actual
entries written behind it - 88 topics. The other eight subjects have zero
written topics. Every unwritten topic shows as "not written yet" instead of
ending up on a half-finished page.

## What I want

Add a clear statement of what is written per subject. The Atlas should show,
for each subject:

- Total topics indexed
- Written topics
- Unwritten topics
- A "not written yet" notice for each unwritten topic

## Why it matters

Readers arrive at subjects other than philosophy and see a dead end. The
Atlas should tell them honestly that the content is missing, not pretend it
exists. This is about trust, not completeness.

## Notes

- The data files are already structured to support adding entries per subject
- The resolver pattern exists for routing topics to content
- This is a content problem, not a code problem
