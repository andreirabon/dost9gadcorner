<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roleBadge } from '@/helpers/roleBadge';
import type { UserRoleSlug } from '@/types';
import { useForm } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

interface Props {
    id: number;
    username: string;
    role: UserRoleSlug | null;
}

const props = defineProps<Props>();

const isEditing = ref(false);
const passwordInput = ref<HTMLInputElement | null>(null);

const badge = computed(() => roleBadge(props.role));
const initial = computed(() => (props.username?.trim()?.[0] ?? '?').toUpperCase());

const form = useForm({
    password: '',
    password_confirmation: '',
});

function startEditing(): void {
    isEditing.value = true;
    requestAnimationFrame(() => passwordInput.value?.focus());
}

function cancelEditing(): void {
    isEditing.value = false;
    form.reset();
    form.clearErrors();
}

function submit(): void {
    form.patch(route('admin.users.password.update', props.id), {
        preserveScroll: true,
        onSuccess: () => {
            isEditing.value = false;
            form.reset();
        },
    });
}
</script>

<template>
    <div class="app-surface-card rounded-2xl p-4 sm:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
                <span
                    class="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    :class="badge.avatarClass"
                    aria-hidden="true"
                >
                    {{ initial }}
                </span>
                <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-900">{{ username }}</p>
                    <span class="mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="badge.chipClass">
                        {{ badge.label }}
                    </span>
                </div>
            </div>

            <Button
                v-if="!isEditing"
                type="button"
                variant="outline"
                class="h-9 cursor-pointer rounded-lg px-4 text-sm font-medium active:scale-[0.97]"
                @click="startEditing"
            >
                Change password
            </Button>
        </div>

        <form v-if="isEditing" class="mt-4 space-y-3 border-t border-slate-200 pt-4" @submit.prevent="submit">
            <div class="grid gap-3 sm:grid-cols-2">
                <div class="grid gap-1.5">
                    <Input
                        ref="passwordInput"
                        v-model="form.password"
                        type="password"
                        autocomplete="new-password"
                        placeholder="New password"
                        class="h-10"
                    />
                    <InputError :message="form.errors.password" />
                </div>
                <div class="grid gap-1.5">
                    <Input
                        v-model="form.password_confirmation"
                        type="password"
                        autocomplete="new-password"
                        placeholder="Confirm password"
                        class="h-10"
                    />
                    <InputError :message="form.errors.password_confirmation" />
                </div>
            </div>

            <div class="flex items-center gap-3">
                <Button
                    :disabled="form.processing"
                    class="h-9 cursor-pointer rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-600 active:scale-[0.97]"
                >
                    Save password
                </Button>
                <Button type="button" variant="ghost" class="h-9 cursor-pointer rounded-lg px-3 text-sm" @click="cancelEditing">
                    Cancel
                </Button>
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0"
                    leave-active-class="transition duration-150 ease-out"
                    leave-to-class="opacity-0"
                >
                    <p v-show="form.recentlySuccessful" class="text-sm font-medium text-emerald-700">Saved.</p>
                </Transition>
            </div>
        </form>
    </div>
</template>
