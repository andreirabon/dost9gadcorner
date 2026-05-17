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

const userMenuLabel = computed(() => user.value?.username?.trim() || '—');
</script>

<template>
    <header
        class="pt-safe sticky top-0 z-40 border-b border-white/5 bg-[#0e0716]/80 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] supports-[backdrop-filter]:bg-[#0e0716]/65 transition-all duration-300"
        role="banner"
    >
        <div class="px-safe mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 sm:min-h-16 sm:gap-4">
            <Link
                :href="route('index')"
                class="cursor-pointer text-lg font-semibold tracking-tighter text-purple-50 transition-all duration-200 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716]"
            >
               Gender and Development Corner
            </Link>

            <nav class="flex items-center gap-2 sm:gap-3" aria-label="Site">
                <Link
                    v-if="!user"
                    :href="route('login')"
                    class="cursor-pointer rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-purple-100 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716]"
                >
                    Log in
                </Link>

                <template v-else>
                    <DropdownMenu v-if="user?.can?.accessReportYears">
                        <DropdownMenuTrigger :as-child="true">
                            <Button
                                type="button"
                                variant="outline"
                                class="group cursor-pointer rounded-full border border-violet-500/30 bg-violet-600/90 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-900/20 transition-all duration-200 hover:bg-violet-500 hover:border-violet-400/50 hover:shadow-violet-900/40 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716] sm:px-5"
                            >
                                Reports
                                <ChevronDown class="ml-1 size-4 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
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
                        class="cursor-pointer rounded-full border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-purple-200 transition-all duration-200 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716]"
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
                                class="touch-target relative h-10 w-10 cursor-pointer rounded-full p-1 text-white transition-transform duration-200 hover:bg-white/10 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716] sm:h-9 sm:w-9"
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
