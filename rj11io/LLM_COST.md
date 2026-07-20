# Project LLM Cost Report

## Totals

| Metric | Value |
| --- | --- |
| Threads recognized | 21 |
| Threads with measured tokens | 21 / 21 |
| Threads with derived cost | 21 / 21 |
| Threads with reported-only cost | 0 |
| Threads with unavailable or partial cost | 0 |
| Measured/provider tokens | 261,681,111 |
| Known cost | $110.6759 |
| Estimated active time | 4h 31m 17s |
| Cost / active hour | $24.4786 |
| Sum of thread wall time | 5h 13m 30s |
| Cost / wall hour | $21.1824 |
| Cost / thread | $5.2703 |
| Cost coverage | 100.0% |
| Input tokens | 260,974,134 |
| Cached input | 254,686,740 (97.6%) |
| Output tokens | 706,977 |
| Reasoning output | 173,882 (24.6%) |
| Threads with measurable wall time | 21 / 21 |
| Threads with estimated active time | 21 / 21 |
| Active / wall time | 86.5% |

The known-cost total includes derived API-equivalent prices and harness-reported costs. It is not necessarily an invoice, especially for subscription, enterprise, batch, priority, or negotiated usage.

## Scan coverage

| Coverage | Value |
| --- | --- |
| Files visited | 57 |
| JSON/JSONL/NDJSON files inspected | 57 |
| Project JSON-family files | 36 |
| Native session files metadata-checked | 461 |
| Project-associated native sessions | 21 |
| Codex sessions | 18 |
| Claude sessions | 3 |
| Gemini CLI sessions | 0 |
| Cline tasks | 0 |
| Roo Code tasks | 0 |
| OpenCode sessions | 0 |
| Files containing usage records | 21 |
| Malformed records | 6 |
| Pricing catalog | .agents/skills/11ai-llm-cost-project/references/pricing.json |
| Oldest observed thread | 2026-07-19T19:49:49.815Z |
| Newest observed thread | 2026-07-20T00:47:36.019Z |

## Cost by provider

| Provider | Threads | Input | Cached | Output | Tokens | Known cost | Active time | Cost / active hour | Wall time | Cost / wall hour | Cost / thread | Priced | Unpriced |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openai | 18 | 229,398,149 | 223,505,920 | 628,626 | 230,026,775 | $98.1240 | 3h 52m 45s | $25.2959 | 4h 9m 50s | $23.5652 | $5.4513 | 18 | 0 |
| anthropic | 3 | 31,575,985 | 31,180,820 | 78,351 | 31,654,336 | $12.5519 | 38m 32s | $19.5425 | 1h 3m 39s | $11.8306 | $4.1840 | 3 | 0 |
| Total | 21 | 260,974,134 | 254,686,740 | 706,977 | 261,681,111 | $110.6759 | 4h 31m 17s | $24.4786 | 5h 13m 30s | $21.1824 | $5.2703 | 21 | 0 |

## Cost by harness

| Harness | Threads | Input | Cached | Output | Tokens | Known cost | Active time | Cost / active hour | Wall time | Cost / wall hour | Cost / thread | Reported-cost sum | Average tokens / thread | Priced | Unpriced |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| codex | 18 | 229,398,149 | 223,505,920 | 628,626 | 230,026,775 | $98.1240 | 3h 52m 45s | $25.2959 | 4h 9m 50s | $23.5652 | $5.4513 | n/a | 12,779,265 | 18 | 0 |
| claude | 3 | 31,575,985 | 31,180,820 | 78,351 | 31,654,336 | $12.5519 | 38m 32s | $19.5425 | 1h 3m 39s | $11.8306 | $4.1840 | n/a | 10,551,445 | 3 | 0 |
| Total | 21 | 260,974,134 | 254,686,740 | 706,977 | 261,681,111 | $110.6759 | 4h 31m 17s | $24.4786 | 5h 13m 30s | $21.1824 | $5.2703 | n/a | 12,461,005 | 21 | 0 |

## Cost by model

