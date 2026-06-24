@if(count($rows) === 0)
    <p class="note">{{ $emptyMessage }}</p>
@else
    <table class="data">
        <thead>
            <tr>
                <th style="width: 22%;">Category</th>
                <th class="num" style="width: 10%;">M. Proj.</th>
                <th class="num" style="width: 15%;">M. Amount</th>
                <th class="num" style="width: 10%;">F. Proj.</th>
                <th class="num" style="width: 15%;">F. Amount</th>
                <th class="num" style="width: 10%;">Total Proj.</th>
                <th class="num" style="width: 18%;">Total Funding</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rows as $row)
                <tr class="avoid-break">
                    <td class="strong">{{ $row['label'] }}</td>
                    <td class="num">{{ number_format($row['maleProjects']) }}</td>
                    <td class="num">PHP {{ number_format($row['maleAmount'], 2) }}</td>
                    <td class="num">{{ number_format($row['femaleProjects']) }}</td>
                    <td class="num">PHP {{ number_format($row['femaleAmount'], 2) }}</td>
                    <td class="num strong">{{ number_format($row['maleProjects'] + $row['femaleProjects']) }}</td>
                    <td class="num strong">PHP {{ number_format($row['maleAmount'] + $row['femaleAmount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
