<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Report {{ $year['year'] }} - {{ $year['title'] }}</title>
    <style>
        /* ---------------------------------------------------------------
           dompdf-compatible stylesheet (CSS 2.1 only).
           No flexbox, no grid, no CSS variables, no oklch(), no bundler hooks.
           Layout is table-based; colors are hex; font is bundled DejaVu Sans.
        ---------------------------------------------------------------- */

        @page {
            margin: 14mm 14mm 14mm 14mm;
        }

        /* NOTE: do NOT set margin/padding on the `html` element. dompdf treats the
           html box as the page box, and zeroing it collapses the @page margin to 0
           (content renders edge-to-edge). Keep the reset on `body` only. */
        body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #1e293b;
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 9px;
            line-height: 1.35;
        }

        p {
            margin: 0;
        }

        /* --- Repeating page footer (rendered on every page by dompdf) --- */
        .footer {
            position: fixed;
            left: 0;
            right: 0;
            bottom: -14mm;
            height: 10mm;
        }

        table.footer-inner {
            width: 100%;
            border-collapse: collapse;
            border-top: 1px solid #e2e8f0;
        }

        table.footer-inner td {
            padding-top: 4px;
            font-size: 7.5px;
            color: #94a3b8;
        }

        .footer-org {
            text-align: left;
        }

        .footer-page {
            text-align: right;
        }

        .footer-page .pageno:after {
            content: "Page " counter(page) " of " counter(pages);
        }

        /* --- Branding header --- */
        table.brand {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 2px solid #0f172a;
            margin-bottom: 10px;
        }

        table.brand td {
            padding: 0 0 6px 0;
            vertical-align: bottom;
        }

        .brand-logo {
            display: inline-block;
            margin-right: 8px;
            vertical-align: bottom;
        }

        .brand-org {
            text-align: right;
        }

        .org-1 {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #334155;
        }

        .org-2 {
            font-size: 8.5px;
            color: #64748b;
        }

        /* --- Report title block --- */
        .eyebrow {
            font-size: 8px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #64748b;
        }

        .report-title {
            font-size: 21px;
            font-weight: bold;
            letter-spacing: -0.4px;
            color: #0f172a;
            margin-top: 3px;
        }

        .report-meta {
            font-size: 9.5px;
            color: #64748b;
            margin-top: 4px;
        }

        .report-meta .dot {
            color: #cbd5e1;
        }

        .title-block {
            margin-bottom: 12px;
        }

        /* --- Sections --- */
        .section {
            margin-bottom: 12px;
        }

        .section-title {
            font-size: 12.5px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1.5px solid #0f172a;
            padding-bottom: 3px;
            margin: 0 0 6px 0;
        }

        .section-num {
            color: #94a3b8;
        }

        .subhead {
            font-size: 9.5px;
            font-weight: bold;
            color: #334155;
            margin: 7px 0 3px 0;
        }

        .note {
            font-size: 8.5px;
            color: #64748b;
            margin: 0 0 5px 0;
        }

        .pending {
            font-size: 9.5px;
            font-style: italic;
            color: #64748b;
        }

        /* --- KPI strip --- */
        table.kpi {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
            margin-bottom: 8px;
        }

        table.kpi td {
            width: 25%;
            padding: 6px 8px;
            border-right: 1px solid #e2e8f0;
            vertical-align: top;
        }

        table.kpi td.last {
            border-right: none;
        }

        .kpi-label {
            font-size: 7.5px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #64748b;
        }

        .kpi-value {
            font-size: 13px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 1px;
        }

        .kpi-value.sm {
            font-size: 10.5px;
        }

        .kpi-sub {
            font-size: 7.5px;
            color: #94a3b8;
            margin-top: 1px;
        }

        /* --- Program summary blocks --- */
        table.prog {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e2e8f0;
            margin-bottom: 4px;
        }

        table.prog td.prog-title {
            background-color: #f1f5f9;
            font-size: 9px;
            font-weight: bold;
            color: #0f172a;
            padding: 3px 7px;
        }

        table.prog td.metric {
            padding: 4px 7px;
            border-top: 1px solid #e2e8f0;
            border-right: 1px solid #f1f5f9;
            vertical-align: top;
        }

        table.prog td.metric.last {
            border-right: none;
        }

        .metric-label {
            font-size: 7.5px;
            font-weight: bold;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            color: #64748b;
        }

        .metric-value {
            font-size: 11px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 1px;
        }

        .metric-meta {
            font-size: 7.5px;
            color: #94a3b8;
        }

        /* --- Facts strip (SETUP / CEST summaries) --- */
        .facts {
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
            padding: 4px 7px;
            font-size: 8.5px;
            color: #475569;
            margin-bottom: 5px;
        }

        .facts .k {
            color: #94a3b8;
        }

        .facts .v {
            color: #0f172a;
            font-weight: bold;
        }

        .facts .sep {
            color: #cbd5e1;
        }

        /* --- Data tables --- */
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 3px;
        }

        table.data thead {
            display: table-header-group;
        }

        table.data th {
            background-color: #0f172a;
            color: #ffffff;
            font-size: 7.5px;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            text-align: left;
            padding: 4px 6px;
        }

        table.data td {
            font-size: 8.5px;
            color: #334155;
            padding: 3px 6px;
            border-bottom: 1px solid #f1f5f9;
        }

        table.data th.num,
        table.data td.num {
            text-align: right;
        }

        table.data td.strong {
            font-weight: bold;
            color: #0f172a;
        }

        table.data tr.total td {
            background-color: #f8fafc;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
        }

        /* --- Page-break safety --- */
        .avoid-break {
            page-break-inside: avoid;
        }

        tr {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="footer">
        <table class="footer-inner">
            <tr>
                <td class="footer-org">DOST Region IX &middot; Gender and Development Corner</td>
                <td class="footer-page"><span class="pageno"></span></td>
            </tr>
        </table>
    </div>

    @include('pdf.partials.branding-header')

    <div class="title-block avoid-break">
        <p class="eyebrow">Sex-Disaggregated Data Report</p>
        <p class="report-title">{{ $year['year'] }} &mdash; {{ $year['title'] }}</p>
        @if($year['description'])
            <p class="report-meta">{{ $year['description'] }}</p>
        @endif
    </div>

    @if(!$year['reportData'])
        <p class="pending">Data is pending and not yet published for this year.</p>
    @else
        @php
            $data = $year['reportData'];

            $percentage = static function (int $value, int $total): float {
                if ($total === 0) {
                    return 0.0;
                }

                return round(($value / $total) * 100, 1);
            };

            $formatCurrency = static fn (float $value): string => 'PHP ' . number_format($value, 2);

            $formatPercentage = static function (int $value, int $total) use ($percentage): string {
                if ($total === 0) {
                    return 'No data yet';
                }

                return $percentage($value, $total) . '%';
            };

            $sumFundingRows = static function (array $rows): array {
                return array_reduce($rows, static function (array $carry, array $row): array {
                    $carry['maleProjects'] += (int) $row['maleProjects'];
                    $carry['maleAmount'] += (float) $row['maleAmount'];
                    $carry['femaleProjects'] += (int) $row['femaleProjects'];
                    $carry['femaleAmount'] += (float) $row['femaleAmount'];

                    return $carry;
                }, [
                    'maleProjects' => 0,
                    'maleAmount' => 0.0,
                    'femaleProjects' => 0,
                    'femaleAmount' => 0.0,
                ]);
            };

            $resolveFundingRows = static function (array $breakdown, array $summary, string $fallbackLabel, string $fallbackSlug): array {
                if (count($breakdown) > 0) {
                    return $breakdown;
                }

                if (($summary['maleProjects'] ?? 0) > 0 || ($summary['femaleProjects'] ?? 0) > 0) {
                    return [[
                        'label' => $fallbackLabel,
                        'slug' => $fallbackSlug,
                        'maleProjects' => (int) $summary['maleProjects'],
                        'maleAmount' => (float) $summary['maleAmount'],
                        'femaleProjects' => (int) $summary['femaleProjects'],
                        'femaleAmount' => (float) $summary['femaleAmount'],
                    ]];
                }

                return [];
            };

            $gfpsFemale = (int) $data['gfpsMembership']['femaleCount'];
            $gfpsMale = (int) $data['gfpsMembership']['maleCount'];
            $gfpsTotal = $gfpsFemale + $gfpsMale;

            $employeesFemale = (int) array_sum(array_column($data['employeeStatuses'], 'female'));
            $employeesMale = (int) array_sum(array_column($data['employeeStatuses'], 'male'));
            $employeesTotal = $employeesFemale + $employeesMale;

            $scholarshipFemale = (int) $data['scholarship']['femaleCount'];
            $scholarshipMale = (int) $data['scholarship']['maleCount'];
            $scholarshipTotal = $scholarshipFemale + $scholarshipMale;

            $rstlFemale = 0;
            $rstlMale = 0;
            foreach ($data['rstlMonthly'] as $month) {
                $rstlFemale += (int) $month['female'] + (int) $month['femaleLed'];
                $rstlMale += (int) $month['male'] + (int) $month['maleLed'];
            }
            $rstlTotal = $rstlFemale + $rstlMale;

            $setupFundingRows = $resolveFundingRows(
                $data['setupFundingBreakdown'],
                $data['setupFunding'],
                'SETUP',
                'setup',
            );
            $cestFundingRows = $resolveFundingRows(
                $data['cestFundingBreakdown'],
                $data['cestFunding'],
                'CEST',
                'cest',
            );

            $setupTotals = $sumFundingRows($setupFundingRows);
            $cestTotals = $sumFundingRows($cestFundingRows);

            $setupProjects = $setupTotals['maleProjects'] + $setupTotals['femaleProjects'];
            $setupAmount = $setupTotals['maleAmount'] + $setupTotals['femaleAmount'];
            $cestProjects = $cestTotals['maleProjects'] + $cestTotals['femaleProjects'];
            $cestAmount = $cestTotals['maleAmount'] + $cestTotals['femaleAmount'];

            $combinedProjects = $setupProjects + $cestProjects;
            $combinedFunding = $setupAmount + $cestAmount;

            $totalFemaleAcrossPrograms = $gfpsFemale + $employeesFemale + $scholarshipFemale + $rstlFemale;
            $totalMaleAcrossPrograms = $gfpsMale + $employeesMale + $scholarshipMale + $rstlMale;

            $gfpsAssemblyCount = count($data['gfpsAssemblies']);
            $employeesTypeCount = count($data['employeeStatuses']);
            $scholarshipSchoolYear = $data['scholarship']['schoolYearLabel'] ?? 'Not set';
            $scholarshipAsOfDate = $data['scholarship']['asOfDate'] ?? 'No date set';

            $overviewPrograms = [
                [
                    'title' => 'GFPS',
                    'metrics' => [
                        ['label' => 'Total Members', 'value' => number_format($gfpsTotal)],
                        ['label' => 'GFPS Assemblies', 'value' => number_format($gfpsAssemblyCount), 'meta' => 'Quarterly'],
                        ['label' => 'Female Members', 'value' => number_format($gfpsFemale), 'meta' => $formatPercentage($gfpsFemale, $gfpsTotal)],
                        ['label' => 'Male Members', 'value' => number_format($gfpsMale), 'meta' => $formatPercentage($gfpsMale, $gfpsTotal)],
                    ],
                ],
                [
                    'title' => 'DOST IX Employees',
                    'metrics' => [
                        ['label' => 'Employment Types', 'value' => number_format($employeesTypeCount), 'meta' => 'Categories'],
                        ['label' => 'Total Employees', 'value' => number_format($employeesTotal)],
                        ['label' => 'Female Employees', 'value' => number_format($employeesFemale), 'meta' => $formatPercentage($employeesFemale, $employeesTotal)],
                        ['label' => 'Male Employees', 'value' => number_format($employeesMale), 'meta' => $formatPercentage($employeesMale, $employeesTotal)],
                    ],
                ],
                [
                    'title' => 'Scholarship',
                    'metrics' => [
                        ['label' => 'Total Scholars', 'value' => number_format($scholarshipTotal)],
                        ['label' => 'School Year', 'value' => $scholarshipSchoolYear ?: 'Not set', 'meta' => $scholarshipAsOfDate],
                        ['label' => 'Female Scholars', 'value' => number_format($scholarshipFemale), 'meta' => $formatPercentage($scholarshipFemale, $scholarshipTotal)],
                        ['label' => 'Male Scholars', 'value' => number_format($scholarshipMale), 'meta' => $formatPercentage($scholarshipMale, $scholarshipTotal)],
                    ],
                ],
                [
                    'title' => 'RSTL',
                    'metrics' => [
                        ['label' => 'Total Customers', 'value' => number_format($rstlTotal)],
                        ['label' => 'Period', 'value' => (string) $year['year'], 'meta' => 'Full Year'],
                        ['label' => 'Female', 'value' => number_format($rstlFemale), 'meta' => $formatPercentage($rstlFemale, $rstlTotal)],
                        ['label' => 'Male', 'value' => number_format($rstlMale), 'meta' => $formatPercentage($rstlMale, $rstlTotal)],
                    ],
                ],
                [
                    'title' => 'Program Funding',
                    'metrics' => [
                        ['label' => 'Combined Projects', 'value' => number_format($combinedProjects)],
                        ['label' => 'Combined Funding', 'value' => $formatCurrency($combinedFunding)],
                        ['label' => 'SETUP Funding', 'value' => $formatCurrency($setupAmount), 'meta' => count($setupFundingRows) . ' Categories'],
                        ['label' => 'CEST Funding', 'value' => $formatCurrency($cestAmount), 'meta' => count($cestFundingRows) . ' Categories'],
                    ],
                ],
                [
                    'title' => 'SETUP',
                    'metrics' => [
                        ['label' => 'Categories', 'value' => number_format(count($setupFundingRows))],
                        ['label' => 'Total Projects', 'value' => number_format($setupProjects)],
                        ['label' => 'Total Funding', 'value' => $formatCurrency($setupAmount)],
                        ['label' => 'Male-led Projects', 'value' => number_format($setupTotals['maleProjects'])],
                        ['label' => 'Female-led Projects', 'value' => number_format($setupTotals['femaleProjects'])],
                    ],
                ],
                [
                    'title' => 'CEST',
                    'metrics' => [
                        ['label' => 'Categories', 'value' => number_format(count($cestFundingRows))],
                        ['label' => 'Total Projects', 'value' => number_format($cestProjects)],
                        ['label' => 'Total Funding', 'value' => $formatCurrency($cestAmount)],
                        ['label' => 'Male-led Projects', 'value' => number_format($cestTotals['maleProjects'])],
                        ['label' => 'Female-led Projects', 'value' => number_format($cestTotals['femaleProjects'])],
                    ],
                ],
            ];
        @endphp

        {{-- 1. Overview --}}
        <div class="section">
            <p class="section-title"><span class="section-num">1.</span> Overview</p>
            <p class="note">Validated figures across GFPS, employment, scholarship, RSTL, SETUP, and CEST programs.</p>

            <table class="kpi avoid-break">
                <tr>
                    <td>
                        <p class="kpi-label">Total Female</p>
                        <p class="kpi-value">{{ number_format($totalFemaleAcrossPrograms) }}</p>
                        <p class="kpi-sub">All sections</p>
                    </td>
                    <td>
                        <p class="kpi-label">Total Male</p>
                        <p class="kpi-value">{{ number_format($totalMaleAcrossPrograms) }}</p>
                        <p class="kpi-sub">All sections</p>
                    </td>
                    <td>
                        <p class="kpi-label">Combined Projects</p>
                        <p class="kpi-value">{{ number_format($combinedProjects) }}</p>
                        <p class="kpi-sub">SETUP + CEST</p>
                    </td>
                    <td class="last">
                        <p class="kpi-label">Combined Funding</p>
                        <p class="kpi-value sm">{{ $formatCurrency($combinedFunding) }}</p>
                        <p class="kpi-sub">SETUP + CEST</p>
                    </td>
                </tr>
            </table>

            <p class="subhead">Program Summary</p>
            @foreach($overviewPrograms as $program)
                @php $metricCount = count($program['metrics']); @endphp
                <table class="prog avoid-break">
                    <tr>
                        <td class="prog-title" colspan="{{ $metricCount }}">{{ $program['title'] }}</td>
                    </tr>
                    <tr>
                        @foreach($program['metrics'] as $index => $metric)
                            <td class="metric {{ $index === $metricCount - 1 ? 'last' : '' }}" style="width: {{ round(100 / $metricCount, 4) }}%;">
                                <p class="metric-label">{{ $metric['label'] }}</p>
                                <p class="metric-value">{{ $metric['value'] }}</p>
                                @if(!empty($metric['meta']))
                                    <p class="metric-meta">{{ $metric['meta'] }}</p>
                                @endif
                            </td>
                        @endforeach
                    </tr>
                </table>
            @endforeach
        </div>

        {{-- 2. GFPS --}}
        <div class="section">
            <p class="section-title"><span class="section-num">2.</span> GFPS</p>

            <p class="subhead">Membership by Sex</p>
            <table class="data">
                <thead>
                    <tr>
                        <th>Gender</th>
                        <th class="num" style="width: 24%;">Count</th>
                        <th class="num" style="width: 20%;">Share</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="avoid-break">
                        <td class="strong">Female</td>
                        <td class="num">{{ number_format($gfpsFemale) }}</td>
                        <td class="num">{{ $formatPercentage($gfpsFemale, $gfpsTotal) }}</td>
                    </tr>
                    <tr class="avoid-break">
                        <td class="strong">Male</td>
                        <td class="num">{{ number_format($gfpsMale) }}</td>
                        <td class="num">{{ $formatPercentage($gfpsMale, $gfpsTotal) }}</td>
                    </tr>
                    <tr class="total avoid-break">
                        <td>Total</td>
                        <td class="num">{{ number_format($gfpsTotal) }}</td>
                        <td class="num">100%</td>
                    </tr>
                </tbody>
            </table>

            <p class="subhead">Assembly Participation</p>
            <p class="note">Quarterly assembly attendance by sex.</p>
            <table class="data">
                <thead>
                    <tr>
                        <th>Period</th>
                        <th class="num" style="width: 20%;">Female</th>
                        <th class="num" style="width: 20%;">Male</th>
                        <th class="num" style="width: 20%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($data['gfpsAssemblies'] as $assembly)
                        <tr class="avoid-break">
                            <td class="strong">{{ $assembly['label'] }}</td>
                            <td class="num">{{ number_format($assembly['female']) }}</td>
                            <td class="num">{{ number_format($assembly['male']) }}</td>
                            <td class="num strong">{{ number_format($assembly['female'] + $assembly['male']) }}</td>
                        </tr>
                    @empty
                        <tr class="avoid-break">
                            <td colspan="4" class="note" style="border-bottom: none;">No assembly data recorded.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- 3. DOST IX Employees --}}
        <div class="section">
            <p class="section-title"><span class="section-num">3.</span> DOST IX Employees</p>
            <p class="note">
                Sex-disaggregated data as of December 31, {{ $year['year'] }}.
                Total employees: {{ number_format($employeesTotal) }}
                (Female {{ $formatPercentage($employeesFemale, $employeesTotal) }}, Male {{ $formatPercentage($employeesMale, $employeesTotal) }}).
            </p>
            <table class="data">
                <thead>
                    <tr>
                        <th>Employment Status</th>
                        <th class="num" style="width: 20%;">Female</th>
                        <th class="num" style="width: 20%;">Male</th>
                        <th class="num" style="width: 20%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($data['employeeStatuses'] as $status)
                        <tr class="avoid-break">
                            <td class="strong">{{ $status['label'] }}</td>
                            <td class="num">{{ number_format($status['female']) }}</td>
                            <td class="num">{{ number_format($status['male']) }}</td>
                            <td class="num strong">{{ number_format($status['female'] + $status['male']) }}</td>
                        </tr>
                    @empty
                        <tr class="avoid-break">
                            <td colspan="4" class="note" style="border-bottom: none;">No employee data recorded.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- 4. Scholarship --}}
        <div class="section">
            <p class="section-title"><span class="section-num">4.</span> Scholarship</p>
            <p class="note">
                On-going scholars
                @if($data['scholarship']['schoolYearLabel'] ?? null)
                    &middot; {{ $data['scholarship']['schoolYearLabel'] }}
                @endif
                @if($data['scholarship']['asOfDate'] ?? null)
                    &middot; Data as of {{ $data['scholarship']['asOfDate'] }}
                @endif
            </p>
            <table class="data">
                <thead>
                    <tr>
                        <th>Gender</th>
                        <th class="num" style="width: 24%;">Count</th>
                        <th class="num" style="width: 20%;">Share</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="avoid-break">
                        <td class="strong">Female</td>
                        <td class="num">{{ number_format($scholarshipFemale) }}</td>
                        <td class="num">{{ $formatPercentage($scholarshipFemale, $scholarshipTotal) }}</td>
                    </tr>
                    <tr class="avoid-break">
                        <td class="strong">Male</td>
                        <td class="num">{{ number_format($scholarshipMale) }}</td>
                        <td class="num">{{ $formatPercentage($scholarshipMale, $scholarshipTotal) }}</td>
                    </tr>
                    <tr class="total avoid-break">
                        <td>Total</td>
                        <td class="num">{{ number_format($scholarshipTotal) }}</td>
                        <td class="num">100%</td>
                    </tr>
                </tbody>
            </table>

            @if(count($data['scholarshipHistory'] ?? []) > 1)
                <p class="subhead">Scholar Count History</p>
                <table class="data">
                    <thead>
                        <tr>
                            <th>As Of</th>
                            <th>School Year</th>
                            <th class="num" style="width: 14%;">Female</th>
                            <th class="num" style="width: 14%;">Male</th>
                            <th class="num" style="width: 14%;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($data['scholarshipHistory'] as $entry)
                            <tr class="avoid-break">
                                <td class="strong">{{ $entry['asOfDate'] ?? 'N/A' }}</td>
                                <td>{{ $entry['schoolYearLabel'] ?: 'N/A' }}</td>
                                <td class="num">{{ number_format($entry['femaleCount']) }}</td>
                                <td class="num">{{ number_format($entry['maleCount']) }}</td>
                                <td class="num strong">{{ number_format($entry['femaleCount'] + $entry['maleCount']) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>

        {{-- 5. RSTL --}}
        <div class="section">
            <p class="section-title"><span class="section-num">5.</span> RSTL</p>
            <p class="note">
                Testing and calibration services for {{ $year['year'] }}.
                Total customers: {{ number_format($rstlTotal) }}
                (Female {{ $formatPercentage($rstlFemale, $rstlTotal) }}, Male {{ $formatPercentage($rstlMale, $rstlTotal) }}).
            </p>
            <table class="data">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th class="num" style="width: 13%;">Female</th>
                        <th class="num" style="width: 13%;">F. Led</th>
                        <th class="num" style="width: 13%;">Male</th>
                        <th class="num" style="width: 13%;">M. Led</th>
                        <th class="num" style="width: 14%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($data['rstlMonthly'] as $month)
                        @php
                            $monthFemale = (int) $month['female'] + (int) $month['femaleLed'];
                            $monthMale = (int) $month['male'] + (int) $month['maleLed'];
                        @endphp
                        <tr class="avoid-break">
                            <td class="strong">{{ $month['label'] }}</td>
                            <td class="num">{{ number_format($month['female']) }}</td>
                            <td class="num">{{ number_format($month['femaleLed']) }}</td>
                            <td class="num">{{ number_format($month['male']) }}</td>
                            <td class="num">{{ number_format($month['maleLed']) }}</td>
                            <td class="num strong">{{ number_format($monthFemale + $monthMale) }}</td>
                        </tr>
                    @empty
                        <tr class="avoid-break">
                            <td colspan="6" class="note" style="border-bottom: none;">No RSTL data recorded.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- 6. Program Funding --}}
        <div class="section">
            <p class="section-title"><span class="section-num">6.</span> Program Funding</p>

            <table class="kpi avoid-break">
                <tr>
                    <td>
                        <p class="kpi-label">Combined Projects</p>
                        <p class="kpi-value">{{ number_format($combinedProjects) }}</p>
                    </td>
                    <td>
                        <p class="kpi-label">Combined Funding</p>
                        <p class="kpi-value sm">{{ $formatCurrency($combinedFunding) }}</p>
                    </td>
                    <td>
                        <p class="kpi-label">SETUP Funding</p>
                        <p class="kpi-value sm">{{ $formatCurrency($setupAmount) }}</p>
                        <p class="kpi-sub">{{ count($setupFundingRows) }} categories</p>
                    </td>
                    <td class="last">
                        <p class="kpi-label">CEST Funding</p>
                        <p class="kpi-value sm">{{ $formatCurrency($cestAmount) }}</p>
                        <p class="kpi-sub">{{ count($cestFundingRows) }} categories</p>
                    </td>
                </tr>
            </table>

            <p class="subhead">SETUP Categories</p>
            @include('pdf.partials.funding-category-table', ['rows' => $setupFundingRows, 'emptyMessage' => 'No SETUP category data yet.'])

            <p class="subhead">CEST Categories</p>
            @include('pdf.partials.funding-category-table', ['rows' => $cestFundingRows, 'emptyMessage' => 'No CEST category data yet.'])
        </div>

        {{-- 7. Setup --}}
        <div class="section">
            <p class="section-title"><span class="section-num">7.</span> Setup</p>
            <p class="note">Small Enterprise Technology Upgrading Program (SETUP) &middot; {{ $year['year'] }}</p>
            <div class="facts avoid-break">
                <span class="k">Categories</span> <span class="v">{{ count($setupFundingRows) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Total projects</span> <span class="v">{{ number_format($setupProjects) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Total funding</span> <span class="v">{{ $formatCurrency($setupAmount) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Male-led</span> <span class="v">{{ number_format($setupTotals['maleProjects']) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Female-led</span> <span class="v">{{ number_format($setupTotals['femaleProjects']) }}</span>
            </div>
            @include('pdf.partials.funding-detail-table', ['rows' => $setupFundingRows, 'emptyMessage' => 'No SETUP category data yet for this year.'])
            @include('pdf.partials.funding-metrics-table', ['rows' => $setupFundingRows, 'emptyMessage' => 'No SETUP program metrics recorded for this year.'])
        </div>

        {{-- 8. CEST --}}
        <div class="section">
            <p class="section-title"><span class="section-num">8.</span> CEST</p>
            <p class="note">Community Empowerment thru Science and Technology (CEST) &middot; {{ $year['year'] }}</p>
            <div class="facts avoid-break">
                <span class="k">Categories</span> <span class="v">{{ count($cestFundingRows) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Total projects</span> <span class="v">{{ number_format($cestProjects) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Total funding</span> <span class="v">{{ $formatCurrency($cestAmount) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Male-led</span> <span class="v">{{ number_format($cestTotals['maleProjects']) }}</span>
                <span class="sep">&nbsp;&middot;&nbsp;</span>
                <span class="k">Female-led</span> <span class="v">{{ number_format($cestTotals['femaleProjects']) }}</span>
            </div>
            @include('pdf.partials.funding-detail-table', ['rows' => $cestFundingRows, 'emptyMessage' => 'No CEST category data yet for this year.'])
            @include('pdf.partials.funding-metrics-table', ['rows' => $cestFundingRows, 'emptyMessage' => 'No CEST program metrics recorded for this year.'])
        </div>
    @endif
</body>
</html>