| Provider / model | Threads | Input | Cached | Output | Tokens | Cost | Active time | Cost / active hour | Wall time | Cost / wall hour | Cost / thread |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openai / gpt-5.6-sol | 4 | 119,128,249 | 116,267,776 | 340,018 | 119,468,267 | $82.6368 | 1h 33m 39s | $52.9400 | 1h 41m 50s | $48.6871 | $20.6592 |
| openai / gpt-5.6-luna | 14 | 110,269,900 | 107,238,144 | 288,608 | 110,558,508 | $15.4872 | 2h 19m 5s | $6.6810 | 2h 28m | $6.2787 | $1.1062 |
| anthropic / claude-sonnet-5 | 3 | 31,575,985 | 31,180,820 | 78,351 | 31,654,336 | $12.5519 | 38m 32s | $19.5425 | 1h 3m 39s | $11.8306 | $4.1840 |
| Total | 21 | 260,974,134 | 254,686,740 | 706,977 | 261,681,111 | $110.6759 | 4h 31m 17s | $24.4786 | 5h 13m 30s | $21.1824 | $5.2703 |

## Cost by model by effort

| Provider / model | Effort | Threads | Input | Cached | Output | Tokens | Known cost | Active time | Cost / active hour | Wall time | Cost / wall hour | Cost / thread |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openai / gpt-5.6-sol | high | 4 | 119,128,249 | 116,267,776 | 340,018 | 119,468,267 | $82.6368 | 1h 33m 39s | $52.9400 | 1h 41m 50s | $48.6871 | $20.6592 |
| anthropic / claude-sonnet-5 | high | 3 | 31,575,985 | 31,180,820 | 78,351 | 31,654,336 | $12.5519 | 38m 32s | $19.5425 | 1h 3m 39s | $11.8306 | $4.1840 |
| openai / gpt-5.6-luna | high | 10 | 85,666,252 | 83,235,840 | 247,695 | 85,913,947 | $12.2402 | 1h 25m 55s | $8.5487 | 1h 25m 55s | $8.5487 | $1.2240 |
| openai / gpt-5.6-luna | low | 4 | 24,603,648 | 24,002,304 | 40,913 | 24,644,561 | $3.2471 | 53m 11s | $3.6637 | 1h 2m 5s | $3.1378 | $0.8118 |
| Total | All efforts | 21 | 260,974,134 | 254,686,740 | 706,977 | 261,681,111 | $110.6759 | 4h 31m 17s | $24.4786 | 5h 13m 30s | $21.1824 | $5.2703 |

## Cost by root and child folder

The folder is the direct child of the scanned root; files directly in the root are grouped as `.`.

| Folder | Threads | Input | Cached | Output | Tokens | Known cost | Active time | Cost / active hour | Wall time | Cost / wall hour | Cost / thread | Priced | Unpriced |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| . | 21 | 260,974,134 | 254,686,740 | 706,977 | 261,681,111 | $110.6759 | 4h 31m 17s | $24.4786 | 5h 13m 30s | $21.1824 | $5.2703 | 21 | 0 |
| Total | 21 | 260,974,134 | 254,686,740 | 706,977 | 261,681,111 | $110.6759 | 4h 31m 17s | $24.4786 | 5h 13m 30s | $21.1824 | $5.2703 | 21 | 0 |

## Token composition

| Token class | Tokens | Share of available total | Meaning |
| --- | --- | --- | --- |
| Uncached input | 5,892,693 | 2.3% | Input billed at the base input rate |
| Cached input read | 254,686,740 | 97.6% | Provider cache-hit tokens |
| 5-minute cache write | 154,303 | n/a | Anthropic-style ephemeral cache writes |
| 1-hour cache write | 240,398 | n/a | Anthropic-style extended cache writes |
| Output | 706,977 | 0.3% | Generated output, including reasoning where exposed |
| Reasoning output | 173,882 | 24.6% | Subset of output, never added twice |

## Thread detail

