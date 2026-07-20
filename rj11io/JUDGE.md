# Judging the two pull requests

This compares the two open submissions for the expense/income diary task —
[PR #4](https://github.com/rj11io/defi-tech-task/pull/4) and
[PR #5](https://github.com/rj11io/defi-tech-task/pull/5) — and says which one
to merge.

The judging combined three things: reading every changed file in both
branches, running each branch's own test suite, and standing up each app in
Docker to log in and add real transactions in a browser. The live check
matters because a pull request description can claim "verified in browser" —
actually clicking through the app is the only way to catch things like a
button that silently fails, or a form field that stays in English when the
rest of the page is translated.

## Scorecard

| | PR #4 — "add income and expense diary" | PR #5 — "complete expense and income diary" |
|---|---|---|
| Tech implementation | 9 / 10 | 9 / 10 |
| Code quality | 8 / 10 | 9 / 10 |
| UI / UX | 8 / 10 | 9 / 10 |
| Style & design | 7 / 10 | 9 / 10 |

Both submissions clear the core bar the task asked for: full create, read,
update, delete for transactions, each one scoped so a user can only see and
edit their own entries, and a real backend test suite (145+ tests passing in
both). The difference is in how much further each one went, and in a couple
of concrete bugs found by actually using the app.

## PR #4 — add income and expense diary

**What it does well:**
- Ownership is enforced at the database query level everywhere (a lookup for
  someone else's entry returns "not found," not "forbidden" — this avoids
  telling an attacker that a record exists at all).
- Money is stored as whole cents internally, with input validated by pattern
  before conversion, which avoids floating-point rounding errors on amounts
  like €0.29.
- It fixed a real, pre-existing security bug in the login system: a
  password-reset link's token could previously be reused as a normal login
  token. This submission separated the two so one can't be swapped for the
  other.

**What's wrong with it:**
- The transaction table's column headers ("Date," "Description," "Type,"
  "Amount," "Actions") stay in English even after switching the app to
  Italian — even though the Italian text for those exact words already
  exists and is used elsewhere on the same page. This was confirmed live in
  the browser, not just in the code.
- The dependency lockfile still carries a critical and several high-severity
  security warnings (flagged in [`SECURITY.md`](SECURITY.md)) that were not
  addressed.
- No inline comments on non-obvious logic (the cents-conversion trick, for
  example), despite the task specifically asking for commented code.

## PR #5 — complete expense and income diary

**What it does well:**
- A visibly more finished product: its own name and branding ("Daybook"), a
  proper landing/login screen with real marketing copy instead of a bare
  form, and a dashboard with four summary cards including a savings-rate
  meter, plus a live "spending by category" breakdown that updates the
  moment a new expense is added.
- Zero dependency vulnerabilities in its production audit — the security
  warnings present in #4's lockfile are cleared here.
- Tighter Docker setup: the database's network port isn't exposed to the
  host machine anymore, containers wait for each other to report healthy
  before starting, and package installs use a named Docker volume instead of
  writing directly into the shared project folder (this avoids the classic
  problem of a Mac-installed dependency silently breaking inside a Linux
  container).
- Fixed several more pre-existing security gaps in the login system beyond
  what #4 touched: a "forgot password" request no longer reveals whether an
  email address exists in the system, password-reset links can only be used
  once, and changing a password now invalidates any other device's existing
  login session.

**What's wrong with it:**
- No server-side limit on how many transactions a single request can return
  — harmless today for one person's monthly list, but worth capping before
  this scales past a demo.
- Same as #4: the frontend has no automated tests of its own; everything on
  the UI side was checked by hand.

## Decision: merge PR #5

Both are competent, tested submissions — neither is a weak entry. But #5 is
ahead on every axis that separates "meets the requirements" from "ready to
build on": a more complete and polished interface, tighter security posture,
and a Docker setup that won't trip up the next person who clones the repo.
#4's money-handling code and its JWT-token fix are both worth keeping in mind
for later — they're clean, focused pieces of work — but as a whole, #5 is the
stronger foundation.

Concrete next steps for whichever branch lands are in
[`FUTURE.md`](FUTURE.md) in this same folder.
