@if(count($rows) === 0)
    <p class="note">{{ $emptyMessage }}</p>
@else
    <table class="data">
        <thead>
            <tr>
                <th>Category</th>
                <th class="num" style="width: 22%;">Projects</th>
                <th class="num" style="width: 28%;">Funding</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rows as $row)
                <tr class="avoid-break">
                    <td class="strong">{{ $row['label'] }}</td>
                    <td class="num strong">{{ number_format($row['maleProjects'] + $row['femaleProjects']) }}</td>
                    <td class="num strong">PHP {{ number_format($row['maleAmount'] + $row['femaleAmount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