| Thread | Source | Provider / model / effort | Input | Cached | Output | Tokens | Selected cost | Active time | Cost / active hour | Wall time | Cost / wall hour | Harness reported | Method |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openai:7a9c03696e716e7a2391 | codex-session/sessions/2026/07/19/rollout-2026-07-19T22-55-29-019f7c60-89b1-7391-b742-7bfffbe6b7fc.jsonl | openai / gpt-5.6-sol / high | 38,693,519 | 37,925,632 | 104,860 | 38,798,379 | $25.9481 | 56m 1s | $27.7921 | 56m 1s | $27.7921 | n/a | derived |
| openai:b69f3464ff4076b75443 | codex-session/sessions/2026/07/19/rollout-2026-07-19T23-26-47-019f7c7d-3399-7883-9b1b-6e6aedfd77b1.jsonl | openai / gpt-5.6-sol / high | 27,739,139 | 26,994,944 | 78,101 | 27,817,240 | $19.5615 | 10m 36s | $110.7854 | 13m 32s | $86.7504 | n/a | derived |
| openai:70cae2eae6d7193f8be5 | codex-session/sessions/2026/07/19/rollout-2026-07-19T23-26-28-019f7c7c-e7f5-76b1-a5bd-9bffa4da72d1.jsonl | openai / gpt-5.6-sol / high | 26,622,557 | 25,953,792 | 79,429 | 26,701,986 | $18.7036 | 15m 23s | $72.9888 | 17m 43s | $63.3601 | n/a | derived |
| openai:5004e0b2d034f79ada94 | codex-session/sessions/2026/07/19/rollout-2026-07-19T23-26-36-019f7c7d-087f-72d1-9160-354bf717f933.jsonl | openai / gpt-5.6-sol / high | 26,073,034 | 25,393,408 | 77,628 | 26,150,662 | $18.4237 | 11m 40s | $94.7342 | 14m 35s | $75.8281 | n/a | derived |
| anthropic:29b64a1e92bc138a71da | claude-session/projects/-Users-ricardojorge-Desktop-archive-2026-repos-defi-tech-task/4bc9c54a-5306-4230-a176-747a5a04b97d.jsonl | anthropic / claude-sonnet-5 / high | 29,165,596 | 28,924,804 | 60,551 | 29,226,147 | $11.0293 | 31m 49s | $20.8040 | 56m 56s | $11.6240 | n/a | derived |
| openai:41171d57921e251783c5 | codex-session/sessions/2026/07/19/rollout-2026-07-19T22-12-59-019f7c39-a346-7202-8cec-0bf3d7b5998f.jsonl | openai / gpt-5.6-luna / high | 28,036,389 | 27,486,208 | 70,010 | 28,106,399 | $3.7189 | 38m 4s | $5.8623 | 38m 4s | $5.8623 | n/a | derived |
| openai:ffdfd50fc623a440609f | codex-session/sessions/2026/07/19/rollout-2026-07-19T21-04-43-019f7bfb-2209-7aa0-98f3-28f9840d95c6.jsonl | openai / gpt-5.6-luna / low | 21,792,063 | 21,462,272 | 34,499 | 21,826,562 | $2.6830 | 49m 53s | $3.2268 | 58m 48s | $2.7377 | n/a | derived |
| openai:fa1af5f44128a9c3d56a | codex-session/sessions/2026/07/19/rollout-2026-07-19T22-29-00-019f7c48-4974-7c31-aca5-20686ff0ff3d.jsonl | openai / gpt-5.6-luna / high | 14,974,973 | 14,528,768 | 49,090 | 15,024,063 | $2.1936 | 6m 22s | $20.6478 | 6m 22s | $20.6478 | n/a | derived |
| openai:2b125ea48b9785ecd82c | codex-session/sessions/2026/07/19/rollout-2026-07-19T22-29-00-019f7c48-4a38-79e1-9772-eb8b7dc5823a.jsonl | openai / gpt-5.6-luna / high | 14,544,431 | 14,051,328 | 48,405 | 14,592,836 | $2.1887 | 6m 34s | $20.0200 | 6m 34s | $20.0200 | n/a | derived |
| openai:20e6abb1ef0995740971 | codex-session/sessions/2026/07/19/rollout-2026-07-19T22-29-00-019f7c48-4ba7-7202-bed4-a283fb33ab1d.jsonl | openai / gpt-5.6-luna / high | 13,739,794 | 13,302,528 | 49,389 | 13,789,183 | $2.0639 | 5m 56s | $20.8554 | 5m 56s | $20.8554 | n/a | derived |
| openai:b92aae1c08076c6f76ec | codex-session/sessions/2026/07/20/rollout-2026-07-20T00-14-49-019f7ca9-2a33-7062-9b9a-a5cbed02a6f4.jsonl | openai / gpt-5.6-luna / high | 13,286,964 | 12,956,416 | 18,614 | 13,305,578 | $1.7379 | 21m 9s | $4.9301 | 21m 9s | $4.9301 | n/a | derived |
| anthropic:02d41aa05f4bc46f18d7 | claude-session/projects/-Users-ricardojorge-Desktop-archive-2026-repos-defi-tech-task/4bc9c54a-5306-4230-a176-747a5a04b97d/subagents/agent-a946bc73092c90888.jsonl | anthropic / claude-sonnet-5 / high | 1,402,604 | 1,304,109 | 9,691 | 1,412,295 | $0.9059 | 3m 40s | $14.7935 | 3m 40s | $14.7935 | n/a | derived |
| anthropic:087dc88d11b0ba4a7a75 | claude-session/projects/-Users-ricardojorge-Desktop-archive-2026-repos-defi-tech-task/4bc9c54a-5306-4230-a176-747a5a04b97d/subagents/agent-aa2562480b6500abc.jsonl | anthropic / claude-sonnet-5 / high | 1,007,785 | 951,907 | 8,109 | 1,015,894 | $0.6167 | 3m 3s | $12.1169 | 3m 3s | $12.1169 | n/a | derived |
| openai:eb1e61033b6cbed5d86c | codex-session/sessions/2026/07/20/rollout-2026-07-20T00-37-20-019f7cbd-c83e-7e21-9270-a7e9e059996c.jsonl | openai / gpt-5.6-luna / low | 2,501,151 | 2,261,760 | 3,138 | 2,504,289 | $0.4844 | 1m 30s | $19.4745 | 1m 30s | $19.4745 | n/a | derived |
| openai:034adbab34b5d368e75d | codex-session/sessions/2026/07/19/rollout-2026-07-19T21-27-59-019f7c10-7018-7571-8a6f-43b4bc9e8024.jsonl | openai / gpt-5.6-luna / high | 374,350 | 324,096 | 3,893 | 378,243 | $0.1060 | 1m 53s | $3.3847 | 1m 53s | $3.3847 | n/a | derived |
| openai:8ef4c264861e16308006 | codex-session/sessions/2026/07/19/rollout-2026-07-19T22-08-33-019f7c35-91c0-75a1-b96a-b5bd0850627f.jsonl | openai / gpt-5.6-luna / high | 308,933 | 265,984 | 2,360 | 311,293 | $0.0837 | 3m 11s | $1.5761 | 3m 11s | $1.5761 | n/a | derived |
| openai:e1b98f12d1039f801a3b | codex-session/sessions/2026/07/19/rollout-2026-07-19T20-49-38-019f7bed-5101-7142-a48b-5c874d6061fa.jsonl | openai / gpt-5.6-luna / low | 290,013 | 268,288 | 3,079 | 293,092 | $0.0670 | 1m 34s | $2.5608 | 1m 34s | $2.5608 | n/a | derived |
| openai:6e10f8987146658cbbec | codex-session/sessions/2026/07/19/rollout-2026-07-19T21-25-57-019f7c0e-9374-7071-87b7-a6014540b30b.jsonl | openai / gpt-5.6-luna / high | 155,933 | 122,368 | 2,495 | 158,428 | $0.0608 | 1m | $3.6229 | 1m | $3.6229 | n/a | derived |
| openai:3748677b74b2caddaa9c | codex-session/sessions/2026/07/19/rollout-2026-07-19T21-23-05-019f7c0b-f3f9-7f62-be12-95effdc46a1e.jsonl | openai / gpt-5.6-luna / high | 128,722 | 96,000 | 1,842 | 130,564 | $0.0534 | 46s | $4.1354 | 46s | $4.1354 | n/a | derived |
| openai:ea554ac7fb3ae790dac8 | codex-session/sessions/2026/07/19/rollout-2026-07-19T22-06-47-019f7c33-f380-7b20-ae4f-271d6a323ecd.jsonl | openai / gpt-5.6-luna / high | 115,763 | 102,144 | 1,597 | 117,360 | $0.0334 | 59s | $2.0489 | 59s | $2.0489 | n/a | derived |
| openai:3c9298a1a2c28b909f00 | codex-session/sessions/2026/07/20/rollout-2026-07-20T01-47-16-019f7cfd-d055-7821-9010-ccb381998867.jsonl | openai / gpt-5.6-luna / low | 20,421 | 9,984 | 197 | 20,618 | $0.0126 | 14s | $3.3641 | 14s | $3.3641 | n/a | derived |

