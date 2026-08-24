<script setup lang="ts">
defineOptions({
    name: 'GadStrategicFrameworkSection',
});

const MANDATE_TEXT =
    'The Department of Science and Technology - Region IX is mandated to mainstream Gender and Development (GAD) in all regional policies, programs, and activities in accordance with the Constitution, the Magna Carta of Women (RA 9710), and PCW guidelines, ensuring that science, technology, and innovation initiatives are gender-responsive, inclusive, and equitable. ' +
    'DOST IX shall promote equal access and participation of women and men in science, research, innovation, and technology transfer; address region-specific gender issues, particularly among marginalized sectors; ensure a safe and respectful workplace; and institutionalize GAD mechanisms.';

const GOALS = [
    'Build robust gender-responsive institutional policies.',
    'Capacitate all DOST-IX employees on Gender and Development through continuous training.',
    'Establish and maintain partnerships with LGUs, academe, private sector, and civil society.',
    'Mainstream gender and development in all programs, activities, and projects.',
] as const;
</script>

<template>
    <section id="gad-strategic-framework" class="home-index-section px-page-gutter" aria-labelledby="gad-strategic-framework-heading">
        <div class="home-index-section__inner max-w-7xl">
            <header class="home-section-header">
                <p class="home-eyebrow">Institutional foundation</p>
                <h2 id="gad-strategic-framework-heading" data-focus-anchor="true" tabindex="-1" class="home-section-title">Strategic framework</h2>
                <p class="home-section-lead">
                    The mandate, vision, mission, and goals that govern gender-responsive science, technology, and innovation at DOST Region IX.
                </p>
            </header>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <article class="home-panel md:col-span-2">
                    <h3 class="home-panel-title">Mandate</h3>
                    <p class="home-panel-body">{{ MANDATE_TEXT }}</p>
                </article>

                <article class="home-panel">
                    <h3 class="home-panel-title">Vision</h3>
                    <p class="home-panel-body">Gender-responsive science, technology, and innovation for inclusive development.</p>
                </article>

                <article class="home-panel">
                    <h3 class="home-panel-title">Mission</h3>
                    <p class="home-panel-body">
                        To advance gender-responsive science, technology, and innovation that widens participation and supports inclusive, sustainable
                        development.
                    </p>
                </article>

                <article class="home-panel md:col-span-2">
                    <h3 class="home-panel-title">Goals</h3>
                    <ol class="home-panel-body list-decimal space-y-2 pl-5 marker:text-brand-300 marker:tabular-nums">
                        <li v-for="goal in GOALS" :key="goal">{{ goal }}</li>
                    </ol>
                </article>
            </div>
        </div>
    </section>
</template>
