# Report Storytelling Plan — `/reports/{reportYear}`

> Status: proposal, for reading. Nothing is implemented. Revised 2026-09-16 after a full scan of the public report path.
> Execution, once approved, should follow `superpowers:executing-plans`.

## The audit finding

An auditor reviewed the GAD system and said it is "full of charts and data but no storytelling."

That is a fair reading of the page as built. The scan below confirms it: a citizen who opens `/reports/2025` sees nine tabs of correct, well-labelled, sex-disaggregated figures and is told nothing about what any of it means, why GAD requires it, or what DOST IX did in response.

## What the scan found

Path the public actually hits:

```
routes/web.php  reports.show
  → ReportYearPublicController@show          (published years only, 404 otherwise)
    → ReportYearTransformer::toPublicDetailArray()
      → Inertia page  resources/js/pages/reports/Show.vue
        → components/reports/YearReportContent.vue   (551 lines, the whole page)
```

Observations, each one load-bearing for the plan:

1. **Every chart title is descriptive, never a finding.** `ReportChartBlock` takes `title` + `description`. Current titles: "GFPS Membership by Sex", "Employees by Employment Status", "Testing and Calibration Services". Descriptions are scope notes ("Distribution of GFPS members"), not conclusions. The reader has to do the analysis themselves.

2. **The findings are already computed and thrown away.** `YearReportContent.vue` builds `gfpsStats`, `employeesStats`, `scholarsStats`, `rstlStats`, `specialResearchStats`, each with `femalePercentage` / `malePercentage` (lines 66–172). Those percentages are rendered as bare `meta: "58%"` chips under a metric card. The sentence "Women make up 58.0% of GFPS members" is one string template away from existing.

3. **There is already a narrative field, and the public report page does not render it.** `report_years.description` is `text` nullable, editable by admins in `MetadataSection.vue` (4000 chars, counter and all), shipped to the page by the transformer as `year.description` — and `YearReportContent.vue` renders only `year.title`. The homepage `YearCard.vue:34` renders it; the report itself does not. A human-written story slot is already built, already populated, and currently invisible on the one page auditors open.

4. **The Overview tab opens with four compact numbers and a link grid.** `ReportMetricsGrid` + `ReportOverviewQuickAccess`. No lead sentence, no "what this year was about".

5. **`percentage()` is a local closure at line 53** of a 551-line component. Any takeaway helper should take it over rather than duplicate it.

6. **One breakdown must stay silent.** `JobsBreakdownHeatmap` shows PWD / senior citizen / IP / 4Ps. `useFundingGroup.ts` documents that these groups overlap and must never be summed or stacked. No takeaway sentence may rank or total them.

7. **Empty-vs-zero is already handled carefully** (`hasData`, `hasMemberStatusData`, `hasJobsData`, `specialResearchRows` dropping all-zero provinces). Takeaways must inherit that discipline: no sentence when nothing was entered. "0% of 0" in a government report is worse than silence.

8. **Print/PDF is a separate path** (`Print.vue`, `ReportPrintController`) with its own 114-line component. Auditors likely read the PDF. Same helper can feed it, but that is a later step.

## What "storytelling" should mean here

Data storytelling in the Knaflic sense: charts lead with the finding, the page has a narrative spine, and the reader is told what they are looking at before they are shown it. Not scrollytelling, not authored essays, not AI-generated prose.

Options weighed:

| Option | Verdict | Reason |
| --- | --- | --- |
| A. Computed takeaway sentences from existing stats | **Ship first** | Always in sync with the figures. No data entry. No backend. Testable as pure functions. |
| B. Render the existing `description` as the report's narrative lead | **Ship first** | The field, the editor, the validation and the payload already exist. Cost is one `<p>` and a style. This is the human "why it matters" that no computation can produce. |
| C. Per-section admin narrative (a text field per tab) | Defer | Needs a migration, nine edit fields, validation, policy, audit logging, and goes stale when figures are corrected. Reconsider only if B proves too coarse. |
| D. Year-over-year comparison ("up 12% from 2024") | Defer, but tempting | The strongest storytelling device available and the one auditors respond to. Needs a second year loaded in the controller. Real backend work. Phase 3. |
| E. Scrollytelling | Reject | Fights the nine-tab layout, hurts mobile and reduced-motion users, large rewrite. |
| F. AI-generated summaries | Reject | New dependency, new cost, and a wrong sentence in an official government GAD report is a compliance incident. |

**A + B are one phase and answer the audit finding. D is the follow-up that makes it good.**

## Design rules

