# 11ai Security Dependency Scan Report

- Project: `/Users/ricardojorge/Desktop/archive/2026/dump/tech-tasks/web-assessment`
- Scan timestamp: `2026-07-18T14:29:20+01:00`
- Scan mode: Read-only dependency and supply-chain audit
- Skill workflow: `11ai-security-dep-scan`
- Tooling: Node.js `24.16.0`, npm `11.13.0`, Python `3.13.5`, npm audit service, OSV API

## Executive summary

This project was not identified as malware, but the frontend lockfile should not
be installed unchanged. It contains one critical production dependency,
`form-data@4.0.0`, and several high-severity dependencies.

No confirmed dependency was found that currently compromises the developer's
machine during installation. No machine isolation or secret rotation is
warranted solely from these findings.

The scan covered:

- 2 npm applications: `Api` and `FrontEnd`.
- 2 manifests and 2 npm lockfiles.
- 75 direct dependency declarations across 69 distinct package/range pairs.
- 1,373 lockfile entries representing 1,135 unique package/version pairs.
- All 644 currently published versions permitted by the direct semver ranges.
- Full dependency and production-only npm audits for both applications.
- OSV vulnerability and malware queries for exact locked versions and direct
  range-permitted versions.
- Lockfile source, integrity, lifecycle-hook, native-binary, and registry checks.

There was no installed `node_modules` tree. Findings are therefore classified as
locked/resolvable or requested-but-unselected, not confirmed installed.

## Critical computer-harm risks

No confirmed install-time malware, credential stealer, persistence mechanism,
destructive package, or arbitrary host-command execution vulnerability was found.

The scan returned no OpenSSF/OSV `MAL-*` record for any exact locked version or
direct range-permitted version. Absence from advisory databases is not absolute
proof of safety; unpublished or newly introduced malware may not yet be indexed.

## Critical vulnerability findings

### 1. Locked frontend `form-data@4.0.0`

| Field                     | Evidence                                                                |
| ------------------------- | ----------------------------------------------------------------------- |
| Advisory severity         | Critical                                                                |
| Package                   | `form-data`                                                             |
| Status                    | Locked/resolvable; no installed tree                                    |
| Direct/transitive         | Transitive production dependency of `axios@1.7.2`                       |
| Manifest request          | `axios: ^1.7.2`                                                         |
| Locked Axios              | `1.7.2`                                                                 |
| Locked form-data          | `4.0.0`                                                                 |
| Advisory                  | `GHSA-fjxv-7rqg-78g4` / `CVE-2025-7783`                                 |
| Affected range            | `>=4.0.0 <4.0.4`                                                        |
| Additional advisory       | `GHSA-hmw2-7cc7-3qxx` / `CVE-2026-12143`, high severity through `4.0.5` |
| Safe target               | `form-data >=4.0.6`                                                     |
| Recommended parent target | `axios@1.18.1`                                                          |

The critical issue uses predictable multipart boundaries. Exploitation requires
an attacker to observe relevant `Math.random()` output and control data included
in an outbound multipart request. This may allow injected parameters or requests
to internal systems.

The newer high-severity advisory permits CRLF/field injection when an application
uses untrusted multipart field names or filenames.

Reachability is reduced in this repository. Axios is imported by browser-side
frontend code, and Axios's browser mapping excludes its Node HTTP adapter and
Node `form-data` implementation. No direct `form-data` import was found. The
vulnerable package remains present in the production lock graph and must be
removed even though normal browser-runtime exploitation was not reproduced.

Sources:

- https://github.com/advisories/GHSA-fjxv-7rqg-78g4
- https://github.com/form-data/form-data/security/advisories/GHSA-hmw2-7cc7-3qxx
- `FrontEnd/package.json:25`
- `FrontEnd/package-lock.json:1947`
- `FrontEnd/package-lock.json:3464`

### 2. Critical Mongoose versions permitted but not selected

| Field                       | Evidence                                                           |
| --------------------------- | ------------------------------------------------------------------ |
| Advisory severity           | Critical, CVSS 9.0                                                 |
| Package                     | `mongoose`                                                         |
| Status                      | Requested but vulnerable versions are not selected by the lockfile |
| Direct/transitive           | Direct production dependency                                       |
| Manifest request            | `^8.4.3`                                                           |
| Critical permitted versions | `8.4.3` through `8.9.4` (28 published versions)                    |
| Locked version              | `8.24.1`, not affected                                             |
| Advisory                    | `GHSA-vg7j-7cwx-8wgw` / `CVE-2025-23061`                           |
| Critical fix                | `8.9.5`                                                            |
| Recommended target          | Preserve `8.24.1` or later                                         |

