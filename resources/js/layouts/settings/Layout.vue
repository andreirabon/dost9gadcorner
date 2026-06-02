<script setup lang="ts">
import Heading from '@/components/shared/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
    },
    {
        title: 'Password',
        href: '/settings/password',
    },
];

const page = usePage();

const currentPath = page.props.ziggy?.location ? new URL(page.props.ziggy.location).pathname : '';
</script>

<template>
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="mb-6">
            <Heading title="Settings" description="Account and password controls" />
        </div>

        <div class="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <aside class="w-full">
                <div class="app-surface-card rounded-2xl p-2">
                    <nav class="flex flex-col space-y-1">
                        <p class="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                            Account
                        </p>
                        <Button
                            v-for="item in sidebarNavItems"
                            :key="item.href"
                            variant="ghost"
                            :class="[
                                'h-10 w-full cursor-pointer justify-start rounded-xl px-3 text-sm font-medium transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97]',
                                currentPath === item.href
                                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                                    : 'text-slate-700 hover:bg-slate-100',
                            ]"
                            as-child
                        >
                            <Link :href="item.href">
                                {{ item.title }}
                            </Link>
                        </Button>
                    </nav>
                </div>
            </aside>

            <Separator class="my-6 lg:hidden" />

            <div class="min-w-0">
                <section class="space-y-8">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
