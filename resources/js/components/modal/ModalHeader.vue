<script setup lang="ts">
interface Props {
    title: string;
}

interface Emits {
    (e: 'close'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const closeModal = () => {
    emit('close');
};
</script>

<template>
    <!-- Header -->
    <div class="modal-header-mobile sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <div class="flex items-center justify-between gap-3">
            <div class="flex-1 overflow-hidden">
                <h2 class="truncate text-lg font-semibold text-gray-900 select-text sm:text-xl md:text-2xl">{{ title }}</h2>
            </div>
            <button
                type="button"
                @click="closeModal"
                class="modal-close-btn touch-target tap-highlight-none shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                aria-label="Close modal"
            >
                <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>