The advisory concerns improper `$where` handling that can execute JavaScript in
MongoDB queries and lead to unauthorized data access or manipulation. No `$where`
use was found in project source. The exact locked version was checked against OSV
and was not affected.

Source: https://github.com/advisories/GHSA-vg7j-7cwx-8wgw

## Authoritative audit totals

| Project and scope         | Critical | High | Moderate | Low | Total |
| ------------------------- | -------: | ---: | -------: | --: | ----: |
| API, full graph           |        0 |    0 |        3 |   0 |     3 |
| API, production only      |        0 |    0 |        3 |   0 |     3 |
| Frontend, full graph      |        1 |   12 |       13 |   1 |    27 |
| Frontend, production only |        1 |    5 |        4 |   0 |    10 |

The npm audit commands were run with `--package-lock-only`; one full-graph and
one `--omit=dev` audit was performed for each lockfile. A non-zero audit exit
status represented findings, not scanner failure.

## Backend findings

| Severity | Package   | Direct          | Manifest request | Locked version | Advisory/range                                                                                      | Fixed or recommended version                            | Impact/action                                                |
| -------- | --------- | --------------- | ---------------- | -------------: | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Moderate | `pm2`     | Yes, production | `^5.4.0`         |        `5.4.3` | `GHSA-x5gf-qvw8-r2rm`, `<7.0.0`; aggregate affected through `7.0.1` because of transitive `js-yaml` | `7.0.3`                                                 | Upgrade PM2; major-version compatibility review required.    |
| Moderate | `js-yaml` | No, through PM2 | PM2 dependency   |        `4.1.1` | `GHSA-h67p-54hq-rp68`, `4.0.0-4.1.1`                                                                | Resolved by PM2 `7.0.3`; safe standalone target `4.3.0` | Quadratic-complexity denial of service with crafted aliases. |
| Moderate | `uuid`    | Yes, production | `^9.0.1`         |        `9.0.1` | `GHSA-w5hq-g745-h8pq`, `<11.1.1`                                                                    | `14.0.1`                                                | Missing buffer bounds validation in selected UUID functions. |

No backend high or critical exact-version vulnerability was returned. The
backend locks safe versions of Axios (`1.18.1`), Mongoose (`8.24.1`), form-data
(`4.0.6`), lodash (`4.18.1`), and other current transitive packages.

## Frontend production findings

| Severity | Package                | Direct                           | Manifest request            | Locked version | Fixed or recommended version | Impact/action                                                                                                                                                         |
| -------- | ---------------------- | -------------------------------- | --------------------------- | -------------: | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Critical | `form-data`            | No, through Axios                | Axios `^1.7.2`              |        `4.0.0` | `4.0.6`                      | Multipart boundary and CRLF/field injection; resolve through Axios upgrade.                                                                                           |
| High     | `axios`                | Yes                              | `^1.7.2`                    |        `1.7.2` | `1.18.1`                     | Multiple SSRF, credential leakage, prototype-pollution gadget, response/request hijacking, and denial-of-service advisories. Browser reachability varies by advisory. |
| High     | `@remix-run/router`    | No                               | React Router DOM dependency |       `1.16.1` | `1.23.2`                     | XSS via open redirects.                                                                                                                                               |
| High     | `react-router`         | No                               | React Router DOM dependency |       `6.23.1` | `6.30.4`                     | Open redirect findings and inherited router vulnerability.                                                                                                            |
| High     | `react-router-dom`     | Yes                              | `^6.23.1`                   |       `6.23.1` | `6.30.4`                     | Upgrade the direct dependency to resolve the router chain.                                                                                                            |
| High     | `lodash`               | No, through `subscribe-ui-event` | Transitive                  |      `4.17.21` | `4.18.1`                     | Code injection through unsafe `_.template` imports plus prototype-pollution advisories. No project use of `_.template` was found.                                     |
| Moderate | `@babel/runtime`       | No                               | Transitive                  |       `7.24.7` | `>=7.26.10`                  | Inefficient regular expression in generated code.                                                                                                                     |
| Moderate | `follow-redirects`     | No, through Axios                | Transitive                  |       `1.15.6` | `1.16.0`                     | Authentication headers can leak across cross-domain redirects.                                                                                                        |
| Moderate | `i18next-http-backend` | Yes                              | `^2.5.2`                    |        `2.5.2` | `4.0.0`                      | Path traversal and URL injection via unsanitized language/namespace values.                                                                                           |
| Moderate | `uuid`                 | Yes                              | `^9.0.1`                    |        `9.0.1` | `14.0.1`                     | Missing buffer bounds validation.                                                                                                                                     |

