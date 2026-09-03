{{--
    Special projects research, one row per province.

    Not a SETUP/CEST/GIA metric — it is recorded once per province against the
    `research-*` funding programs, so it prints as its own section rather than a
    column on each family's metrics table.

    @param array  $rows         Provincial research rows.
    @param string $emptyMessage Printed when nothing was recorded.
--}}
@php
    /**
     * A province that recorded nothing is dropped rather than printed as a line
     * of zeros: the columns default to zero, so an all-zero row means "never
     * entered" rather than "measured as none".
     */
    $researchRows = array_values(array_filter($rows, static function (array $row): bool {
        return (int) ($row['specialProjectsResearchMale'] ?? 0) + (int) ($row['specialProjectsResearchFemale'] ?? 0) > 0;
    }));

    /** The programme names carry a shared prefix; the column reads better without it. */
    $provinceLabel = static function (array $row): string {
        return trim(str_replace('Special Projects Research', '', (string) $row['label']));
    };
@endphp

@if(count($researchRows) === 0)
    <p class="note">{{ $emptyMessage }}</p>
@else
    <table class="data">
        <thead>
            <tr>
                <th style="width: 40%;">Category</th>
                <th class="num" style="width: 20%;">Female</th>
                <th class="num" style="width: 20%;">Male</th>
                <th class="num" style="width: 20%;">Total researchers</th>
            </tr>
        </thead>
        <tbody>
            @foreach($researchRows as $row)
                @php
                    $female = (int) ($row['specialProjectsResearchFemale'] ?? 0);
                    $male = (int) ($row['specialProjectsResearchMale'] ?? 0);
                @endphp
                <tr class="avoid-break @if($loop->even)zebra @endif">
                    <td class="strong">{{ $provinceLabel($row) }}</td>
                    <td class="num">{{ number_format($female) }}</td>
                    <td class="num">{{ number_format($male) }}</td>
                    <td class="num">{{ number_format($female + $male) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
