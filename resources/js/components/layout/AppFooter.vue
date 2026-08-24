<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<!--
    The same footer renders on the dark public site, the light report view, and
    the light admin shell. It used to hard-code a white background plus a pair of
    blue and teal radial washes, so on the public page it appeared as a white
    slab under a near-black page, in a third colour family that existed nowhere
    else. It now inherits: transparent ground, `currentColor` hairline, and text
    opacity for the secondary line.
-->
<template>
    <footer class="px-page-gutter shrink-0 border-t border-current/12 bg-transparent" role="contentinfo">
        <div class="app-footer-inner">
            <p class="leading-relaxed opacity-70">
                &copy; {{ year }} <span class="font-medium opacity-100">Department of Science and Technology Region IX</span>
            </p>

            <p class="flex flex-wrap items-center gap-x-1.5 leading-normal opacity-70">
                <span class="shrink-0">Connect with us on</span>
                <a
                    href="https://www.facebook.com/GADdost9"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="DOST-IX GAD on Facebook (opens in new tab)"
                    class="group inline-flex cursor-pointer items-center gap-1.5 font-medium underline-offset-2 opacity-100 transition-opacity duration-200 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                >
                    <svg
                        class="block size-4 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="currentColor"
                            d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        />
                    </svg>
                    Facebook
                </a>
            </p>
        </div>
    </footer>
</template>