## Additional frontend development/build findings

These packages are not in the production-only audit, but they execute or process
input on developer workstations and CI and therefore still require remediation.

| Severity | Package           | Locked version(s)  | Minimum safe/recommended direction                                                                                            |
| -------- | ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| High     | `cross-spawn`     | `7.0.3`            | `7.0.6`; update ESLint/build parents.                                                                                         |
| High     | `flatted`         | `3.3.1`            | `3.4.2`; update flat-cache/Stylelint parents.                                                                                 |
| High     | `glob`            | `10.4.1`           | `10.5.0` or `11.1.0`; update Tailwind/Sucrase parent.                                                                         |
| High     | `minimatch`       | `3.1.2`, `9.0.4`   | `3.1.4+`, `9.0.7+`; update parent tooling.                                                                                    |
| High     | `picomatch`       | `2.3.1`            | `2.3.2+`; update parent tooling.                                                                                              |
| High     | `rollup`          | `2.79.1`, `3.29.4` | `2.80.0+`, `3.30.0+`; upgrade Vite and remove/replace `vite-plugin-eslint`.                                                   |
| High     | `vite`            | `4.5.3`            | `6.4.3` or a later compatible release. Every currently published version allowed by `^4.2.1` has at least one known advisory. |
| Moderate | `@babel/helpers`  | `7.24.7`           | `7.26.10+`                                                                                                                    |
| Moderate | `ajv`             | `6.12.6`, `8.16.0` | `6.14.0+`, `8.18.0+`                                                                                                          |
| Moderate | `brace-expansion` | `1.1.11`, `2.0.1`  | `1.1.13+`, `2.0.3+`                                                                                                           |
| Moderate | `esbuild`         | `0.18.20`          | Resolve through Vite upgrade.                                                                                                 |
| Moderate | `js-yaml`         | `4.1.0`            | `4.3.0`                                                                                                                       |
| Moderate | `micromatch`      | `4.0.7`            | `4.0.8+`                                                                                                                      |
| Moderate | `nanoid`          | `3.3.7`            | `3.3.8+`                                                                                                                      |
| Moderate | `postcss`         | `8.4.38`           | `8.5.19`                                                                                                                      |
| Moderate | `yaml`            | `2.4.5`            | `2.8.3+`                                                                                                                      |
| Low      | `@babel/core`     | `7.24.7`           | Current safe target `7.29.7`                                                                                                  |

## Direct range exposure

The scan enumerated every currently published version accepted by each direct
semver range. The following ranges contain one or more versions with known
advisories:

| Package range                 | Published versions allowed | Versions with advisories | First currently allowed version without an OSV match | Latest allowed version checked |
| ----------------------------- | -------------------------: | -----------------------: | ---------------------------------------------------- | ------------------------------ |
| `ajv ^8.16.0`                 |                          4 |                        2 | `8.18.0`                                             | `8.20.0`                       |
| `axios ^1.7.2`                |                         35 |                       30 | `1.16.0`                                             | `1.18.1`                       |
| `express ^4.19.2`             |                          8 |                        1 | `4.20.0`                                             | `4.22.2`                       |
| `i18next-http-backend ^2.5.2` |                          8 |                        8 | None in the declared major                           | `2.7.3`                        |
| `lodash ^4.17.21`             |                          4 |                        2 | `4.18.0`                                             | `4.18.1`                       |
| `mongoose ^8.4.3`             |                         80 |                       75 | `8.22.1` when considering all matched advisories     | `8.24.1`                       |
| `path-to-regexp ^6.2.2`       |                          2 |                        1 | `6.3.0`                                              | `6.3.0`                        |
| `pm2 ^5.4.0`                  |                          4 |                        4 | None in the declared major                           | `5.4.3`                        |
| `postcss ^8.4.38`             |                         32 |                       22 | `8.5.10`                                             | `8.5.19`                       |
| `uuid ^9.0.1`                 |                          1 |                        1 | None in the declared major                           | `9.0.1`                        |
| `vite ^4.2.1`                 |                         40 |                       40 | None in the declared major                           | `4.5.14`                       |

