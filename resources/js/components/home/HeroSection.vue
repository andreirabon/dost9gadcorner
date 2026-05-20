<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineOptions({
    name: 'HeroSection',
});

const heroVideoSources = ['/video/video1.mp4', '/video/video2.mp4'] as const;

const heroVideoOneRef = ref<HTMLVideoElement | null>(null);
const heroVideoTwoRef = ref<HTMLVideoElement | null>(null);

const activeVideoIndex = ref(0);
const isPageVisible = ref(true);

const heroNoiseDataUrl =
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'128\' height=\'128\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'128\' height=\'128\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")';

let reducedMotionQuery: MediaQueryList | null = null;
let hasPrimedSecondVideo = false;

/** Lower = more faded video (e.g. opacity-10, opacity-15, opacity-20). */
const heroVideoActiveOpacityClass = 'opacity-10';

const heroVideoClass =
    'pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out motion-reduce:opacity-0! motion-reduce:transition-none';

const prefersReducedMotion = (): boolean => reducedMotionQuery?.matches ?? false;

const shouldPlayHeroVideos = (): boolean => {
    return !prefersReducedMotion() && isPageVisible.value;
};

const getHeroVideos = (): HTMLVideoElement[] => {
    return [heroVideoOneRef.value, heroVideoTwoRef.value].filter(
        (video): video is HTMLVideoElement => video !== null,
    );
};

const pauseAndResetVideo = (video: HTMLVideoElement): void => {
    video.pause();
    video.currentTime = 0;
};

const playVideo = (video: HTMLVideoElement): void => {
    void video.play().catch(() => {});
};

const syncHeroVideoPlayback = (): void => {
    const videos = getHeroVideos();

    if (!shouldPlayHeroVideos()) {
        videos.forEach(pauseAndResetVideo);
        return;
    }

    videos.forEach((video, index) => {
        if (index === activeVideoIndex.value) {
            playVideo(video);
            return;
        }

        pauseAndResetVideo(video);
    });
};

const primeSecondHeroVideo = (): void => {
    if (hasPrimedSecondVideo) {
        return;
    }

    const secondVideo = heroVideoTwoRef.value;
    if (!secondVideo) {
        return;
    }

    hasPrimedSecondVideo = true;
    secondVideo.preload = 'auto';
    secondVideo.load();
};

const onHeroVideoEnded = (endedIndex: number): void => {
    if (!shouldPlayHeroVideos() || endedIndex !== activeVideoIndex.value) {
        return;
    }

    activeVideoIndex.value = (endedIndex + 1) % heroVideoSources.length;
    syncHeroVideoPlayback();
};

const onHeroVideoCanPlay = (index: number): void => {
    if (index === 0) {
        primeSecondHeroVideo();
    }

    if (index === activeVideoIndex.value && shouldPlayHeroVideos()) {
        const video = index === 0 ? heroVideoOneRef.value : heroVideoTwoRef.value;
        if (video) {
            playVideo(video);
        }
    }
};

const onVisibilityChange = (): void => {
    isPageVisible.value = document.visibilityState === 'visible';
    syncHeroVideoPlayback();
};

const onReducedMotionChange = (): void => {
    if (prefersReducedMotion()) {
        activeVideoIndex.value = 0;
    }

    syncHeroVideoPlayback();
};

onMounted(() => {
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', onReducedMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);

    syncHeroVideoPlayback();
});

onBeforeUnmount(() => {
    reducedMotionQuery?.removeEventListener('change', onReducedMotionChange);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    getHeroVideos().forEach(pauseAndResetVideo);
});

defineEmits<{
    scrollToYears: [];
    scrollToOrgChart: [];
}>();
</script>