## Pricing coverage

| Status | Threads | Meaning |
| --- | --- | --- |
| Matched | 21 | Model matched and all required token classes were priced |
| Matched but stale | 0 | Matched rate is more than 30 days past verification |
| Partial | 0 | A model matched, but one or more required rates or token classes are unavailable |
| Reported | 0 | Cost came from the harness record rather than local pricing |
| Unmatched | 0 | No model pattern matched the pricing catalog |


### Pricing catalog match detail

| Provider / model | Match | Rates per 1M | Effective | Verified | Source |
| --- | --- | --- | --- | --- | --- |
| anthropic / claude-sonnet-5 | claude-sonnet-5*, claude-sonnet-4-6* | input=3, output=15, cacheWrite5m=3.75, cacheWrite1h=6, cacheRead=0.3 | 2026-06-24 | 2026-07-13 | https://platform.claude.com/docs/en/pricing |
| openai / gpt-5.6-luna | gpt-5.6-luna* | input=1, cachedInput=0.1, output=6 | 2026-07-09 | 2026-07-13 | https://developers.openai.com/api/docs/pricing |
| openai / gpt-5.6-sol | gpt-5.6-sol* | input=5, cachedInput=0.5, output=30 | 2026-07-09 | 2026-07-13 | https://developers.openai.com/api/docs/pricing |

