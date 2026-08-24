@php
    /**
     * Applicants for one study level. Levels with nothing recorded are skipped
     * by the caller, so anything reaching here has at least one figure.
     */
    $levelRows = array_values(array_filter($rows, fn (array $row): bool => ($row['level'] ?? null) === $level));

    $femaleTotal = array_sum(array_map(fn (array $row): int => (int) ($row['female'] ?? 0), $levelRows));
    $maleTotal = array_sum(array_map(fn (array $row): int => (int) ($row['male'] ?? 0), $levelRows));
@endphp

@if($levelRows === [] || $femaleTotal + $maleTotal === 0)
    <p class="note">{{ $emptyMessage }}</p>
@else
    <table class="data">
        <thead>
            <tr>
                <th style="width: 46%;">Program</th>
                <th class="num" style="width: 18%;">Female</th>
                <th class="num" style="width: 18%;">Male</th>
                <th class="num" style="width: 18%;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($levelRows as $row)
                <tr class="avoid-break @if($loop->even)zebra @endif">
                    <td class="strong">{{ $row['fullName'] ?? $row['label'] }}</td>
                    <td class="num">{{ number_format((int) ($row['female'] ?? 0)) }}</td>
                    <td class="num">{{ number_format((int) ($row['male'] ?? 0)) }}</td>
                    <td class="num strong">{{ number_format((int) ($row['female'] ?? 0) + (int) ($row['male'] ?? 0)) }}</td>
                </tr>
            @endforeach
            <tr class="avoid-break">
                <td class="strong">Total</td>
                <td class="num strong">{{ number_format($femaleTotal) }}</td>
                <td class="num strong">{{ number_format($maleTotal) }}</td>
                <td class="num strong">{{ number_format($femaleTotal + $maleTotal) }}</td>
            </tr>
        </tbody>
    </table>
@endif