<template>
    <section
        aria-labelledby="hero-heading"
        class="relative isolate flex min-h-dvh min-h-screen-safe flex-col justify-center overflow-hidden bg-linear-to-b from-purple-950 via-purple-950/98 to-fuchsia-950/35 px-0 md:pt-10"
    >
        <div class="absolute inset-0 -z-10 overflow-hidden contain-[paint]" aria-hidden="true">
            <div class="absolute inset-0">
                <video
                    ref="heroVideoOneRef"
                    :src="heroVideoSources[0]"
                    :class="[
                        heroVideoClass,
                        activeVideoIndex === 0 ? ['z-1', heroVideoActiveOpacityClass] : 'z-0 opacity-0',
                    ]"
                    muted
                    playsinline
                    autoplay
                    preload="metadata"
                    disablepictureinpicture
                    disableremoteplayback
                    tabindex="-1"
                    @canplay="onHeroVideoCanPlay(0)"
                    @ended="onHeroVideoEnded(0)"
                />
                <video
                    ref="heroVideoTwoRef"
                    :src="heroVideoSources[1]"
                    :class="[
                        heroVideoClass,
                        activeVideoIndex === 1 ? ['z-1', heroVideoActiveOpacityClass] : 'z-0 opacity-0',
                    ]"
                    muted
                    playsinline
                    preload="none"
                    disablepictureinpicture
                    disableremoteplayback
                    tabindex="-1"
                    @canplay="onHeroVideoCanPlay(1)"
                    @ended="onHeroVideoEnded(1)"
                />
            </div>
            <div class="absolute inset-0 bg-linear-to-b from-purple-950/88 via-purple-950/72 to-fuchsia-950/55" />
            <div
                class="absolute inset-0 mix-blend-soft-light opacity-10"
                :style="{ backgroundImage: heroNoiseDataUrl }"
            />
            <div
                aria-hidden="true"
                class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,38,211,0.18),transparent_70%)]"
            />
            <div
                aria-hidden="true"
                class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] opacity-60"
            />
        </div>

        <div class="px-page-gutter relative z-10 mx-auto w-full max-w-5xl text-center">
            <div class="flex flex-col items-center gap-8 py-12 md:gap-10 md:py-16">
                <div
                    class="flex flex-row flex-nowrap items-center justify-center gap-6 sm:gap-8 md:gap-10"
                    aria-label="DOST and GAD logos"
                >
                    <img
                        src="/dostlogo.png"
                        alt="Department of Science and Technology"
                        class="h-16 w-auto opacity-95 drop-shadow-2xl sm:h-20 md:h-24"
                        loading="eager"
                        decoding="async"
                        fetchpriority="high"
                    />
                    <img
                        src="/gadlogo.png"
                        alt="Gender and Development"
                        class="h-16 w-auto opacity-95 drop-shadow-2xl sm:h-20 md:h-24"
                        loading="eager"
                        decoding="async"
                    />
                </div>

                <div class="flex flex-col items-center">
                    <p class="mb-1.5 text-sm font-semibold tracking-widest text-fuchsia-300/90 uppercase md:mb-2">
                        Department of Science and Technology Region IX
                    </p>
                    <h1
                        id="hero-heading"
                        class="m-0 text-2xl font-semibold leading-tight tracking-tighter whitespace-nowrap text-purple-100 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    >
                        Gender and Development Corner
                    </h1>
                    <p class="mt-3 max-w-[55ch] text-lg leading-relaxed text-purple-200/80 sm:mt-4 sm:text-xl md:mt-5">
                        Discover how our projects drive gender equality, women's empowerment, and inclusive development through science and technology.
                    </p>
                </div>

                <div class="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                        type="button"
                        @click="$emit('scrollToYears')"
                        class="group touch-target inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-purple-400/50 bg-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 transition-[transform,background-color,box-shadow,border-color] duration-200 ease-out hover:border-purple-300/55 hover:bg-purple-500 hover:shadow-purple-950/55 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none"
                    >
                        Sex Disaggregated Data Reports
                        <ArrowRight class="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" :stroke-width="2.5" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
