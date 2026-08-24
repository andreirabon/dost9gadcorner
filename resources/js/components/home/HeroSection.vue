<script setup lang="ts">
import { ArrowDown } from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineOptions({
    name: 'HeroSection',
});

const heroVideoSources = ['/video/video1.mp4', '/video/video2.mp4'] as const;

const heroVideoOneRef = ref<HTMLVideoElement | null>(null);
const heroVideoTwoRef = ref<HTMLVideoElement | null>(null);

const activeVideoIndex = ref(0);
const isPageVisible = ref(true);
const isHeroInView = ref(true);

let reducedMotionQuery: MediaQueryList | null = null;
let heroVisibilityObserver: IntersectionObserver | null = null;
let hasPrimedSecondVideo = false;

/**
 * The video is a texture behind the headline, not the subject. At 50% a face
 * filling the frame read as the content and the h1 sat across the bridge of a
 * nose; 25% and desaturated under the scrim below keeps it as movement in
 * the background, and stops the footage's own colours from competing with the
 * one accent the rest of the page uses.
 */
const heroVideoActiveOpacityClass = 'opacity-25';

const heroVideoClass =
    'pointer-events-none absolute inset-0 h-full w-full object-cover saturate-50 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:opacity-0! motion-reduce:transition-none';

const prefersReducedMotion = (): boolean => reducedMotionQuery?.matches ?? false;

const shouldPlayHeroVideos = (): boolean => {
    return !prefersReducedMotion() && isPageVisible.value && isHeroInView.value;
};

const getHeroVideos = (): HTMLVideoElement[] => {
    return [heroVideoOneRef.value, heroVideoTwoRef.value].filter((video): video is HTMLVideoElement => video !== null);
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

    const heroSection = heroVideoOneRef.value?.closest('section');
    if (heroSection) {
        heroVisibilityObserver = new IntersectionObserver(
            (entries) => {
                isHeroInView.value = entries[0]?.isIntersecting ?? false;
                syncHeroVideoPlayback();
            },
            { threshold: 0.12 },
        );
        heroVisibilityObserver.observe(heroSection);
    }

    syncHeroVideoPlayback();
});

onBeforeUnmount(() => {
    reducedMotionQuery?.removeEventListener('change', onReducedMotionChange);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    heroVisibilityObserver?.disconnect();
    heroVisibilityObserver = null;

    getHeroVideos().forEach(pauseAndResetVideo);
});

defineEmits<{
    scrollToYears: [];
}>();
</script>

<template>
    <section aria-labelledby="hero-heading" class="home-index-section--hero relative isolate bg-brand-950">
        <div class="absolute inset-0 -z-10 overflow-hidden contain-[paint]" aria-hidden="true">
            <div class="absolute inset-0">
                <video
                    ref="heroVideoOneRef"
                    :src="heroVideoSources[0]"
                    :class="[heroVideoClass, activeVideoIndex === 0 ? ['z-1', heroVideoActiveOpacityClass] : 'z-0 opacity-0']"
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
                    :class="[heroVideoClass, activeVideoIndex === 1 ? ['z-1', heroVideoActiveOpacityClass] : 'z-0 opacity-0']"
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
            <!--
                One scrim, doing two jobs: it holds text contrast over whichever
                video frame is playing, and it lands on the page ground at the
                bottom so the hero does not end in a visible seam. It replaced
                three stacked layers (a purple-to-fuchsia fade, a magenta radial
                glow, and a grid overlay) that fought each other for the same
                surface.
            -->
            <div class="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(21,14,34,0.82)_0%,rgba(21,14,34,0.88)_60%,#150e22_100%)]" />
        </div>

        <div class="px-page-gutter relative z-10 w-full">
            <div class="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 py-8">
                <p class="text-xs font-semibold tracking-[0.14em] text-brand-300 uppercase sm:text-sm">
                    Department of Science and Technology &middot; Region IX
                </p>

                <h1
                    id="hero-heading"
                    class="m-0 max-w-[16ch] text-[clamp(2.25rem,5vw+0.5rem,4.5rem)] leading-[1.05] font-semibold tracking-tight text-balance text-brand-50"
                >
                    Gender and Development Corner
                </h1>

                <p class="max-w-[58ch] text-lg leading-relaxed text-pretty text-brand-200 sm:text-xl">
                    The strategic framework, focal point structure, and yearly sex-disaggregated data behind gender mainstreaming at DOST Region IX.
                </p>

                <button type="button" class="home-cta" @click="$emit('scrollToYears')">
                    Browse the yearly reports
                    <ArrowDown class="home-cta-icon size-4 shrink-0" aria-hidden="true" :stroke-width="2.25" />
                </button>
            </div>
        </div>
    </section>
</template>
