# What to do next

This is a short list of the next fixes and improvements worth making, based on
reviewing both open pull requests ([#4](https://github.com/rj11io/defi-tech-task/pull/4)
and [#5](https://github.com/rj11io/defi-tech-task/pull/5)) side by side, running
their test suites, and trying both apps in a browser. See
[`JUDGE.md`](JUDGE.md) in this same folder for the full comparison.

## 1. Make local setup one command, not eight manual steps

Getting either branch running from a fresh checkout took much longer than it
should have. The database seed script (`npm run seed`, which creates the demo
login user) is a manual step that lives outside `docker compose up`, and one
branch needed an extra secret (`CHANGE_PASSWORD_SECRET`) added to `Api/.env`
that the sample env file doesn't mention. A new developer — or a fresh CI
runner — will hit the exact same wall.

**Do this:** have the API container run the seed and migration scripts
automatically the first time it starts against an empty database (a simple
"does the admin user already exist?" check before running them), and list
every required environment variable in the sample `.env` file with a one-line
comment on what each one is for.

## 2. Cap how many transactions a single request can return

Right now `GET /transactions` returns every entry for the requested month with
no server-side limit. For a single person's monthly diary this is harmless
today, but it means the API's response size scales directly with how long
someone has used the app — nothing stops it from becoming a multi-megabyte
response after a few years of daily entries.

**Do this:** add a page size limit (25–50 entries) with a `page` or `cursor`
parameter, matching the pagination headers that already exist in one of the
two implementations.

## 3. Shrink the first page load

Both apps warn during their production build that the Ant Design bundle is
large (over 1MB before compression). That's the component library loading
all at once on the very first screen, before someone has even logged in.

**Do this:** split the login screen from the main dashboard so each loads
its own code, and lazy-load anything not needed immediately (date pickers,
charts). This is a common Vite/React pattern (`React.lazy` + route-based
splitting) and shouldn't take more than an afternoon.

## 4. Finish translating every screen, not just most of it

One implementation translates almost the whole app into Italian but leaves
the transaction table's column headers ("Date", "Description", "Type",
"Amount", "Actions") and the row action labels hardcoded in English — even
though matching Italian text already exists and is used elsewhere on the same
page. This kind of thing is easy to miss by eye and easy to catch by machine.

**Do this:** add a small automated check (a script or test) that scans the
built app for any hardcoded English string that has a matching translation
key elsewhere in the codebase, and run it in CI so this class of bug can't
slip back in.

## 5. Add automated tests for the frontend

Both submissions have solid backend test coverage (140+ passing tests
covering the CRUD operations, ownership checks, and validation), but neither
has any automated frontend tests — everything on the UI side was verified by
hand in a browser. That's fine for a two-hour take-home exercise, but it
means every future frontend change has to be manually re-checked in a
browser to catch a regression.

**Do this:** add a handful of component tests for the add/edit/delete entry
flow and the login flow, using whatever testing library is already a
dependency of the chosen frontend (Vitest + Testing Library is the natural
fit for a Vite app).

## 6. Clear the outstanding dependency warnings

The dependency security scan in this repo
([`../security-dep-scan-report.md`](../security-dep-scan-report.md)) flags a
critical and several high-severity issues in the frontend's locked
dependencies (`form-data`, `react-router`). These predate both pull requests
— they come from the original starter template — but they're worth clearing
out before this becomes a real project rather than a take-home exercise.

**Do this:** run `npm audit fix` in `FrontEnd`, check nothing breaks, and if a
fix requires a breaking major-version upgrade, schedule that as its own
follow-up task rather than bundling it into an unrelated change.
