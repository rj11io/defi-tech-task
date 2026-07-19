# Completed tech task

## Outcome

The starter repository is now a complete authenticated expense and income diary. Users can create, view, search, filter, edit, and delete their own entries, with an accurate monthly overview and responsive Ant Design interface.

## Product implementation

- Added owner-scoped transaction CRUD endpoints and MongoDB model.
- Stored monetary values as validated integer cents.
- Added income/expense types, constrained categories, descriptions, notes, dates, timestamps, and stable sorting.
- Added complete API integration coverage for authentication, lifecycle behavior, malformed input, cross-user isolation, filters, and months exceeding 500 entries.
- Built monthly income, expense, balance, savings-rate, and category summaries.
- Built responsive table and mobile list views with search, type filters, pagination, stable row keys, confirmation, and accessible actions.
- Built a single typed Ant Design drawer form for create and edit flows, including inline server errors and first-invalid-field focus.
- Added loading, retryable error, empty, success, and destructive-action feedback.
- Added polished login, header, account menu, demo access guidance, light/dark themes, and responsive layouts.

## Engineering and hardening

- Enforced authentication and ownership on every transaction operation.
- Added strict AJV body and query schemas that reject unexpected fields.
- Added security headers, explicit CORS behavior, body limits, and rate limiting.
- Removed fallback JWT secrets and hardened cookie behavior for staging/production.
- Made password-reset tokens persisted, purpose-bound, single-use, atomically consumed, and resistant to replay across restarts or multiple instances.
- Added real recovery-email invocation, non-enumerating recovery responses, invitation activation coverage, explicit password hashing, and refresh-session revocation.
- Fixed refresh-interceptor cleanup, failed-refresh state, and shared-promise recovery in the frontend.
- Replaced host-shared Docker dependencies with platform-correct named volumes and deterministic `npm ci` startup.
- Added Docker health checks, service dependency ordering, an exact MongoDB image tag, internal-only MongoDB networking, and enabled API throttling.
- Upgraded the frontend to Vite 8 and refreshed dependencies until the complete dependency graph audited cleanly.
- Added lazy routes and vendor chunking, repaired resize-listener cleanup, and removed the external font dependency.
- Added private-app metadata, favicon, manifest, theme colors, and matching `noindex`/robots behavior without inventing a production origin.
- Scoped and repaired ESLint/stylelint gates and removed legacy API lint errors.

## Adversarial review resolution

Three independent reviews were posted to pull request #5 and then re-run after remediation:

- Technical implementation: closed after recovery delivery, persistent token consumption, invitation activation, session revocation, and complete-month accounting fixes.
- Code quality/general architecture: closed after refresh-session, request-race, full dependency audit, stylesheet gate, index, and accumulator fixes.
- UI/UX: closed after drawer-level errors, keyboard theme toggling, first-error focus, and single-main-landmark fixes.

No reviewer reported a remaining defect in the agreed scope.

## Verification performed

- API test suites: 148 tests passing.
- API ESLint: zero errors; one intentional startup console warning.
- Frontend ESLint: passing.
- Frontend stylelint: passing.
- Frontend Vite 8 production build: passing.
- API dependency audit: zero vulnerabilities.
- Frontend full and production dependency audits: zero vulnerabilities.
- Docker Compose configuration: valid.
- Docker MongoDB, API, and frontend services: healthy.
- Live browser: authentication, create, edit, delete, filters, reset feedback, theme keyboard behavior, first-error focus, light/dark appearance, and mobile/tablet/desktop layouts checked.
- Responsive layouts: no horizontal overflow at 390 px, 768 px, or 1440 px.
- Accessibility landmarks: one `main` per rendered route.

## Known non-blocking considerations

- The Ant Design shared chunk remains above the bundler’s 500 kB warning threshold. Routes and application code are split and cached independently; deeper component-level library replacement was not justified for this assessment.
- Email delivery depends on a configured external SES account and is skipped locally unless explicitly enabled.
- The frontend has no repository-provided automated component-test harness, so interaction and responsive behavior were verified in the live application.
- Production infrastructure and a public production origin were not supplied, so deployment-specific observability, canonical URLs, and live email delivery were not asserted.