The regular `npm ci` workflow uses the exact lockfile versions. Range exposure
becomes relevant when a lockfile is regenerated, removed, or dependencies are
updated.

## Malware, source, and provenance review

- No `MAL-*` OSV record matched.
- No npm audit malware advisory matched.
- Every lockfile tarball uses `https://registry.npmjs.org/`.
- Every non-root lock entry has an integrity hash.
- No Git, plain HTTP, local-path, private-registry, or foreign-host dependency
  source was found.
- No `.npmrc`, Yarn configuration, pnpm workspace, or private registry setting
  was present.
- There were no installed packages to compare with the lockfile or to verify
  with `npm audit signatures`.

Relevant databases and documentation:

- OSV batch API: https://google.github.io/osv.dev/post-v1-querybatch/
- OpenSSF malicious package reports: https://github.com/ossf/malicious-packages
- npm malware reporting and response: https://docs.npmjs.com/reporting-malware-in-an-npm-package/
- npm audit behavior: https://docs.npmjs.com/cli/v11/commands/npm-audit/

## Install-time hooks and native-code signals

Seven unique hook/native packages occurred in eight lockfile locations. Their
registry tarballs were downloaded as inert data only, SHA-512 checked against
the lockfile, and inspected as text. All seven integrity checks matched.

| Package                       | Scope/parent                         | Observed behavior                                                                                                                                                                                                         | Classification                                                                                                                             |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `@scarf/scarf@1.4.0`          | API, through `swagger-ui-dist`       | Postinstall runs `report.js`, invokes `npm ls` and Git commands, may contact `scarf.sh`, and writes a rate-limit file under the OS temp directory. It can interactively persist preferences to the root package manifest. | Telemetry/execution exposure; not confirmed malware. Disable with `SCARF_ANALYTICS=false`, `SCARF_NO_ANALYTICS=true`, or `DO_NOT_TRACK=1`. |
| `esbuild@0.18.20`             | Frontend, through Vite               | Postinstall selects, downloads if necessary, writes, and executes a platform-specific native binary. The direct fallback registry download in this version does not independently validate a content hash.                | Legitimate but material host-code execution exposure. Upgrade through Vite.                                                                |
| Font Awesome packages `6.5.2` | Frontend direct/transitive           | Three postinstall scripts only print license and attribution text.                                                                                                                                                        | Low-risk informational hooks.                                                                                                              |
| `core-js@3.37.1`              | Frontend, through `react-stickynode` | Prints a funding banner and writes a temporary banner-throttle file.                                                                                                                                                      | Low-risk local side effect.                                                                                                                |
| `fsevents@2.3.3`              | Optional dependency in both graphs   | Tarball contains a precompiled macOS `fsevents.node` native binary. The embedded tarball manifest contains no install lifecycle command, despite the lockfile's `hasInstallScript` signal.                                | Native binary exposure; no malicious behavior confirmed.                                                                                   |

The current esbuild project later added integrity validation to its fallback
download path: https://github.com/evanw/esbuild/releases

## Remediation order

1. Do not run a normal frontend install from the current lockfile before review.
2. In a disposable clean container, update `FrontEnd/package.json` and regenerate
   the lockfile with lifecycle scripts initially disabled.
3. Set or resolve at least:
   - `axios@1.18.1`, yielding `form-data@4.0.6`.
   - `react-router-dom@6.30.4` and `@remix-run/router@1.23.2`.
   - `i18next-http-backend@4.0.0`.
   - `uuid@14.0.1`.
   - `postcss@8.5.19`.
   - `vite@6.4.3` or later.
   - `lodash@4.18.1` through a parent update or reviewed override.
4. Update ESLint, Tailwind, Stylelint and related build tools. Remove or replace
   `vite-plugin-eslint` if it continues to retain obsolete Rollup versions.
5. Upgrade backend PM2 to `7.0.3` and UUID to `14.0.1`.
6. Preserve backend Mongoose at `8.24.1` or later.
7. Re-run full and production-only audits after regeneration and inspect every
   changed lifecycle script and tarball source.

