# How this repository was built

This is the step-by-step log of everything that was done to turn the bare
starter template into the finished, judged submission in this repo — from
the first security check, through fixing what the template got wrong,
to having two AI models build the feature independently and a third one
judge the results.

## 1. Checked the template for security problems before installing anything

Before running a single `npm install`, the repository was cloned and scanned
for known vulnerabilities and supply-chain risk in its dependencies — using
the [`11ai-security-dep-scan`](https://ai.rj11.io/skills/11ai-security-dep-scan)
skill. Nothing was installed or executed during this pass; it only reads
manifests and lockfiles and checks them against public vulnerability
databases. The results are in [`SECURITY.md`](SECURITY.md).

## 2. Checked what that scan cost

Every step in this pipeline runs through an AI model, and AI usage has a
real cost in tokens (the units an AI model is billed by) and dollars. The
[`llm-costs`](https://ai.rj11.io/plugins/llm-costs) plugin measured what the
security scan itself cost, before moving on to the rest of the work.

## 3. Set up the toolbox

The repository was initialized with a suite of AI skills and plugins —
pre-built playbooks that give the AI assistant a reliable, repeatable way to
do common tasks instead of improvising each time:

| Tool | What it's for |
| --- | --- |
| [`llm-costs`](https://ai.rj11.io/plugins/llm-costs) | Tracks how many tokens and how much money each AI session uses. |
| [`11ai-modern-clean-ui`](https://ai.rj11.io/skills/11ai-modern-clean-ui) | Guidance for building interfaces in the clean, minimal style used by products like Linear and Vercel. |
| [`11ai-automated-releases`](https://ai.rj11.io/skills/11ai-automated-releases) | Sets up automatic version numbers and changelogs generated from commit messages. |
| [`aws-operations`](https://ai.rj11.io/plugins/aws-operations) | Playbooks for common AWS cloud tasks, with safety checks before anything risky. |
| [`docker-operations`](https://ai.rj11.io/plugins/docker-operations) | Playbooks for building, running, and cleaning up Docker containers (self-contained boxes that run the app the same way on any machine). |
| [`antdesign-operations`](https://ai.rj11.io/plugins/antdesign-operations) | Reference guides for Ant Design, the component library the frontend is built with. |
| [`git-operations`](https://ai.rj11.io/plugins/git-operations) | Playbooks for everyday Git tasks — branches, commits, stashing, recovering lost work — with safety checks before anything destructive. |
| [`jest-operations`](https://ai.rj11.io/plugins/jest-operations) | Playbooks for running and debugging the project's automated tests. |
| [`mongodb-operations`](https://ai.rj11.io/plugins/mongodb-operations) | Playbooks for querying and maintaining the project's MongoDB database. |
| [`nodejs-api-operations`](https://ai.rj11.io/plugins/nodejs-api-operations) | Playbooks for building and testing the Node.js backend API. |
| [`security`](https://ai.rj11.io/plugins/security) | Playbooks for scanning dependencies and reviewing code for security issues. |
| [`11ai-code-quality`](https://ai.rj11.io/skills/11ai-code-quality) | A structured pass for cleaning up code — better names, less duplication, clearer comments. |
| [`super`](https://ai.rj11.io/plugins/super) | A bundle of broad clean-up passes — bug-fixing, performance, security, documentation, UX — run near the end of a task. |

## 4. Wrote the instructions the AI would follow

An [`AGENTS.md`](../AGENTS.md) file was written at the root of the repo. This
is the standing brief every AI assistant working in this repo reads first —
it says to build a well-structured, Ant Design–themed app, to do a full
polish pass (code quality, bugs, UI, UX, performance, security) before
calling anything done, to keep new documentation in the `rj11io/` folder
instead of touching the original README, and to open a pull request with an
adversarial review from three separate reviewing passes before wrapping up.

## 5. Set up automatic releases and changelogs

Using the automated-releases skill from step 3, the repo was wired so that
every commit written in the [Conventional Commits](https://www.conventionalcommits.org/)
style (a standard format like `fix: ...` or `feat: ...`) automatically
produces the right version bump and a generated changelog entry, with no
manual release step.

## 6. Ran the untouched starter template to see what actually worked

Before changing any code, the original template's own `Api` and `FrontEnd`
folders were installed with `npm install`, its demo database was seeded, and
the whole thing was run in Docker — purely to observe its starting state
with fresh eyes, before any task-specific work began.

## 7. Found — and fixed — a template that didn't actually work

That inspection turned up a real problem: the starter template reported a
network error on login and its own test suite was broken out of the box.
Before any candidate work could begin, the following had to be fixed:

- **Replaced fake login data with a real one.** The template's login was
  backed by mock data instead of real accounts. It now uses actual user
  records stored in MongoDB, real JWTs (JSON Web Tokens — a signed pass a
  server hands you after login that proves who you are without checking
  the database on every request), and refresh tokens that are actually
  saved, so a login survives a server restart instead of vanishing.
- **Fixed the broken auth flows.** The code that checks whether a request
  is logged in, plus the forgot-password, sign-up, and sign-in flows, were
  not working correctly and needed real fixes.
- **Fixed Docker networking.** The API container and the database container
  were failing to reach each other correctly inside Docker, and the
  environment settings controlling that connection were wrong.
- **Fixed the demo-data scripts.** The scripts that create the demo login
  user and reset the database were not setting things up correctly.
- **Fixed a permissions bug.** The role-based permission system (RBAC —
  the part of the app that decides what each user is allowed to do) was
  mixing up user and company IDs.

The result was verified directly: **140 out of 140 backend tests pass**,
and the frontend builds successfully.

## 8. Built the feature twice, independently, with two AI models

With a genuinely working starting point, a separate Git branch was created
for each of two AI model configurations:

1. `codex-gpt5.6-sol-high/complete-tech-task`
2. `codex-gpt5.6-luna-high/complete-tech-task`

Each one was given the identical instruction — *"review the codebase and
follow the instructions on `AGENTS.md` to complete the tech task"* — and
worked completely independently, with no visibility into what the other one
produced. Each opened its own pull request.

## 9. Had a third AI model judge both results

[Claude Sonnet 5](https://www.anthropic.com/), run at high reasoning effort,
was asked to *"review the codebase and both open PRs and judge and score
them based on tech task implementation, UI/UX, code quality, style and
design, and which one would you choose to merge. Also write what would be
your immediate improvements for the near future."*

That review read every changed file in both branches, ran each branch's own
test suite, and used both apps live in a browser before scoring them and
picking a winner. The full write-up is in [`JUDGE.md`](JUDGE.md), and the
resulting near-term follow-up list is in [`FUTURE.md`](FUTURE.md).

## 10. Audited the total cost of the whole pipeline

Finally, the [`11ai-llm-cost-project`](https://ai.rj11.io/plugins/llm-costs)
skill added up the AI usage cost for every step above, from the very first
security scan through the final judging pass. The full breakdown is in
[`LLM_COST.md`](LLM_COST.md).
