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
import { ChevronDown, FileChartColumnIncreasing, PlusCircle } from '@lucide/vue';
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

const userMenuLabel = computed(() => user.value?.username?.trim() || '—');
</script>

<template>
    <header
        class="sticky top-0 z-40 flex h-14 w-full items-center border-b border-white/10 bg-[#0e0716]/60 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] supports-[backdrop-filter]:bg-[#0e0716]/50 transition-[background-color,border-color,backdrop-filter] duration-200 ease-out sm:h-16"
        role="banner"
    >
        <div class="px-safe mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4">
            <!-- Left Column: Logos -->
            <div class="flex items-center justify-start gap-3 sm:gap-4">
                <img src="/dostlogo.png" alt="DOST Logo" class="h-8 w-auto object-contain sm:h-10" />
                <img src="/gadlogo.png" alt="GAD Logo" class="h-8 w-auto object-contain sm:h-10" />
            </div>

            <!-- Middle Column: Shortcut Links -->
            <nav class="hidden lg:flex items-center justify-center">
                <div class="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
                    <a
                        href="/#gad-strategic-framework"
                        class="touch-target inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap text-white/70 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-purple-600 hover:text-white active:scale-[0.97]"
                    >
                        Strategic Framework
                    </a>
                    <a
                        href="/#org-chart"
                        class="touch-target inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap text-white/70 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-purple-600 hover:text-white active:scale-[0.97]"
                    >
                        Organizational Chart
                    </a>
                    <a
                        href="/#yearly"
                        class="touch-target inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap text-white/70 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-purple-600 hover:text-white active:scale-[0.97]"
                    >
                        Sex-Disaggregated Data Reports
                    </a>
                </div>
            </nav>

            <!-- Right Column: Navigation & Auth -->
            <nav class="flex items-center justify-end gap-2 sm:gap-3" aria-label="Site">
                <Link
                    v-if="!user"
                    :href="route('login')"
                    class="cursor-pointer inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/35 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-blue-500 hover:shadow-blue-950/50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716]"
                >
                    Log in
                </Link>

                <template v-else>
                    <DropdownMenu v-if="user?.can?.accessReportYears">
                        <DropdownMenuTrigger :as-child="true">
                            <Button
                                type="button"
                                variant="outline"
                                class="group cursor-pointer rounded-full border border-violet-500/30 bg-violet-600/90 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-900/20 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out hover:bg-violet-500 hover:border-violet-400/50 hover:shadow-violet-900/40 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716] sm:px-5"
                            >
                                Reports
                                <ChevronDown class="ml-1 size-4 opacity-70 transition-transform duration-150 ease-out group-data-[state=open]:rotate-180" aria-hidden="true" />
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
                                <DropdownMenuItem v-if="user?.can?.createReportYears" :as-child="true">
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
                        class="cursor-pointer rounded-full border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-red-400 transition-[transform,color] duration-150 ease-out hover:text-red-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716]"
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
                                class="touch-target relative h-10 w-10 cursor-pointer rounded-full p-1 text-white transition-[transform,background-color] duration-150 ease-out hover:bg-white/10 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716] sm:h-9 sm:w-9"
                            >
                                <Avatar class="size-8 overflow-hidden rounded-full border border-white/15">
                                    <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="userMenuLabel" />
                                    <AvatarFallback class="rounded-full bg-violet-800/90 font-semibold text-white">
                                        {{ getInitials(userMenuLabel) }}
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
