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
    <div class="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 md:px-6">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-heading-responsive font-semibold text-gray-900 select-text">{{ title }}</h2>
            </div>
            <button
                type="button"
                @click="closeModal"
                class="modal-close-btn touch-target tap-highlight-none rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                aria-label="Close modal"
            >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>
