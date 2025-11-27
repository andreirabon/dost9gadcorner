<script setup lang="ts">
import Carousel from 'primevue/carousel';
import { ref } from 'vue';
import { newsUpdates, type NewsItem } from '../data/news';
import NewsModal from './NewsModal.vue';

const formatDate = (dateString: string) => {
    return dateString; // Already formatted in data, but could use date-fns or Intl.DateTimeFormat
};

const selectedNews = ref<NewsItem | null>(null);
const isModalOpen = ref(false);

const openNewsModal = (news: NewsItem) => {
    selectedNews.value = news;
    isModalOpen.value = true;
};

const closeNewsModal = () => {
    isModalOpen.value = false;
    selectedNews.value = null;
};

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
    <section id="news-updates" class="relative border-t border-purple-700/60 bg-purple-900/40 py-16 md:py-24" aria-labelledby="news-heading">
        <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-10 flex flex-col items-center text-center md:mb-12">
                <h2
                    id="news-heading"
                    class="bg-gradient-to-r from-purple-200 via-fuchsia-300 to-pink-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl"
                >
                    News
                </h2>
                <p class="mt-4 max-w-2xl text-lg text-purple-100">
                    Stay informed with the latest developments, workshops, and stories from our Gender and Development initiatives.
                </p>
            </div>

            <Carousel :value="newsUpdates" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplayInterval="5000">
                <template #item="slotProps">
                    <div class="h-full p-3">
                        <article
                            class="group relative flex h-full flex-col items-start overflow-hidden rounded-2xl border border-purple-500/30 bg-purple-800/40 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-800/60 hover:shadow-xl"
                        >
                            <h3 class="mb-2 text-lg leading-snug font-semibold text-white group-hover:text-purple-200">
                                {{ slotProps.data.title }}
                            </h3>

                            <div class="mb-3 flex">
                                <time :datetime="slotProps.data.date" class="text-xs text-purple-300">{{ formatDate(slotProps.data.date) }}</time>
                            </div>

                            <p class="mb-4 flex-grow text-sm leading-relaxed text-purple-100/80">
                                {{ slotProps.data.summary }}
                            </p>

                            <div class="mt-auto pt-4">
                                <button
                                    type="button"
                                    @click="openNewsModal(slotProps.data)"
                                    class="inline-flex items-center text-sm font-medium text-fuchsia-300 transition-colors hover:text-fuchsia-200 focus:outline-none"
                                >
                                    Read more
                                    <svg
                                        class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
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
    background-color: rgba(216, 180, 254, 0.3) !important; /* purple-300 with opacity */
    transition: all 0.3s ease !important;
}

.p-carousel-indicator.p-carousel-indicator-active .p-carousel-indicator-button {
    background-color: rgb(232, 121, 249) !important; /* fuchsia-400 */
    width: 1.5rem !important;
}

.p-carousel-prev-button,
.p-carousel-next-button {
    color: rgb(233, 213, 255) !important; /* purple-200 */
    background-color: rgba(88, 28, 135, 0.5) !important; /* purple-900 with opacity */
    border-radius: 9999px !important;
    width: 2.5rem !important;
    height: 2.5rem !important;
    margin: 0 0.5rem !important;
    transition: all 0.2s ease !important;
}

.p-carousel-prev-button:hover,
.p-carousel-next-button:hover {
    background-color: rgba(107, 33, 168, 0.8) !important; /* purple-800 with opacity */
    color: white !important;
}
</style>
