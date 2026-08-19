@php
    /**
     * Rows carrying no metric at all are dropped rather than printed as a line
     * of zeros, so this table only appears for years where the data was entered.
     * Keys are null-coalesced because a synthesised fallback row (built from a
     * bare funding summary) carries the money columns only.
     */
    $metricKeys = [
        'fundedProjectsCount', 'fundedProjectsValue', 'trainingParticipants',
        'jobsTotal', 'jobsMale', 'jobsFemale', 'jobsPwd', 'jobsSeniorCitizen',
        'jobsIp', 'jobs4ps', 'specialProjectsResearchMale', 'specialProjectsResearchFemale',
    ];

    $metricRows = array_values(array_filter($rows, function (array $row) use ($metricKeys): bool {
        foreach ($metricKeys as $key) {
            if ((float) ($row[$key] ?? 0) > 0) {
                return true;
            }
        }

        return false;
    }));

    /** Renders "100 (50 m, 50 f, 5 PWD)" — total first, then only the non-zero groups. */
    $formatJobs = function (array $row): string {
        $total = (int) ($row['jobsTotal'] ?? 0);

        if ($total === 0) {
            return '—';
        }

        $parts = [];
        foreach ([
            'jobsMale' => 'm',
            'jobsFemale' => 'f',
            'jobsPwd' => 'Person with Disability',
            'jobsSeniorCitizen' => 'Senior Citizen',
            'jobsIp' => 'Indigenous People',
            'jobs4ps' => 'Pantawid Pamilyang Pilipino Program',
        ] as $key => $label) {
            $count = (int) ($row[$key] ?? 0);

            if ($count > 0) {
                $parts[] = $count.' '.$label;
            }
        }

        return $parts === [] ? (string) $total : $total.' ('.implode(', ', $parts).')';
    };

    $formatResearch = function (array $row): string {
        $male = (int) ($row['specialProjectsResearchMale'] ?? 0);
        $female = (int) ($row['specialProjectsResearchFemale'] ?? 0);

        return $male + $female > 0 ? ($male + $female).' ('.$male.' m, '.$female.' f)' : '—';
    };
@endphp

@if(count($metricRows) === 0)
    <p class="note">{{ $emptyMessage }}</p>
@else
    <table class="data">
        <thead>
            <tr>
                <th style="width: 20%;">Category</th>
                <th class="num" style="width: 10%;">Funded proj.</th>
                <th class="num" style="width: 16%;">Value funded</th>
                <th class="num" style="width: 10%;">Training</th>
                <th style="width: 28%;">Jobs generated</th>
                <th style="width: 16%;">Research (M/F)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($metricRows as $row)
                <tr class="avoid-break">
                    <td class="strong">{{ $row['label'] }}</td>
                    <td class="num">{{ number_format((int) ($row['fundedProjectsCount'] ?? 0)) }}</td>
                    <td class="num">PHP {{ number_format((float) ($row['fundedProjectsValue'] ?? 0), 2) }}</td>
                    <td class="num">{{ number_format((int) ($row['trainingParticipants'] ?? 0)) }}</td>
                    <td>{{ $formatJobs($row) }}</td>
                    <td>{{ $formatResearch($row) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
