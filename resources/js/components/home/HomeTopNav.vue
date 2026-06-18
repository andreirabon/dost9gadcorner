<script setup lang="ts">
import type { User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';
import { LogIn, LogOut } from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

defineOptions({
    name: 'HomeTopNav',
});

const page = usePage();

const user = computed(() => page.props.auth?.user as User | null);

const reportYearsIndexUrl = computed(() => route('report-years.index'));

const flushLogout = (): void => {
    router.flushAll();
};

/* ponytail: scroll-aware background opacity shift.
   Ceiling: rAF-free, just a boolean toggle via IntersectionObserver sentinel.
   Upgrade path: useMotionValue + useTransform if continuous opacity needed. */
const scrolled = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);

    observer = new IntersectionObserver(
        ([entry]) => { scrolled.value = !entry.isIntersecting; },
        { threshold: 0 },
    );
    observer.observe(sentinel);
});

onBeforeUnmount(() => {
    observer?.disconnect();
});
</script>

<template>
    <header
        class="home-topnav"
        :class="{ 'home-topnav--scrolled': scrolled }"
        role="banner"
    >
        <div class="px-safe mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4">
            <!-- Left: logos -->
            <div class="flex items-center justify-start gap-2.5 sm:gap-3">
                <img
                    src="/dostlogo.png"
                    alt="DOST Logo"
                    class="h-8 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-9"
                    loading="eager"
                    decoding="async"
                />
                <img
                    src="/gadlogo.png"
                    alt="GAD Logo"
                    class="h-8 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-9"
                    loading="eager"
                    decoding="async"
                />
                <img
                    src="/Bagong_Pilipinas_logo.png"
                    alt="Bagong Pilipinas Logo"
                    class="h-8 w-auto max-w-[100px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-9 sm:max-w-[120px]"
                    loading="eager"
                    decoding="async"
                />
            </div>

            <!-- Center: section links (desktop) -->
            <nav class="hidden items-center justify-center lg:flex">
                <div class="home-topnav-pills">
                    <a
                        href="/#gad-strategic-framework"
                        class="home-topnav-pill"
                    >
                        Strategic Framework
                    </a>
                    <a
                        href="/#org-chart"
                        class="home-topnav-pill"
                    >
                        Organizational Chart
                    </a>
                    <a
                        href="/#yearly"
                        class="home-topnav-pill"
                    >
                        Data Reports
                    </a>
                </div>
            </nav>

            <!-- Right: auth actions -->
            <nav class="flex items-center justify-end gap-2 sm:gap-2.5" aria-label="Site">
                <!-- Logged out: login button -->
                <Link
                    v-if="!user"
                    :href="route('login')"
                    class="home-topnav-login"
                >
                    <LogIn class="size-4 shrink-0" :stroke-width="1.8" aria-hidden="true" />
                    <span>Log in</span>
                </Link>

                <!-- Logged in -->
                <template v-else>
                    <!-- Reports button (admin only) -->
                    <Link
                        v-if="user?.can?.accessReportYears"
                        :href="reportYearsIndexUrl"
                        class="home-topnav-reports-btn inline-flex items-center justify-center"
                    >
                        Reports
                    </Link>

                    <!-- Logout button -->
                    <Link
                        class="home-topnav-logout"
                        method="post"
                        :href="route('logout')"
                        @click="flushLogout"
                        as="button"
                    >
                        <LogOut class="size-4 shrink-0" :stroke-width="1.8" aria-hidden="true" />
                        <span>Log out</span>
                    </Link>
                </template>
            </nav>
        </div>
    </header>
</template>