1. **A takeaway states a fact, never a cause.** "Women make up 58.0% of GFPS members" — not "GFPS attracts more women".
2. **No data, no sentence.** Helper returns `null` when the total is zero or the rows are empty; the block then renders exactly as it does today.
3. **Near parity is called parity.** Female share within 45–55% reads "nearly even, 51.2% women and 48.8% men". Never dress a 51/49 split as a finding.
4. **Overlapping groups get no takeaway.** The jobs breakdown heatmap keeps its existing warning description and nothing else (finding 6).
5. **Existing formatting wins, except for money in prose.** `Intl.NumberFormat('en-PH')` for counts and one decimal for percentages, same as the metric cards. Money in a sentence is shortened to three significant digits — `₱29.5M`, not `₱29,488,840.48`, which stalls the reader mid-line. The exact figure stays on the metric card below, so nothing is lost. Cards and tables keep `formatCurrency`; they are the figures of record.
6. **Hierarchy inverts inside the block head.** The takeaway becomes the large text; the current title drops to a small uppercase label above it. With no takeaway, the head is untouched.
7. **No new motion.** Takeaways ride the existing `tab-fade`. No count-ups: people flip tabs constantly and an animated number delays the one thing the block exists to say.
8. **Accessibility unchanged.** `<h3>` stays the title. The takeaway is a `<p>` immediately after it. Contrast verified in both the dark theme and `report-light`.
9. **The narrative lead is admin-written and optional.** If `description` is empty the page looks exactly as it does now.

## Takeaway inventory

| Tab | Block | Sentence (example) | Source, all existing |
| --- | --- | --- | --- |
| Overview | Narrative lead (new) | The admin's `year.description`, verbatim | `year.description` |
| Overview | Summary lead (new) | "In 2025, DOST IX recorded 3,412 people across GFPS, employees, scholars and RSTL customers. 54.2% were women." + when funding exists, "SETUP, CEST and GIA funded 87 projects worth ₱42.1M." | `totalFemaleAcrossPrograms`, `totalMaleAcrossPrograms`, `combinedProjectsCount`, `combinedFundingAmount` |
| GFPS | Membership by sex | "Women make up 58.0% of GFPS members." | `gfpsStats` |
| GFPS | Assembly participation | "Attendance peaked in Q3 with 64 participants." | `assemblyData` |
| GFPS | Members by employment status | "Most GFPS members are Permanent (21 of 38)." | `gfpsMemberStatusData` |
| DOST IX Employees | Employees by status | "Permanent staff are the largest group (112). Women are 52.3% of all employees." | `employeesData`, `employeesStats` |
| Scholarship | Scholars pie | "Women make up 61.4% of on-going scholars." | `scholarsStats` |
| Scholarship | Undergraduate / graduate applicants | "RA 7687 drew the most undergraduate applicants (340)." | `undergraduateApplicants`, `graduateApplicants` |
| RSTL | Monthly customers | "RSTL served the most customers in March (412). Women were 47.9% of the year's customers." | `rstlWarmBodiesData`, `rstlStats` |
| SETUP / CEST / GIA | Metrics lead | "Female-led firms received 31 of 87 projects (35.6%)." | `fundingStats` |
| SETUP / CEST / GIA | Jobs by sex | "Women hold 44.0% of the 250 jobs generated." | `jobsBySex` |
| SETUP / CEST / GIA | Jobs breakdown heatmap | none, by rule 4 | — |
| Special Projects Research | Researchers chart | "Women are 55.0% of special projects researchers." | `specialResearchRows` |

Exact templates get frozen by the Task 1 tests. Final wording depends on the open question below.

## Files

Create:
- `resources/js/helpers/reportStory.ts` — pure functions, ~120 lines
- `resources/js/helpers/reportStory.spec.ts`
- `resources/js/components/reports/ReportChartBlock.spec.ts`
- `resources/js/components/reports/ReportStoryLead.vue` — ~30 lines, renders the description and the computed lead
- `resources/js/components/reports/ReportStoryLead.spec.ts` — empty, lines-only, note-only, both, and whitespace-only note

Modify:
- `resources/js/components/reports/ReportChartBlock.vue` — one optional `takeaway` prop
- `resources/js/components/reports/YearReportContent.vue` — bind takeaways, render the lead, drop the local `percentage` in favour of the helper
- `resources/js/components/reports/FundingGroupPanel.vue` + its spec
- `resources/js/components/reports/SpecialProjectsResearchPanel.vue` + its spec
- `resources/css/app.css` — five classes beside `.report-view-block-title`: the `--story` head modifier, `.report-view-block-takeaway`, `.report-view-story-lead`, its adjacent-sibling spacing rule, and `.report-view-story-note`

Not needed after all:
- A new `tests/Feature/ReportYearPublicPageTest.php` asserting `description` reaches the page props. [`tests/Feature/ReportHomepageTest.php:129`](../../../tests/Feature/ReportHomepageTest.php) already asserts `->where('year.description', ...)` against the `reports/Show` component, so the coverage exists.

`YearReportContent.vue` is at 551 lines against an 800 ceiling. All sentence logic lives in the helper so the file grows only by prop bindings; target under 600.

## Constraints

- No new npm or Composer dependencies.
- No migration. No schema change. No new route.
- Do not weaken or delete existing tests.
- `npm test -- <spec>` per task; `npm run lint` and `npx vue-tsc --noEmit` at the end; `php artisan test --compact --filter=ReportYearPublic` for the props test.
- Commit only on approval, `<type>: <description>` format.

## Tasks

