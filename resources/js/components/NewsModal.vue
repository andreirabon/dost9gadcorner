<script setup lang="ts">
import type { NewsItem } from '@/data/news';
import { watch } from 'vue';
import ModalHeader from './modal/ModalHeader.vue';

interface Props {
    news: NewsItem | null;
    isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
}>();

const closeModal = () => emit('close');

const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeModal();
};

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeModal();
};

// Event listeners management
watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        }
    },
);
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen && news"
                class="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-4"
                @click="handleOverlayClick"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="`modal-title-${news.id}`"
            >
                <div
                    class="modal-content relative h-full max-h-full w-full overflow-hidden rounded-none bg-white shadow-2xl ring-1 ring-black/5 transition-all sm:max-h-[95vh] sm:max-w-5xl sm:rounded-2xl"
                    @click.stop
                >
                    <!-- Decorative Top Bar -->
                    <div class="h-1.5 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600"></div>

                    <!-- Header Component -->
                    <ModalHeader :id="`modal-title-${news.id}`" :title="news.title" @close="closeModal" />

                    <!-- Scrollable Content -->
                    <div class="modal-content-mobile h-[calc(100%-90px)] overflow-y-auto overscroll-contain bg-gray-50/30 sm:max-h-[calc(95vh-90px)]">
                        <div class="p-4 sm:p-6 md:p-10">
                            <!-- Image (if available) -->
                            <div v-if="news.image" class="group relative mb-8 overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                ></div>
                                <img
                                    :src="news.image"
                                    :alt="news.title"
                                    class="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <!-- Date Badge -->
                            <div class="mb-8 flex items-center">
                                <div
                                    class="inline-flex items-center rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 ring-1 ring-purple-700/10"
                                >
                                    <svg class="mr-2 h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {{ news.date }}
                                </div>
                            </div>

                            <!-- Content -->
                            <div
                                class="prose prose-sm prose-purple prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-purple-600 prose-a:no-underline hover:prose-a:text-purple-500 prose-img:rounded-lg sm:prose-base sm:prose-img:rounded-xl md:prose-lg max-w-none text-gray-600"
                                v-html="news.content"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
