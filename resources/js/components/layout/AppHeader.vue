<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue';
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import UserMenuContent from '@/components/user/UserMenuContent.vue';
import { getInitials } from '@/composables/useInitials';
import type { BreadcrumbItem, NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { FileChartColumnIncreasing, Menu, Search } from 'lucide-vue-next';
import { computed } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const auth = computed(() => page.props.auth);

const isCurrentRoute = computed(() => (url: string) => page.url === url);

const activeItemStyles = computed(
    () => (url: string) => (isCurrentRoute.value(url) ? 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100' : ''),
);

const mainNavItems = computed((): NavItem[] => {
    const items: NavItem[] = [];
    if (page.props.auth.user?.is_admin) {
        items.push({
            title: 'Reports',
            href: '/report-years',
            icon: FileChartColumnIncreasing,
        });
    }

    return items;
});
</script>

<template>
    <div>
        <div class="border-b border-sidebar-border/80">
            <div class="mx-auto flex h-14 items-center px-3 sm:h-16 sm:px-4 md:max-w-7xl">
                <!-- Mobile Menu -->
                <div class="lg:hidden">
                    <Sheet>
                        <SheetTrigger :as-child="true">
                            <Button variant="ghost" size="icon" class="touch-target mr-1 h-10 w-10 sm:mr-2 sm:h-9 sm:w-9">
                                <Menu class="h-5 w-5" />
                                <span class="sr-only">Open navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" class="w-[280px] p-4 sm:w-[300px] sm:p-6">
                            <SheetTitle class="sr-only">Navigation Menu</SheetTitle>
                            <SheetHeader class="border-zinc-200 border-b pb-3 text-left dark:border-zinc-800">
                                <span class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Menu</span>
                            </SheetHeader>
                            <div class="flex flex-1 flex-col space-y-4 py-6">
                                <nav class="-mx-1 space-y-1">
                                    <Link
                                        v-for="item in mainNavItems"
                                        :key="item.title"
                                        :href="item.href"
                                        class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                                        :class="activeItemStyles(item.href)"
                                    >
                                        <component v-if="item.icon" :is="item.icon" class="h-5 w-5" :stroke-width="2" />
                                        {{ item.title }}
                                    </Link>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <Link :href="route('index')" class="flex min-w-0 items-center gap-x-2 lg:gap-x-3">
                    <AppLogo />
                </Link>

                <!-- Desktop Menu -->
                <div class="hidden h-full lg:flex lg:flex-1">
                    <NavigationMenu class="ml-10 flex h-full items-stretch">
                        <NavigationMenuList class="flex h-full items-stretch space-x-2">
                            <NavigationMenuItem v-for="(item, index) in mainNavItems" :key="index" class="relative flex h-full items-center">
                                <Link
                                    :class="[navigationMenuTriggerStyle(), activeItemStyles(item.href), 'h-9 cursor-pointer px-3']"
                                    :href="item.href"
                                >
                                    <component v-if="item.icon" :is="item.icon" class="mr-2 h-4 w-4" />
                                    {{ item.title }}
                                </Link>
                                <div
                                    v-if="isCurrentRoute(item.href)"
                                    class="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-indigo-600 dark:bg-indigo-400"
                                ></div>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div class="ml-auto flex items-center space-x-1 sm:space-x-2">
                    <div class="relative flex items-center space-x-1">
                        <Button variant="ghost" size="icon" class="touch-target group h-10 w-10 cursor-pointer sm:h-9 sm:w-9">
                            <Search class="size-5 opacity-80 group-hover:opacity-100" />
                            <span class="sr-only">Search</span>
                        </Button>
                    </div>

                    <DropdownMenu v-if="auth.user">
                        <DropdownMenuTrigger :as-child="true">
                            <Button
                                variant="ghost"
                                size="icon"
                                class="touch-target relative h-10 w-10 rounded-full p-1 focus-within:ring-2 focus-within:ring-primary sm:size-10"
                            >
                                <Avatar class="size-8 overflow-hidden rounded-full">
                                    <AvatarImage v-if="auth.user.avatar" :src="auth.user.avatar" :alt="auth.user.name" />
                                    <AvatarFallback class="rounded-lg bg-neutral-200 font-semibold text-black dark:bg-neutral-700 dark:text-white">
                                        {{ getInitials(auth.user.name) }}
                                    </AvatarFallback>
                                </Avatar>
                                <span class="sr-only">Open user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56" :side-offset="8">
                            <UserMenuContent :user="auth.user" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>

        <div v-if="props.breadcrumbs.length > 1" class="flex w-full border-b border-sidebar-border/70">
            <div class="mx-auto flex h-10 w-full items-center justify-start px-3 text-neutral-500 sm:h-12 sm:px-4 md:max-w-7xl">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </div>
        </div>
    </div>
</template>