Do not use `npm audit fix` as the first remediation step. It performs dependency
resolution/installation and may execute lifecycle scripts. Review and update the
dependency graph explicitly.

The proposed direct remediation targets were individually queried against OSV
at scan time and returned no known vulnerability records:

- `axios@1.18.1`
- `form-data@4.0.6`
- `mongoose@8.24.1`
- `pm2@7.0.3`
- `uuid@14.0.1`
- `react-router-dom@6.30.4`
- `@remix-run/router@1.23.2`
- `lodash@4.18.1`
- `i18next-http-backend@4.0.0`
- `postcss@8.5.19`
- `vite@6.4.3`

## Coverage limitations

- `node_modules` was absent, so installed versions, installed source drift,
  runtime tampering, and local persistence could not be checked.
- npm signature/provenance verification requires an installed dependency tree
  and was not run.
- The exact transitive graph was checked from both lockfiles. The 644 possible
  version analysis covers every published version allowed by direct manifest
  ranges, but it does not construct every combinatorial transitive graph that
  could result from regenerating the lockfiles at different times.
- Advisory and malware databases describe known reports only. Zero matches do
  not exclude an unpublished, newly compromised, or highly targeted package.
- Reachability was assessed through static project-source and package-metadata
  inspection. No application or dependency code was executed.

## Scan safety and repository state

No dependency installation, lifecycle script, package binary, application,
build, test suite, or automatic remediation command was executed. The original
scan made no project changes; this Markdown report is the only file subsequently
added at the user's request.

---

## LLM Cost Analysis

> Generated 2026-07-18T13:50:23.179Z · Root: `.` · Prices are USD per 1M tokens unless noted

### Executive summary

| Metric                                   | Value             |
| ---------------------------------------- | ----------------- |
| Threads recognized                       | 1                 |
| Threads with measured tokens             | 1 / 1             |
| Threads with derived cost                | 1 / 1             |
| Threads with reported-only cost          | 0                 |
| Threads with unavailable or partial cost | 0                 |
| Measured/provider tokens                 | 10,211,467        |
| Known cost                               | $8.1712           |
| Cost coverage                            | 100.0%            |
| Input tokens                             | 10,153,571        |
| Cached input                             | 9,851,904 (97.0%) |
| Output tokens                            | 57,896            |
| Reasoning output                         | 18,402 (31.8%)    |

The known-cost total includes derived API-equivalent prices and harness-reported costs. It is not necessarily an invoice, especially for subscription, enterprise, batch, priority, or negotiated usage.

### Cost by provider

| Provider | Threads | Known tokens | Known cost | Priced | Unpriced |
| -------- | ------- | ------------ | ---------- | ------ | -------- |
| openai   | 1       | 10,211,467   | $8.1712    | 1      | 0        |

### Cost by model

| Provider / model     | Threads | Input      | Cached    | Output | Tokens     | Cost    |
| -------------------- | ------- | ---------- | --------- | ------ | ---------- | ------- |
| openai / gpt-5.6-sol | 1       | 10,153,571 | 9,851,904 | 57,896 | 10,211,467 | $8.1712 |

### Cost by root and child folder

The folder is the direct child of the scanned root; files directly in the root are grouped as `.`.

| Folder | Threads | Tokens     | Known cost | Priced | Unpriced |
| ------ | ------- | ---------- | ---------- | ------ | -------- |
| .      | 1       | 10,211,467 | $8.1712    | 1      | 0        |

### Token composition

| Token class          | Tokens    | Share of available total | Meaning                                             |
| -------------------- | --------- | ------------------------ | --------------------------------------------------- |
| Uncached input       | 301,667   | 3.0%                     | Input billed at the base input rate                 |
| Cached input read    | 9,851,904 | 97.0%                    | Provider cache-hit tokens                           |
| 5-minute cache write | 0         | n/a                      | Anthropic-style ephemeral cache writes              |
| 1-hour cache write   | 0         | n/a                      | Anthropic-style extended cache writes               |
| Output               | 57,896    | 0.6%                     | Generated output, including reasoning where exposed |
| Reasoning output     | 18,402    | 31.8%                    | Subset of output, never added twice                 |

_Security scan by [11ai-security-dep-scan](https://ai.rj11.io/skills/11ai-security-dep-scan); LLM token cost analysis by [11ai-llm-cost](https://ai.rj11.io/skills/11ai-llm-cost)._
