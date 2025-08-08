<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';

interface ProjectItem {
    id: number;
    name: string;
    href: string;
}

// Placeholder project items
const projects: ProjectItem[] = Array.from({ length: 8 }, (_, i) => {
    const id = i + 1;
    return {
        id,
        name: `Project ${id}`,
        href: '#', // Replace with real routes when available
    } as ProjectItem;
});

const projectsSectionRef = ref<HTMLElement | null>(null);
const scrollToProjects = () => {
    if (projectsSectionRef.value) {
        projectsSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Move focus for accessibility after smooth scroll completes
        setTimeout(() => {
            const focusable = projectsSectionRef.value?.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
            focusable?.focus({ preventScroll: true });
        }, 600);
    }
};
</script>

<template>
    <Head title="GAD Corner" />

    <div class="flex min-h-screen flex-col bg-background text-foreground">
        <!-- Hero Section -->
        <section class="relative isolate flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center md:py-36">
            <div class="absolute inset-0 -z-10 overflow-hidden">
                <!-- Subtle single-hue atmospheric background (purple) -->
                <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,theme(colors.purple.200)/45%,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_40%,theme(colors.purple.800)/35%,transparent_70%)]"
                />
            </div>
            <div class="max-w-3xl space-y-6">
                <p
                    class="inline-block rounded-full border border-purple-300/70 bg-white/60 px-4 py-1 text-xs font-medium tracking-wide text-purple-700 shadow-sm backdrop-blur dark:border-purple-500/40 dark:bg-purple-900/30 dark:text-purple-200"
                >
                    GAD CORNER
                </p>
                <h1 class="text-4xl font-semibold tracking-tight text-balance text-purple-700 md:text-5xl lg:text-6xl dark:text-purple-300">
                    Empowering Growth & Inclusive Development
                </h1>
                <p class="mx-auto max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
                    Explore our initiatives, resources, and projects focused on Gender and Development. Dive into current programs and discover how we
                    foster equity, participation, and lasting impact.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                        type="button"
                        @click="scrollToProjects"
                        class="group inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-purple-500 dark:hover:bg-purple-400 dark:focus-visible:ring-purple-400"
                    >
                        View Projects
                        <span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                    </button>
                    <a
                        href="#"
                        class="inline-flex items-center rounded-md border border-purple-300 bg-background px-6 py-3 text-sm font-medium text-purple-700 shadow-sm transition-colors hover:bg-purple-50 hover:text-purple-800 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-purple-600 dark:text-purple-200 dark:hover:bg-purple-800/40 dark:hover:text-purple-100"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        <section
            ref="projectsSectionRef"
            id="projects"
            class="relative scroll-mt-24 border-t border-purple-200/60 bg-muted/30 px-6 py-20 md:py-28 dark:border-purple-800/60 dark:bg-purple-950/40"
            aria-labelledby="projects-heading"
        >
            <div class="mx-auto max-w-6xl">
                <div class="mb-10 flex flex-col items-center gap-4 text-center md:mb-14">
                    <h2
                        id="projects-heading"
                        data-focus-anchor="true"
                        tabindex="-1"
                        class="text-3xl font-semibold tracking-tight text-purple-700 md:text-4xl dark:text-purple-300"
                    >
                        Featured Projects
                    </h2>
                    <p class="max-w-2xl text-sm text-balance text-muted-foreground md:text-base">
                        A quick overview of our active and upcoming initiatives. Select a project to explore more details soon.
                    </p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <button
                        v-for="project in projects"
                        :key="project.id"
                        type="button"
                        @click="() => {}"
                        class="group relative flex h-28 flex-col items-start justify-between overflow-hidden rounded-xl border border-purple-200 bg-white/80 p-4 text-left shadow-sm transition hover:border-purple-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-purple-700 dark:bg-purple-900/40 dark:hover:border-purple-400"
                    >
                        <span class="text-sm font-medium text-purple-800 dark:text-purple-200">{{ project.name }}</span>
                        <span class="text-[11px] font-medium tracking-wide text-purple-500 uppercase dark:text-purple-300">Coming Soon</span>
                        <span
                            class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            aria-hidden="true"
                        >
                            <span class="absolute inset-0 bg-purple-200/30 dark:bg-purple-600/20" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>
