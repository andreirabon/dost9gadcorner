import { ref } from 'vue';
import type { VNode } from 'vue';

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000000; // Let Radix UI handle the removal visually, or we sweep it up

export type ToastType = 'default' | 'success' | 'error' | 'warning';

export interface ToastProps {
    id: string;
    title?: string;
    description?: string | VNode;
    type?: ToastType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    open: boolean;
}

const toasts = ref<ToastProps[]>([]);

export function useToast() {
    return {
        toasts,
        toast: (props: Omit<ToastProps, 'id' | 'open'>) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: ToastProps = {
                ...props,
                id,
                open: true,
                type: props.type ?? 'default',
            };

            toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT);
            return id;
        },
        dismiss: (toastId?: string) => {
            if (toastId) {
                const index = toasts.value.findIndex((t) => t.id === toastId);
                if (index !== -1) {
                    toasts.value[index].open = false;
                }
            } else {
                toasts.value.forEach((t) => (t.open = false));
            }
            
            setTimeout(() => {
                if (toastId) {
                    toasts.value = toasts.value.filter((t) => t.id !== toastId);
                } else {
                    toasts.value = [];
                }
            }, 300); // Wait for exit animation
        },
    };
}
