<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Items Sales Combined</title>
    @vite(['resources/css/app.css'])
    <style>
        @media print {
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
            font-family: 'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    </style>
</head>
<body class="bg-white text-slate-800">
    <div class="w-full">
        @include('pdf.partials.branding-header')

        <!-- Report Title -->
        <div class="mb-6 avoid-break">
            <h3 class="text-xl font-black text-slate-900 tracking-tight">Items Sales Combined</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-2xl">Aggregated summary of total item sales volume and revenue combining all regions.</p>
        </div>

        @php
            $grandTotalQuantity = collect($items)->sum('quantity');
            $grandTotalRevenue = collect($items)->sum('revenue');
        @endphp

        <!-- Data Architecture -->
        <div class="mb-6 avoid-break">
            <h4 class="text-base font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">All Regions</h4>
            <table class="w-full text-left text-xs border-collapse">
                <thead>
                    <tr class="bg-slate-900 text-white avoid-break">
                        <th class="py-1.5 px-2 font-semibold text-[10px] tracking-wider uppercase">Item Description</th>
                        <th class="py-1.5 px-2 font-semibold text-[10px] tracking-wider uppercase text-right w-24">Unit Price</th>
                        <th class="py-1.5 px-2 font-semibold text-[10px] tracking-wider uppercase text-right w-20">Qty</th>
                        <th class="py-1.5 px-2 font-semibold text-[10px] tracking-wider uppercase text-right w-28">Total Revenue</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($items as $item)
                    <tr class="avoid-break hover:bg-slate-50 transition-colors">
                        <td class="py-1.5 px-2 font-medium text-slate-800">{{ $item['item'] }}</td>
                        <td class="py-1.5 px-2 text-right text-slate-500 tabular-nums">PHP {{ number_format($item['price'], 2) }}</td>
                        <td class="py-1.5 px-2 text-right text-slate-800 font-medium tabular-nums">{{ $item['quantity'] }}</td>
                        <td class="py-1.5 px-2 text-right text-slate-800 font-medium tabular-nums">PHP {{ number_format($item['revenue'], 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Grand Totals -->
        <div class="mt-8 border-t border-slate-300 pt-6 avoid-break flex items-end justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
                <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Report Summary</h4>
                <p class="text-xs text-slate-600">Total metrics across all recorded items.</p>
            </div>
            <div class="flex gap-8 text-right">
                <div>
                    <p class="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Total Volume</p>
                    <p class="text-xl font-black text-slate-900 tracking-tight tabular-nums">{{ number_format($grandTotalQuantity) }} <span class="text-[10px] text-slate-500 font-medium uppercase ml-1">items</span></p>
                </div>
                <div>
                    <p class="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Total Revenue</p>
                    <p class="text-xl font-black text-slate-900 tracking-tight tabular-nums">PHP {{ number_format($grandTotalRevenue, 2) }}</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
