<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import type { ManagedReportYearListItem } from '@/types/reports';
import { Head, Link, useForm } from '@inertiajs/vue3';

import type { BreadcrumbItem } from '@/types';

interface Props {
    reportYears: ManagedReportYearListItem[];
}

defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Report years',
        href: '/report-years',
    },
];

const currentYear = new Date().getFullYear();

const form = useForm({
    year: currentYear,
    title: '',
    description: '',
    status: 'pending',
    color_theme: 'violet',
    background_image: '/svg/reports.svg',
});

const submit = () => {
    form.post(route('report-years.store'));
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Report years" />

        <div class="space-y-6 p-4 md:p-6">
            <div class="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
                <section class="rounded-xl border bg-card p-6 shadow-sm">
                    <HeadingSmall title="Create report year" description="Create a yearly report shell first, then fill each normalized section on the edit page." />

                    <form class="mt-6 space-y-5" @submit.prevent="submit">
                        <div class="grid gap-2">
                            <Label for="year">Year</Label>
                            <Input id="year" v-model="form.year" type="number" min="2000" max="2100" />
                            <InputError :message="form.errors.year" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="title">Title</Label>
                            <Input id="title" v-model="form.title" type="text" placeholder="Optional custom title" />
                            <InputError :message="form.errors.title" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="description">Description</Label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                rows="4"
                                class="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                placeholder="Short card description for this report year"
                            />
                            <InputError :message="form.errors.description" />
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="grid gap-2">
                                <Label for="status">Status</Label>
                                <select
                                    id="status"
                                    v-model="form.status"
                                    class="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="published">Published</option>
                                </select>
                                <InputError :message="form.errors.status" />
                            </div>

                            <div class="grid gap-2">
                                <Label for="color_theme">Color theme</Label>
                                <select
                                    id="color_theme"
                                    v-model="form.color_theme"
                                    class="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <option value="violet">Violet</option>
                                    <option value="purple">Purple</option>
                                    <option value="indigo">Indigo</option>
                                </select>
                                <InputError :message="form.errors.color_theme" />
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <Label for="background_image">Background image</Label>
                            <Input id="background_image" v-model="form.background_image" type="text" placeholder="/svg/reports.svg" />
                            <InputError :message="form.errors.background_image" />
                        </div>

                        <div class="flex items-center gap-4">
                            <Button :disabled="form.processing">Create year</Button>
                            <p v-show="form.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                        </div>
                    </form>
                </section>

                <section class="rounded-xl border bg-card p-6 shadow-sm">
                    <HeadingSmall title="Existing report years" description="Edit each year section by section after the shell record is created." />

                    <div v-if="reportYears.length === 0" class="mt-6 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                        No report years yet.
                    </div>

                    <div v-else class="mt-6 space-y-4">
                        <article
                            v-for="reportYear in reportYears"
                            :key="reportYear.id"
                            class="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-start md:justify-between"
                        >
                            <div class="space-y-1">
                                <div class="flex items-center gap-3">
                                    <h2 class="text-lg font-semibold">{{ reportYear.year }}</h2>
                                    <span
                                        :class="[
                                            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                                            reportYear.status === 'published'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700',
                                        ]"
                                    >
                                        {{ reportYear.status }}
                                    </span>
                                </div>
                                <p v-if="reportYear.title" class="text-sm font-medium text-muted-foreground">{{ reportYear.title }}</p>
                                <p v-if="reportYear.description" class="max-w-2xl text-sm text-muted-foreground">
                                    {{ reportYear.description }}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    Published at:
                                    {{ reportYear.publishedAt ?? 'Not published yet' }}
                                </p>
                            </div>

                            <Button as-child variant="outline">
                                <Link :href="route('report-years.edit', reportYear.id)">Manage sections</Link>
                            </Button>
                        </article>
                    </div>
                </section>
            </div>
        </div>
    </AppLayout>
</template>
