<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/composables/useInitials';
import type { User } from '@/types';
import { computed } from 'vue';

interface Props {
    user: User;
    /** Text only (no avatar) */
    hideAvatar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    hideAvatar: false,
});


const showAvatar = computed(() => props.user.avatar && props.user.avatar !== '');

const displayHandle = computed(() => props.user.username?.trim() || '—');
</script>

<template>
    <Avatar v-if="!hideAvatar" class="h-8 w-8 overflow-hidden rounded-lg">
        <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="displayHandle" />
        <AvatarFallback class="rounded-lg bg-black/20 text-slate-900">
            {{ getInitials(displayHandle) }}
        </AvatarFallback>
    </Avatar>

    <div class="grid min-w-0 flex-1 text-left leading-tight">
        <span class="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Username</span>
        <span class="mt-0.5 truncate font-sans text-sm font-semibold tracking-tight text-slate-900 tabular-nums">{{ displayHandle }}</span>
    </div>
</template>
