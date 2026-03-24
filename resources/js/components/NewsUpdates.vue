<script setup lang="ts">
import NewsModal from '@/components/NewsModal.vue';
import { newsUpdates, type NewsItem } from '@/data/news';
import Carousel from 'primevue/carousel';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';

defineOptions({
    name: 'NewsUpdates',
});

const selectedNews = shallowRef<NewsItem | null>(null);
const isModalOpen = ref(false);

const openNewsModal = (news: NewsItem): void => {
    selectedNews.value = news;
    isModalOpen.value = true;
};

const closeNewsModal = (): void => {
    isModalOpen.value = false;
    // Delay clearing data to allow modal exit animation
    setTimeout(() => {
        selectedNews.value = null;
    }, 300);
};

const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isModalOpen.value) {
        closeNewsModal();
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
});

const responsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 4,
        numScroll: 1,
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
    },
];
</script>

<template>
    <section
        id="news-updates"
        class="relative border-t border-purple-700/60 bg-purple-900/40 py-12 sm:py-16 md:py-20 lg:py-24"
        aria-labelledby="news-heading"
    >
        <div class="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
            <div class="mb-8 flex flex-col items-center text-center sm:mb-10 md:mb-12">
                <h2
                    id="news-heading"
                    class="bg-gradient-to-r from-purple-200 via-fuchsia-300 to-pink-200 bg-clip-text px-4 text-2xl font-semibold tracking-tight text-transparent sm:text-3xl md:text-4xl"
                >
                    News
                </h2>
                <p class="mt-3 max-w-2xl px-4 text-base text-purple-100 sm:mt-4 sm:text-lg">
                    Stay informed with the latest developments, workshops, and stories from our Gender and Development initiatives.
                </p>
            </div>

            <Carousel :value="newsUpdates" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplayInterval="5000">
                <template #item="slotProps">
                    <div class="h-full p-2 sm:p-3">
                        <article
                            class="group relative flex h-full flex-col items-start overflow-hidden rounded-xl border border-purple-500/30 bg-purple-800/40 p-4 text-left shadow-lg duration-300 [transition:transform_0.3s_ease,border-color_0.3s_ease,background-color_0.3s_ease,box-shadow_0.3s_ease] hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-800/60 hover:shadow-xl sm:rounded-2xl sm:p-5 md:p-6"
                        >
                            <h3 class="mb-1.5 text-base leading-snug font-semibold text-white group-hover:text-purple-200 sm:mb-2 sm:text-lg">
                                {{ slotProps.data.title }}
                            </h3>

                            <div class="mb-2 flex sm:mb-3">
                                <time :datetime="slotProps.data.date" class="text-xs text-purple-300">{{ slotProps.data.date }}</time>
                            </div>

                            <p class="mb-3 flex-grow text-xs leading-relaxed text-purple-100/80 sm:mb-4 sm:text-sm">
                                {{ slotProps.data.summary }}
                            </p>

                            <div class="mt-auto pt-3 sm:pt-4">
                                <button
                                    type="button"
                                    @click="openNewsModal(slotProps.data)"
                                    class="touch-target inline-flex items-center text-xs font-medium text-fuchsia-300 transition-colors hover:text-fuchsia-200 focus:outline-none sm:text-sm"
                                    :aria-label="`Read more about ${slotProps.data.title}`"
                                >
                                    Read more
                                    <svg
                                        class="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </article>
                    </div>
                </template>
            </Carousel>
        </div>
    </section>

    <NewsModal :news="selectedNews" :is-open="isModalOpen" @close="closeNewsModal" />
</template>

<style>
/* Custom styles for PrimeVue Carousel indicators to match theme */
.p-carousel-indicators {
    padding-top: 1.5rem;
    gap: 0.5rem;
}

.p-carousel-indicator-button {
    width: 0.75rem !important;
    height: 0.75rem !important;
    border-radius: 9999px !important;
    background-color: rgba(216, 180, 254, 0.3) !important;
    transition:
        background-color 0.3s ease,
        width 0.3s ease !important;
}

.p-carousel-indicator.p-carousel-indicator-active .p-carousel-indicator-button {
    background-color: rgb(232, 121, 249) !important; /* fuchsia-400 */
    width: 1.5rem !important;
}

.p-carousel-prev-button,
.p-carousel-next-button {
    color: rgb(233, 213, 255) !important;
    background-color: rgba(88, 28, 135, 0.5) !important;
    border-radius: 9999px !important;
    width: 2rem !important;
    height: 2rem !important;
    margin: 0 0.25rem !important;
    transition:
        background-color 0.2s ease,
        color 0.2s ease !important;
}

@media (min-width: 640px) {
    .p-carousel-prev-button,
    .p-carousel-next-button {
        width: 2.5rem !important;
        height: 2.5rem !important;
        margin: 0 0.5rem !important;
    }
}

.p-carousel-prev-button:hover,
.p-carousel-next-button:hover {
    background-color: rgba(107, 33, 168, 0.8) !important; /* purple-800 with opacity */
    color: white !important;
}

/* Touch-friendly carousel buttons on mobile */
@media (hover: none) and (pointer: coarse) {
    .p-carousel-prev-button,
    .p-carousel-next-button {
        width: 2.75rem !important;
        height: 2.75rem !important;
    }
}
</style>
