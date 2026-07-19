# Completed

## Expense and income diary

- Added authenticated transaction CRUD endpoints with ownership checks.
- Added transaction validation for type, amount precision, currency, dates, and date ranges.
- Added server-side filtering, searching, pagination, and aggregate income/expense totals.
- Added focused API regression coverage, including auth isolation and decimal-cent handling.
- Added an Ant Design dashboard with summary cards, responsive table, empty/loading/error states, create/edit modal, delete confirmation, and success feedback.
- Added responsive mobile navigation and accessible labels for interactive controls.
- Added English and Italian diary translations and synchronized the document language attribute.
- Added light/dark theme tokens and responsive styling refinements.

## Hardening and verification

- Removed fallback access-token secrets and separated access, refresh, and password-reset token purposes.
- Added startup checks for required authentication secrets.
- Added stale-request protection to the diary data loader.
- Verified Docker services, API tests, frontend build, focused ESLint/Stylelint checks, formatting, and browser CRUD smoke flows.
- Reviewed the implementation with three adversarial review agents and applied the resulting security, data, and UI/UX fixes.

Known follow-up risks are documented in the repository security scan report: dependency advisories remain in the inherited dependency tree and should be handled as a separate upgrade task.
