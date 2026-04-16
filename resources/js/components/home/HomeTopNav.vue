<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserMenuContent from '@/components/user/UserMenuContent.vue';
import { getInitials } from '@/composables/useInitials';
import type { User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';
import { ChevronDown, FileChartColumnIncreasing, PlusCircle } from 'lucide-vue-next';
import { computed } from 'vue';

defineOptions({
    name: 'HomeTopNav',
});

const page = usePage();

const user = computed(() => page.props.auth?.user as User | null);

const reportYearsIndexUrl = computed(() => route('report-years.index'));

const createReportYearUrl = computed(() => route('report-years.create'));

const flushLogout = (): void => {
    router.flushAll();
};
</script>

<template>
    <header
        class="pt-safe sticky top-0 z-40 border-b border-white/10 bg-purple-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-purple-950/65"
        role="banner"
    >
        <div class="px-safe mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 sm:min-h-16 sm:gap-4">
            <Link
                :href="route('index')"
                class="cursor-pointer font-semibold tracking-tight text-white transition-colors duration-200 hover:text-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950"
            >
                GAD Corner
            </Link>

            <nav class="flex items-center gap-2 sm:gap-3" aria-label="Site">
                <Link
                    v-if="!user"
                    :href="route('login')"
                    class="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition-colors duration-200 hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950"
                >
                    Log in
                </Link>

                <template v-else>
                    <DropdownMenu v-if="user.is_admin">
                        <DropdownMenuTrigger :as-child="true">
                            <Button
                                type="button"
                                variant="outline"
                                class="cursor-pointer border-purple-400/45 bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 sm:px-4"
                            >
                                Reports
                                <ChevronDown class="size-4 opacity-90" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56" :side-offset="8">
                            <DropdownMenuLabel class="text-xs font-normal text-muted-foreground">Manage content</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem :as-child="true">
                                    <Link
                                        class="flex w-full cursor-pointer items-center gap-2"
                                        :href="reportYearsIndexUrl"
                                        prefetch
                                    >
                                        <FileChartColumnIncreasing class="size-4 shrink-0" />
                                        All report years
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem :as-child="true">
                                    <Link
                                        class="flex w-full cursor-pointer items-center gap-2"
                                        :href="createReportYearUrl"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <PlusCircle class="size-4 shrink-0" />
                                        New report year
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        :href="route('logout')"
                        method="post"
                        as="button"
                        class="cursor-pointer rounded-full border border-white/10 bg-transparent px-3 py-2 text-sm font-medium text-purple-100 transition-colors duration-200 hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 sm:px-4"
                        @click="flushLogout"
                    >
                        Log out
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger :as-child="true">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="touch-target relative h-10 w-10 cursor-pointer rounded-full p-1 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 sm:h-9 sm:w-9"
                            >
                                <Avatar class="size-8 overflow-hidden rounded-full border border-white/15">
                                    <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                                    <AvatarFallback class="rounded-full bg-purple-800/90 font-semibold text-white">
                                        {{ getInitials(user.name) }}
                                    </AvatarFallback>
                                </Avatar>
                                <span class="sr-only">Open account menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56" :side-offset="8">
                            <UserMenuContent :user="user" hide-logout />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </template>
            </nav>
        </div>
    </header>
</template>