### T1 — Story helper, test first
- [ ] Write `reportStory.spec.ts`: normal case, zero total → `null`, empty rows → `null`, near-parity wording, ties on "peak"/"largest" resolve to first row in input order, en-PH formatting.
- [ ] Run it, confirm red.
- [ ] Implement `reportStory.ts`:
  - `percentage(value, total): number` — moved verbatim from `YearReportContent.vue:53`
  - `sexShareTakeaway(subject, female, male): string | null`
  - `peakRowTakeaway(rows, template): string | null`
  - `fundingLeadTakeaway(stats: FundingGroupStats): string | null`
  - `yearSummaryLead({ year, female, male, projects, fundingAmount }): string[]` — 0 to 2 sentences
- [ ] Run it, confirm green.

### T2 — `ReportChartBlock` takeaway prop
- [ ] Spec first: renders the `<p>` after the `<h3>` when given; renders nothing extra and keeps current classes when `null` or omitted.
- [ ] Add `takeaway?: string | null` defaulting to `null`. When present, add `report-view-chart-head--story` to the head and render `<p class="report-view-block-takeaway">`.
- [ ] CSS: under `--story`, the title becomes `text-xs font-medium uppercase tracking-wide text-brand-200` (light: `text-slate-500`); the takeaway is `text-lg md:text-xl font-semibold text-brand-50 text-pretty max-w-[65ch] tabular-nums` (light: `text-slate-900`).

### T3 — Narrative lead on Overview
- [ ] `ReportStoryLead.vue`: props `description: string | null` and `sentences: string[]`; renders nothing when both are empty; description in a readable measure above the computed sentences.
- [ ] Render it at the top of the Overview tab, above `ReportMetricsGrid`.
- [ ] Spec for empty, description-only, sentences-only, and both.
- [ ] Pest test asserting `description` is present in the `reports/Show` props.

### T4 — Wire GFPS, Employees, Scholarship, RSTL
- [ ] One `computed` per takeaway in `YearReportContent.vue`, each a helper call. Bind `:takeaway` per the inventory.
- [ ] Replace the local `percentage` with the helper import.
- [ ] Check a published year with full data, and a year with empty sections — no takeaway, no layout shift.

### T5 — Funding and research panels
- [ ] Extend `FundingGroupPanel.spec.ts`: takeaway present on the jobs chart with data, absent on the heatmap.
- [ ] Add the lead above the metrics grid and the jobs-chart takeaway.
- [ ] Same for `SpecialProjectsResearchPanel.vue` and its spec.

### T6 — Verification
- [ ] Full `npm test`, then `npm run lint` and `npx vue-tsc --noEmit`.
- [ ] Playwright at 375px and 1440px, dark and `report-light`, all nine tabs: no overflow, takeaways wrap cleanly.
- [ ] Confirm `prefers-reduced-motion` gains no new motion.

## Phase 3, deferred: year-over-year

The single change that would most satisfy the auditor, and the one with real cost. `ReportYearPublicController` loads one year. Comparison needs the previous published year loaded and a `previous` prop, then sentences like "Women's share of scholars rose from 57.1% in 2024 to 61.4%." Backend work, its own plan, worth doing once A+B land.

## Out of scope

- `Print.vue` / `ReportPrintController`. The helper is reusable there afterwards.
- Per-section admin narrative (option C).
- Any change to figures, schema, or the admin edit screens beyond reading a field that already exists.

## Decisions taken during implementation

1. **Wording is "women / men"**, not "female / male". It reads naturally in a sentence and matches GAD report convention. Chart axis labels are unchanged.
2. **Money in prose is compact** (`₱29.5M`), confirmed by the requester as the more readable form for storytelling. See design rule 5.
3. **The computed lines sit above the `description`**, not below it as first drafted. The finding leads; the admin's note gives context under a rule.
4. **The funding lead is its own block** above the metrics grid, rather than a takeaway bolted onto `ReportMetricsGrid`.
5. **The funding tabs state no female-led share.** `fundingLeadTakeaway` and its sentence ("Female-led projects account for 26 of 59 (44.1%).") were removed at the requester's direction. The figure keeps its own "Female-led Projects" metric card on each tab. The funding family lead is therefore two sentences, not three: what was funded, then what was recorded against it. A regression test asserts `Female-led` never appears in the lead.
6. **Sentences name `male_amount + female_amount`, never `funded_projects_value`.** These tabs carry both, and they disagree: for CEST 2026 `funded_projects_value` (₱15,110,716.36) is ₱5.37M *larger* than `male_amount + female_amount` (₱9,741,790.92), while for SETUP and GIA it is smaller. Only the first is ever named in prose, so the two are never conflated — but a reader comparing the sentence to the "Value Funded" card will still see two different figures.

**Open for DOST IX:** which column answers "how much did this program fund" — `male_amount + female_amount`, or `funded_projects_value`? Until that is settled the "Value Funded" card and the lead sentence will appear to disagree.

## Open questions

1. **The `description` field:** it is currently written as a homepage blurb. Now that it is also the report's narrative lead, does existing copy need rewriting, and who owns it?
2. **Is the auditor's "storytelling" this** — findings on charts plus a narrative lead — or did they mean something closer to year-over-year trend narrative (phase 3)? Worth asking them directly; it changes the order, not the plan.
