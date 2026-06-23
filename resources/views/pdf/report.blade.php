<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report {{ $year['year'] }} - {{ $year['title'] }}</title>
    @vite(['resources/css/pdf.css'])
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            min-height: 0 !important;
            height: auto !important;
            background: #ffffff !important;
            color: #1e293b;
        }

        @media print {
            html,
            body {
                background: #ffffff !important;
            }

            .avoid-break {
                page-break-inside: avoid;
                break-inside: avoid;
            }

            thead {
                display: table-header-group;
            }

            tr {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }

        @page {
            size: A4 portrait;
            margin: 12mm;
        }

        body {
            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    </style>
</head>
<body class="bg-white text-slate-800">
    <div class="w-full">
        @include('pdf.partials.branding-header')

        <div class="mb-6 avoid-break">
            <h3 class="text-xl font-black text-slate-900 tracking-tight">Sex-Disaggregated Data Report</h3>
            <p class="mt-1 max-w-2xl text-xs text-slate-500">
                {{ $year['year'] }} &mdash; {{ $year['title'] }}
                @if($year['description'])
                    <span class="text-slate-400"> &middot; </span>{{ $year['description'] }}
                @endif
            </p>
        </div>

        @if(!$year['reportData'])
            <p class="text-xs italic text-slate-500">Data is pending and not yet published for this year.</p>
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
                            ['label' => 'Female Members', 'value' => number_format($gfpsFemale), 'meta' => $percentage($gfpsFemale, $gfpsTotal) . '%'],
                            ['label' => 'Male Members', 'value' => number_format($gfpsMale), 'meta' => $percentage($gfpsMale, $gfpsTotal) . '%'],
                        ],
                    ],
                    [
                        'title' => 'DOST IX Employees',
                        'metrics' => [
                            ['label' => 'Employment Types', 'value' => number_format($employeesTypeCount), 'meta' => 'Categories'],
                            ['label' => 'Total Employees', 'value' => number_format($employeesTotal)],
                            ['label' => 'Female Employees', 'value' => number_format($employeesFemale), 'meta' => $percentage($employeesFemale, $employeesTotal) . '%'],
                            ['label' => 'Male Employees', 'value' => number_format($employeesMale), 'meta' => $percentage($employeesMale, $employeesTotal) . '%'],
                        ],
                    ],
                    [
                        'title' => 'Scholarship',
                        'metrics' => [
                            ['label' => 'Total Scholars', 'value' => number_format($scholarshipTotal)],
                            ['label' => 'School Year', 'value' => $scholarshipSchoolYear ?: 'Not set', 'meta' => $scholarshipAsOfDate],
                            ['label' => 'Female Scholars', 'value' => number_format($scholarshipFemale), 'meta' => $percentage($scholarshipFemale, $scholarshipTotal) . '%'],
                            ['label' => 'Male Scholars', 'value' => number_format($scholarshipMale), 'meta' => $percentage($scholarshipMale, $scholarshipTotal) . '%'],
                        ],
                    ],
                    [
                        'title' => 'RSTL',
                        'metrics' => [
                            ['label' => 'Total Customers', 'value' => number_format($rstlTotal)],
                            ['label' => 'Period', 'value' => (string) $year['year'], 'meta' => 'Full Year'],
                            ['label' => 'Female', 'value' => number_format($rstlFemale), 'meta' => $percentage($rstlFemale, $rstlTotal) . '%'],
                            ['label' => 'Male', 'value' => number_format($rstlMale), 'meta' => $percentage($rstlMale, $rstlTotal) . '%'],
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
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">1. Overview</h4>
                <p class="mb-3 text-[11px] text-slate-500">
                    Validated figures across GFPS, employment, scholarship, RSTL, SETUP, and CEST programs.
                </p>

                <div class="mb-4 flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Female</p>
                        <p class="text-lg font-black tabular-nums text-slate-900">{{ number_format($totalFemaleAcrossPrograms) }}</p>
                        <p class="text-[11px] text-slate-500">All sections</p>
                    </div>
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Male</p>
                        <p class="text-lg font-black tabular-nums text-slate-900">{{ number_format($totalMaleAcrossPrograms) }}</p>
                        <p class="text-[11px] text-slate-500">All sections</p>
                    </div>
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Combined Projects</p>
                        <p class="text-lg font-black tabular-nums text-slate-900">{{ number_format($combinedProjects) }}</p>
                        <p class="text-[11px] text-slate-500">SETUP + CEST</p>
                    </div>
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Combined Funding</p>
                        <p class="text-sm font-black tabular-nums text-slate-900">{{ $formatCurrency($combinedFunding) }}</p>
                        <p class="text-[11px] text-slate-500">SETUP + CEST</p>
                    </div>
                </div>

                <p class="mb-1 text-xs font-semibold text-slate-700">Program Summary</p>
                <div class="space-y-4">
                    @foreach($overviewPrograms as $program)
                        <div class="avoid-break rounded-lg border border-slate-200 bg-white p-3">
                            <p class="mb-2 text-xs font-bold text-slate-800">{{ $program['title'] }}</p>
                            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                @foreach($program['metrics'] as $metric)
                                    <div class="min-w-0">
                                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">{{ $metric['label'] }}</p>
                                        <p class="text-sm font-black tabular-nums text-slate-900">{{ $metric['value'] }}</p>
                                        @if(!empty($metric['meta']))
                                            <p class="text-[11px] text-slate-500">{{ $metric['meta'] }}</p>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- 2. GFPS --}}
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">2. GFPS</h4>

                <p class="mb-1 mt-3 text-xs font-semibold text-slate-700">Membership by Sex</p>
                <table class="mb-4 w-full border-collapse text-left text-xs">
                    <thead>
                        <tr class="avoid-break bg-slate-900 text-white">
                            <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">Gender</th>
                            <th class="w-24 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Count</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Share</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr class="avoid-break">
                            <td class="px-2 py-1.5 font-medium text-slate-800">Female</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-800">{{ number_format($gfpsFemale) }}</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ $percentage($gfpsFemale, $gfpsTotal) }}%</td>
                        </tr>
                        <tr class="avoid-break">
                            <td class="px-2 py-1.5 font-medium text-slate-800">Male</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-800">{{ number_format($gfpsMale) }}</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ $percentage($gfpsMale, $gfpsTotal) }}%</td>
                        </tr>
                        <tr class="avoid-break bg-slate-50">
                            <td class="px-2 py-1.5 font-bold text-slate-900">Total</td>
                            <td class="px-2 py-1.5 text-right font-bold tabular-nums text-slate-900">{{ number_format($gfpsTotal) }}</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">100%</td>
                        </tr>
                    </tbody>
                </table>

                <p class="mb-1 text-xs font-semibold text-slate-700">Assembly Participation</p>
                <p class="mb-2 text-[11px] text-slate-500">Quarterly assembly attendance by sex</p>
                <table class="w-full border-collapse text-left text-xs">
                    <thead>
                        <tr class="avoid-break bg-slate-900 text-white">
                            <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">Period</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Female</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Male</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @forelse($data['gfpsAssemblies'] as $assembly)
                            <tr class="avoid-break">
                                <td class="px-2 py-1.5 font-medium text-slate-800">{{ $assembly['label'] }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($assembly['female']) }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($assembly['male']) }}</td>
                                <td class="px-2 py-1.5 text-right font-medium tabular-nums text-slate-800">{{ number_format($assembly['female'] + $assembly['male']) }}</td>
                            </tr>
                        @empty
                            <tr class="avoid-break">
                                <td colspan="4" class="px-2 py-1.5 italic text-slate-500">No assembly data recorded.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            {{-- 3. DOST IX Employees --}}
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">3. DOST IX Employees</h4>
                <p class="mb-2 text-[11px] text-slate-500">
                    Sex-disaggregated data as of December 31, {{ $year['year'] }}.
                    Total employees: {{ number_format($employeesTotal) }}
                    (Female {{ $percentage($employeesFemale, $employeesTotal) }}%, Male {{ $percentage($employeesMale, $employeesTotal) }}%).
                </p>
                <table class="w-full border-collapse text-left text-xs">
                    <thead>
                        <tr class="avoid-break bg-slate-900 text-white">
                            <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">Employment Status</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Female</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Male</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @forelse($data['employeeStatuses'] as $status)
                            <tr class="avoid-break">
                                <td class="px-2 py-1.5 font-medium text-slate-800">{{ $status['label'] }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($status['female']) }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($status['male']) }}</td>
                                <td class="px-2 py-1.5 text-right font-medium tabular-nums text-slate-800">{{ number_format($status['female'] + $status['male']) }}</td>
                            </tr>
                        @empty
                            <tr class="avoid-break">
                                <td colspan="4" class="px-2 py-1.5 italic text-slate-500">No employee data recorded.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            {{-- 4. Scholarship --}}
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">4. Scholarship</h4>
                <p class="mb-2 text-[11px] text-slate-500">
                    On-going scholars
                    @if($data['scholarship']['schoolYearLabel'] ?? null)
                        &middot; {{ $data['scholarship']['schoolYearLabel'] }}
                    @endif
                    @if($data['scholarship']['asOfDate'] ?? null)
                        &middot; Data as of {{ $data['scholarship']['asOfDate'] }}
                    @endif
                </p>
                <table class="mb-4 w-full border-collapse text-left text-xs">
                    <thead>
                        <tr class="avoid-break bg-slate-900 text-white">
                            <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">Gender</th>
                            <th class="w-24 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Count</th>
                            <th class="w-20 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Share</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr class="avoid-break">
                            <td class="px-2 py-1.5 font-medium text-slate-800">Female</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-800">{{ number_format($scholarshipFemale) }}</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ $percentage($scholarshipFemale, $scholarshipTotal) }}%</td>
                        </tr>
                        <tr class="avoid-break">
                            <td class="px-2 py-1.5 font-medium text-slate-800">Male</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-800">{{ number_format($scholarshipMale) }}</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ $percentage($scholarshipMale, $scholarshipTotal) }}%</td>
                        </tr>
                        <tr class="avoid-break bg-slate-50">
                            <td class="px-2 py-1.5 font-bold text-slate-900">Total</td>
                            <td class="px-2 py-1.5 text-right font-bold tabular-nums text-slate-900">{{ number_format($scholarshipTotal) }}</td>
                            <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">100%</td>
                        </tr>
                    </tbody>
                </table>

                @if(count($data['scholarshipHistory'] ?? []) > 1)
                    <p class="mb-1 text-xs font-semibold text-slate-700">Scholar Count History</p>
                    <table class="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr class="avoid-break bg-slate-900 text-white">
                                <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">As Of</th>
                                <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">School Year</th>
                                <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Female</th>
                                <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Male</th>
                                <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @foreach($data['scholarshipHistory'] as $entry)
                                <tr class="avoid-break">
                                    <td class="px-2 py-1.5 font-medium text-slate-800">{{ $entry['asOfDate'] ?? 'N/A' }}</td>
                                    <td class="px-2 py-1.5 text-slate-600">{{ $entry['schoolYearLabel'] ?: 'N/A' }}</td>
                                    <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($entry['femaleCount']) }}</td>
                                    <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($entry['maleCount']) }}</td>
                                    <td class="px-2 py-1.5 text-right font-medium tabular-nums text-slate-800">{{ number_format($entry['femaleCount'] + $entry['maleCount']) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            </div>

            {{-- 5. RSTL --}}
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">5. RSTL</h4>
                <p class="mb-2 text-[11px] text-slate-500">
                    Testing and calibration services for {{ $year['year'] }}.
                    Total customers: {{ number_format($rstlTotal) }}
                    (Female {{ $percentage($rstlFemale, $rstlTotal) }}%, Male {{ $percentage($rstlMale, $rstlTotal) }}%).
                </p>
                <table class="w-full border-collapse text-left text-xs">
                    <thead>
                        <tr class="avoid-break bg-slate-900 text-white">
                            <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">Month</th>
                            <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Female</th>
                            <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">F. Led</th>
                            <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Male</th>
                            <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">M. Led</th>
                            <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @forelse($data['rstlMonthly'] as $month)
                            @php
                                $monthFemale = (int) $month['female'] + (int) $month['femaleLed'];
                                $monthMale = (int) $month['male'] + (int) $month['maleLed'];
                            @endphp
                            <tr class="avoid-break">
                                <td class="px-2 py-1.5 font-medium text-slate-800">{{ $month['label'] }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($month['female']) }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($month['femaleLed']) }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($month['male']) }}</td>
                                <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($month['maleLed']) }}</td>
                                <td class="px-2 py-1.5 text-right font-medium tabular-nums text-slate-800">{{ number_format($monthFemale + $monthMale) }}</td>
                            </tr>
                        @empty
                            <tr class="avoid-break">
                                <td colspan="6" class="px-2 py-1.5 italic text-slate-500">No RSTL data recorded.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            {{-- 6. Program Funding --}}
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">6. Program Funding</h4>
                <div class="mb-4 flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Combined Projects</p>
                        <p class="text-lg font-black tabular-nums text-slate-900">{{ number_format($combinedProjects) }}</p>
                    </div>
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Combined Funding</p>
                        <p class="text-sm font-black tabular-nums text-slate-900">{{ $formatCurrency($combinedFunding) }}</p>
                    </div>
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">SETUP Funding</p>
                        <p class="text-sm font-black tabular-nums text-slate-900">{{ $formatCurrency($setupAmount) }}</p>
                        <p class="text-[11px] text-slate-500">{{ count($setupFundingRows) }} categories</p>
                    </div>
                    <div class="min-w-[7rem] flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">CEST Funding</p>
                        <p class="text-sm font-black tabular-nums text-slate-900">{{ $formatCurrency($cestAmount) }}</p>
                        <p class="text-[11px] text-slate-500">{{ count($cestFundingRows) }} categories</p>
                    </div>
                </div>

                <p class="mb-1 text-xs font-semibold text-slate-700">SETUP Categories</p>
                @include('pdf.partials.funding-category-table', ['rows' => $setupFundingRows, 'emptyMessage' => 'No SETUP category data yet.'])

                <p class="mb-1 mt-4 text-xs font-semibold text-slate-700">CEST Categories</p>
                @include('pdf.partials.funding-category-table', ['rows' => $cestFundingRows, 'emptyMessage' => 'No CEST category data yet.'])
            </div>

            {{-- 7. Setup --}}
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">7. Setup</h4>
                <p class="mb-2 text-[11px] text-slate-500">Small Enterprise Technology Upgrading Program (SETUP) &middot; {{ $year['year'] }}</p>
                <div class="mb-4 flex flex-wrap gap-4 text-xs">
                    <div><span class="text-slate-500">Categories:</span> <span class="font-semibold tabular-nums">{{ count($setupFundingRows) }}</span></div>
                    <div><span class="text-slate-500">Total projects:</span> <span class="font-semibold tabular-nums">{{ number_format($setupProjects) }}</span></div>
                    <div><span class="text-slate-500">Total funding:</span> <span class="font-semibold tabular-nums">{{ $formatCurrency($setupAmount) }}</span></div>
                    <div><span class="text-slate-500">Male-led:</span> <span class="font-semibold tabular-nums">{{ number_format($setupTotals['maleProjects']) }}</span></div>
                    <div><span class="text-slate-500">Female-led:</span> <span class="font-semibold tabular-nums">{{ number_format($setupTotals['femaleProjects']) }}</span></div>
                </div>
                @include('pdf.partials.funding-detail-table', ['rows' => $setupFundingRows, 'emptyMessage' => 'No SETUP category data yet for this year.'])
            </div>

            {{-- 8. CEST --}}
            <div class="mb-6">
                <h4 class="mb-2 border-b border-slate-200 pb-1 text-base font-bold text-slate-800">8. CEST</h4>
                <p class="mb-2 text-[11px] text-slate-500">Community Empowerment thru Science and Technology (CEST) &middot; {{ $year['year'] }}</p>
                <div class="mb-4 flex flex-wrap gap-4 text-xs">
                    <div><span class="text-slate-500">Categories:</span> <span class="font-semibold tabular-nums">{{ count($cestFundingRows) }}</span></div>
                    <div><span class="text-slate-500">Total projects:</span> <span class="font-semibold tabular-nums">{{ number_format($cestProjects) }}</span></div>
                    <div><span class="text-slate-500">Total funding:</span> <span class="font-semibold tabular-nums">{{ $formatCurrency($cestAmount) }}</span></div>
                    <div><span class="text-slate-500">Male-led:</span> <span class="font-semibold tabular-nums">{{ number_format($cestTotals['maleProjects']) }}</span></div>
                    <div><span class="text-slate-500">Female-led:</span> <span class="font-semibold tabular-nums">{{ number_format($cestTotals['femaleProjects']) }}</span></div>
                </div>
                @include('pdf.partials.funding-detail-table', ['rows' => $cestFundingRows, 'emptyMessage' => 'No CEST category data yet for this year.'])
            </div>
        @endif
    </div>
</body>
</html>
