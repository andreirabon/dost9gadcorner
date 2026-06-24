<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Produces dompdf-safe image data URIs.
 *
 * dompdf renders alpha PNGs by building a per-pixel soft mask in pure PHP,
 * which exhausts memory on large logos (a 2460x2460 PNG is ~6M pixels and
 * blows past a 128MB limit). We sidestep that path entirely by downscaling
 * and flattening the source onto a white background, then emitting a JPEG
 * (no alpha channel, so no soft mask). The result is cached to disk keyed by
 * source mtime so the GD work happens once per asset, not once per render.
 */
class PdfImage
{
    /**
     * Return a base64 JPEG data URI for a public image, sized for print.
     *
     * @return array{src: string, width: int, height: int}|null
     */
    public static function dataUri(string $publicRelativePath, int $boxHeight = 80): ?array
    {
        $publicRelativePath = str_replace('\\', '/', $publicRelativePath);

        if (
            $publicRelativePath === ''
            || str_contains($publicRelativePath, '..')
            || str_starts_with($publicRelativePath, '/')
        ) {
            return null;
        }

        $source = public_path($publicRelativePath);
        $resolvedSource = realpath($source);
        $resolvedPublicRoot = realpath(public_path());

        if (
            $resolvedSource === false
            || $resolvedPublicRoot === false
            || ! is_file($resolvedSource)
            || ! str_starts_with($resolvedSource, $resolvedPublicRoot.DIRECTORY_SEPARATOR)
        ) {
            return null;
        }

        $source = $resolvedSource;

        $dimensions = @getimagesize($source);

        if ($dimensions === false || ($dimensions[0] ?? 0) <= 0 || ($dimensions[1] ?? 0) <= 0) {
            return null;
        }

        [$srcWidth, $srcHeight] = $dimensions;

        $targetHeight = min($boxHeight, $srcHeight);
        $targetWidth = (int) max(1, round($targetHeight * ($srcWidth / $srcHeight)));

        $cacheDir = storage_path('app/pdf-cache');
        $cacheKey = md5($source.'|'.filemtime($source).'|'.$targetWidth.'x'.$targetHeight);
        $cacheFile = $cacheDir.DIRECTORY_SEPARATOR.$cacheKey.'.jpg';

        if (! is_file($cacheFile)) {
            if (! extension_loaded('gd')) {
                return null;
            }

            $jpeg = self::renderFlattenedJpeg($source, $dimensions['mime'] ?? '', $srcWidth, $srcHeight, $targetWidth, $targetHeight);

            if ($jpeg === null) {
                return null;
            }

            if (! is_dir($cacheDir) && ! mkdir($cacheDir, 0755, true) && ! is_dir($cacheDir)) {
                return null;
            }

            file_put_contents($cacheFile, $jpeg, LOCK_EX);
        } else {
            $jpeg = (string) file_get_contents($cacheFile);
        }

        return [
            'src' => 'data:image/jpeg;base64,'.base64_encode($jpeg),
            'width' => $targetWidth,
            'height' => $targetHeight,
        ];
    }

    private static function renderFlattenedJpeg(
        string $source,
        string $mime,
        int $srcWidth,
        int $srcHeight,
        int $targetWidth,
        int $targetHeight
    ): ?string {
        $image = match ($mime) {
            'image/png' => @imagecreatefrompng($source),
            'image/jpeg' => @imagecreatefromjpeg($source),
            'image/gif' => @imagecreatefromgif($source),
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($source) : false,
            default => false,
        };

        if ($image === false) {
            return null;
        }

        $canvas = imagecreatetruecolor($targetWidth, $targetHeight);
        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagefilledrectangle($canvas, 0, 0, $targetWidth, $targetHeight, $white);

        imagecopyresampled($canvas, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $srcWidth, $srcHeight);

        ob_start();
        imagejpeg($canvas, null, 92);
        $jpeg = (string) ob_get_clean();

        imagedestroy($image);
        imagedestroy($canvas);

        return $jpeg === '' ? null : $jpeg;
    }
}
