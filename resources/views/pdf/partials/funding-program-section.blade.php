{{--
    One funding program family's section: headline facts, then the detail and
    metrics tables. SETUP, CEST and GIA differ only in their label and rows, so
    they share this rather than three copies that can drift apart.

    @param int    $number   Section number shown before the title.
    @param string $label    Short name, e.g. SETUP.
    @param string $fullName Spelled-out program name for the note line.
    @param string $year     Report year.
    @param array  $rows     Category rows for this family.
    @param array  $totals   Output of $sumFundingRows for these rows.
--}}
@php
    $projects = $totals['maleProjects'] + $totals['femaleProjects'];
    $amount = $totals['maleAmount'] + $totals['femaleAmount'];
@endphp

<div class="section">
    <p class="section-title"><span class="section-num">{{ $number }}.</span> {{ $label }}</p>
    <p class="note">{{ $fullName }} &middot; {{ $year }}</p>
    <div class="facts avoid-break">
        <span class="k">Categories</span> <span class="v">{{ count($rows) }}</span>
        <span class="sep">&nbsp;&middot;&nbsp;</span>
        <span class="k">Total projects</span> <span class="v">{{ number_format($projects) }}</span>
        <span class="sep">&nbsp;&middot;&nbsp;</span>
        <span class="k">Total funding</span> <span class="v">{{ $formatCurrency($amount) }}</span>
        <span class="sep">&nbsp;&middot;&nbsp;</span>
        <span class="k">Male-led</span> <span class="v">{{ number_format($totals['maleProjects']) }}</span>
        <span class="sep">&nbsp;&middot;&nbsp;</span>
        <span class="k">Female-led</span> <span class="v">{{ number_format($totals['femaleProjects']) }}</span>
    </div>
    @include('pdf.partials.funding-detail-table', [
        'rows' => $rows,
        'emptyMessage' => 'No ' . $label . ' category data yet for this year.',
    ])
    @include('pdf.partials.funding-metrics-table', [
        'rows' => $rows,
        'emptyMessage' => 'No ' . $label . ' program metrics recorded for this year.',
    ])
</div>
