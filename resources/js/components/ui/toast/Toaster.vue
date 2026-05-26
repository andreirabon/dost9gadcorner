<script setup lang="ts">
import { useToast } from './use-toast';
import { ToastProvider, ToastRoot, ToastTitle, ToastDescription, ToastViewport, ToastAction, ToastClose } from 'reka-ui';
import { X } from '@lucide/vue';

const { toasts, dismiss } = useToast();
</script>

<template>
    <ToastProvider>
        <ToastRoot
            v-for="toast in toasts"
            :key="toast.id"
            :open="toast.open"
            @update:open="(val: boolean) => { if (!val) dismiss(toast.id) }"
            class="group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.95] data-[state=open]:zoom-in-[0.95] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]"
            :class="[
                toast.type === 'error' ? 'border-red-200 bg-red-50 text-red-900' :
                toast.type === 'warning' ? 'border-orange-200 bg-orange-50 text-orange-900' : 'border-slate-200 bg-white text-slate-900'
            ]"
            :duration="toast.duration ?? 5000"
        >
            <div class="flex flex-col gap-1.5">
                <ToastTitle v-if="toast.title" class="text-sm font-semibold tracking-tight">
                    {{ toast.title }}
                </ToastTitle>
                <ToastDescription v-if="toast.description" :class="['text-sm', toast.type === 'error' ? 'text-red-800/90' : toast.type === 'warning' ? 'text-orange-800/90' : 'text-slate-500']">
                    <component :is="toast.description" v-if="typeof toast.description === 'object'" />
                    <span v-else>{{ toast.description }}</span>
                </ToastDescription>
            </div>
            
            <ToastAction
                v-if="toast.action"
                class="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]"
                altText="Action"
                @click="toast.action.onClick"
            >
                {{ toast.action.label }}
            </ToastAction>
            
            <ToastClose
                class="absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity hover:text-slate-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 active:scale-[0.97]"
            >
                <X class="size-4" />
            </ToastClose>
        </ToastRoot>
        
        <ToastViewport class="fixed top-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:right-0 sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
</template>

<style scoped>
/* Emil Design Eng rules applied to the toast transition */
[data-reka-toast-root] {
    transform-origin: center bottom;
}

[data-state='open'] {
    animation: toastSlideIn 250ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

[data-state='closed'] {
    animation: toastSlideOut 150ms ease-out forwards;
}

@keyframes toastSlideIn {
    from {
        opacity: 0;
        transform: translateY(100%) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes toastSlideOut {
    from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.95);
    }
}
</style>