Update the pricing override and rerun when rates are stale or unmatched.

## Anomalies and limitations

- malformed JSON ignored: Api/db/seed/companies_h.json: Unexpected end of JSON input
- malformed JSON ignored: Api/db/seed/companies.json: Unexpected end of JSON input
- malformed JSON ignored: Api/db/seed/migrations.json: Unexpected end of JSON input
- malformed JSON ignored: Api/db/seed/rts.json: Unexpected end of JSON input
- malformed JSON ignored: Api/db/seed/users_h.json: Unexpected end of JSON input
- malformed JSON ignored: Api/db/seed/users.json: Unexpected end of JSON input
- logical thread identity appears in multiple source files: 4bc9c54a-5306-4230-a176-747a5a04b97d
- OpenCode database opencode.db could not be read: no such column: cost

## Methodology

- Recursively inspect JSON, JSONL, and NDJSON files below the requested root, excluding dependency, VCS, cache, virtual-environment, and build directories.
- Discover Codex, Claude Code, Gemini CLI, Cline, Roo Code, and OpenCode usage from their native local stores. Include only sessions whose recorded project directory or project hash belongs to the requested root.
- Use the last cumulative Codex token-count event; deduplicate Claude streaming records; aggregate Gemini per-message counters and Cline/Roo API request metrics; read OpenCode's session ledger in read-only mode; aggregate generic usage records by provider and model.
- Preserve provider-native usage semantics: OpenAI cached input is a subset of input, while Anthropic cache buckets are disjoint. Reasoning tokens are a subset of output.
- Read effort only from discoverable request, message, payload, metadata, or settings fields and group Claude usage by model and recorded effort. Normalize Claude Code ultracode to xhigh. Never infer a missing effort from current settings or model defaults; report it as n/a.
- Measure wall time from the first to last distinct timestamp observed for a thread. Estimate active time by summing consecutive timestamp gaps with each gap capped at five minutes; report both as unavailable when fewer than two distinct timestamps exist.
- Calculate cost per wall hour and cost per active hour by dividing known cost by the corresponding summed measurable duration. Report the rate as unavailable when cost or duration is unavailable or duration is zero.
- Calculate cost per thread by dividing known cost by every recognized thread in the row. Incomplete cost coverage can therefore understate this rate. Per-thread detail omits the metric because it would duplicate selected cost.
- Treat missing values as unavailable. Sum known totals for overview coverage, but surface every incomplete or unpriced thread in the detail and limitations sections.
- Do not include prompts, message text, secrets, or raw transcripts in this report. Source-relative paths are the traceability boundary.

> Generated 2026-07-20T00:47:36.125Z · Root: `.` · Prices are USD per 1M tokens unless noted

_LLM token cost analysis by [11ai-llm-cost-project](https://ai.rj11.io/skills/11ai-llm-cost-project)._
