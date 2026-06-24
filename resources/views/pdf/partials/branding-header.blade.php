@php
    // dompdf renders alpha PNGs via an in-memory per-pixel soft mask, which
    // exhausts memory on large source logos. App\Support\PdfImage downscales and
    // flattens each logo onto white, emits a (cached) alpha-free JPEG data URI,
    // and returns the print display size. Render at 2x for crisp output, show at 1x.
    $logoHeight = 34; // px (display)
    $brandLogos = [];

    foreach (['dostlogo.png', 'gadlogo.png'] as $logoFile) {
        $logo = \App\Support\PdfImage::dataUri($logoFile, $logoHeight * 2);

        if ($logo === null) {
            continue;
        }

        $brandLogos[] = [
            'src' => $logo['src'],
            'width' => (int) round($logo['width'] / 2),
            'height' => (int) round($logo['height'] / 2),
        ];
    }
@endphp

<table class="brand">
    <tr>
        <td>
            @foreach($brandLogos as $logo)
                <img
                    class="brand-logo"
                    src="{{ $logo['src'] }}"
                    width="{{ $logo['width'] }}"
                    height="{{ $logo['height'] }}"
                    alt=""
                />
            @endforeach
        </td>
        <td class="brand-org">
            <div class="org-1">DOST Region IX</div>
            <div class="org-2">Gender and Development Corner</div>
        </td>
    </tr>
</table>
