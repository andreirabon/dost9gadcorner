@if(count($rows) === 0)
    <p class="text-xs italic text-slate-500">{{ $emptyMessage }}</p>
@else
    <table class="w-full border-collapse text-left text-xs">
        <thead>
            <tr class="avoid-break bg-slate-900 text-white">
                <th class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider">Category</th>
                <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">M. Proj.</th>
                <th class="w-24 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">M. Amount</th>
                <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">F. Proj.</th>
                <th class="w-24 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">F. Amount</th>
                <th class="w-16 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Total Proj.</th>
                <th class="w-28 px-2 py-1.5 text-right text-[11px] font-semibold uppercase tracking-wider">Total Funding</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
            @foreach($rows as $row)
                <tr class="avoid-break">
                    <td class="px-2 py-1.5 font-medium text-slate-800">{{ $row['label'] }}</td>
                    <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($row['maleProjects']) }}</td>
                    <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">PHP {{ number_format($row['maleAmount'], 2) }}</td>
                    <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">{{ number_format($row['femaleProjects']) }}</td>
                    <td class="px-2 py-1.5 text-right tabular-nums text-slate-500">PHP {{ number_format($row['femaleAmount'], 2) }}</td>
                    <td class="px-2 py-1.5 text-right font-medium tabular-nums text-slate-800">{{ number_format($row['maleProjects'] + $row['femaleProjects']) }}</td>
                    <td class="px-2 py-1.5 text-right font-medium tabular-nums text-slate-800">PHP {{ number_format($row['maleAmount'] + $row['femaleAmount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
