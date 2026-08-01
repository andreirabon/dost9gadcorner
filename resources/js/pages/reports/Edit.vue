<script setup lang="ts">
import EmployeeStatusSection from '@/components/reports/edit/EmployeeStatusSection.vue';
import GfpsAssembliesSection from '@/components/reports/edit/GfpsAssembliesSection.vue';
import GfpsMembershipSection from '@/components/reports/edit/GfpsMembershipSection.vue';
import MetadataSection from '@/components/reports/edit/MetadataSection.vue';
import ProgramFundingSection from '@/components/reports/edit/ProgramFundingSection.vue';
import RstlMonthlySection from '@/components/reports/edit/RstlMonthlySection.vue';
import ScholarshipSection from '@/components/reports/edit/ScholarshipSection.vue';
import ReportBackNavLink from '@/components/reports/ReportBackNavLink.vue';
import { useReportSectionSave } from '@/composables/useReportSectionSave';
import { formatPublishedAt } from '@/helpers/formatPublishedAt';
import AppLayout from '@/layouts/AppLayout.vue';
import type { EditableReportYear, LookupSchoolYear, ReportYearEditAbilities, SectionTimestamps } from '@/types/reports';
import { Head } from '@inertiajs/vue3';
import { Calendar } from '@lucide/vue';
import { computed, ref, watch } from 'vue';

interface Props {
    reportYear: EditableReportYear;
    schoolYears: LookupSchoolYear[];
    abilities: ReportYearEditAbilities;
    sectionTimestamps: SectionTimestamps;
}

const props = defineProps<Props>();

/**
 * The shell owns only the chrome: tabs, the lock banner, and the one notice
 * line every section reports into. All form state lives in the sections.
 */
const { saveNotice, showSaveNotice } = useReportSectionSave();

const sectionTs = ref<SectionTimestamps>({ ...props.sectionTimestamps });

watch(
    () => props.sectionTimestamps,
    (fresh) => {
        sectionTs.value = { ...fresh };
    },
);

const tabDefs = [
    { id: 'metadata', name: 'Metadata' },
    { id: 'gfps_membership', name: 'GFPS Membership' },
    { id: 'scholarship', name: 'Scholarship' },
    { id: 'gfps_assemblies', name: 'GFPS Assemblies' },
    { id: 'employee_status', name: 'Employee Status' },
    { id: 'rstl_monthly', name: 'RSTL by Month' },
    { id: 'program_funding', name: 'Program Funding' },
] as const;

function tabIsVisible(id: (typeof tabDefs)[number]['id']): boolean {
    const a = props.abilities;
    switch (id) {
        case 'metadata':
            return a.updateMetadata || a.updateFullReport;
        case 'gfps_membership':
            return a.updateGfpsMembership;
        case 'scholarship':
            return a.updateScholarship;
        case 'gfps_assemblies':
            return a.updateGfpsAssemblies;
        case 'employee_status':
            return a.updateEmployeeStatuses;
        case 'rstl_monthly':
            return a.updateRstlMonthly;
        case 'program_funding':
            return a.updateProgramFunding;
        default:
            return false;
    }
}

const visibleTabs = computed(() => tabDefs.filter((t) => tabIsVisible(t.id)));

const isReadOnly = computed(() => props.reportYear.isLocked);

const isPublished = computed(() => props.reportYear.status === 'published');

const publishedAtLabel = computed(() => formatPublishedAt(props.reportYear.publishedAt));

// Mirrors the metadata title field live, so the heading updates as it is typed.
const draftTitle = ref(props.reportYear.title?.trim() ?? '');

const displayReportTitle = computed(() => draftTitle.value || props.reportYear.title?.trim() || `${props.reportYear.year} report`);

const activeTab = ref('metadata');

const focusTab = (id: string) => {
    document.getElementById(`tab-${id}`)?.focus();
};

const onTabKeydown = (event: KeyboardEvent, index: number) => {
    const tabs = visibleTabs.value;
    if (tabs.length === 0) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
        nextIndex = 0;
    } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
    } else {
        return;
    }

    event.preventDefault();
    activeTab.value = tabs[nextIndex].id;
    focusTab(tabs[nextIndex].id);
};

watch(
    visibleTabs,
    (vis) => {
        if (vis.length === 0) {
            return;
        }
        if (!vis.some((t) => t.id === activeTab.value)) {
            activeTab.value = vis[0].id;
        }
    },
    { immediate: true },
);
</script>

<template>
    <AppLayout :show-footer="false" content-class="report-years-page">
        <Head :title="`Manage ${reportYear.year} report`" />

        <div class="report-years-inner report-years-inner--edit">
            <header class="report-years-edit-header animate-fade-in-up">
                <div class="report-years-edit-intro">
                    <div class="report-years-edit-hero">
                        <div class="report-years-edit-hero-top">
                            <div class="report-years-edit-hero-badges">
                                <span class="report-years-edit-meta-chip">Currently Editing</span>
                                <span
                                    class="report-years-status-badge"
                                    :class="isPublished ? 'report-years-status-badge--published' : 'report-years-status-badge--pending'"
                                >
                                    <Calendar v-if="isPublished" class="size-3.5 shrink-0 text-emerald-700" :stroke-width="2" aria-hidden="true" />
                                    <span
                                        class="report-years-status-badge-label"
                                        :class="
                                            isPublished ? 'report-years-status-badge-label--published' : 'report-years-status-badge-label--pending'
                                        "
                                    >
                                        {{ isPublished ? 'Published' : 'Pending' }}
                                    </span>
                                    <span
                                        v-if="isPublished && publishedAtLabel"
                                        class="report-years-status-badge-detail report-years-status-badge-detail--published"
                                    >
                                        {{ publishedAtLabel }}
                                    </span>
                                    <span
                                        v-else-if="isPublished"
                                        class="report-years-status-badge-detail report-years-status-badge-detail--published"
                                    >
                                        Publish date unavailable
                                    </span>
                                    <span v-else class="report-years-status-badge-detail report-years-status-badge-detail--pending">
                                        Awaiting publication
                                    </span>
                                </span>
                            </div>
                            <ReportBackNavLink :href="route('report-years.index')" inline> Select Another Year </ReportBackNavLink>
                        </div>
                        <h1 class="report-years-edit-hero-title">
                            {{ displayReportTitle }}
                        </h1>
                        <p class="report-years-lede">
                            Sections may be updated in any order. Save each tab when you finish. Visible tabs follow your account access.
                        </p>
                    </div>

                    <div class="report-years-tab-bar">
                        <nav class="report-years-tab-nav" aria-label="Report sections" role="tablist">
                            <button
                                v-for="(tab, tabIndex) in visibleTabs"
                                :id="`tab-${tab.id}`"
                                :key="tab.id"
                                type="button"
                                role="tab"
                                :aria-selected="activeTab === tab.id"
                                :aria-controls="`panel-${tab.id}`"
                                :tabindex="activeTab === tab.id ? 0 : -1"
                                class="report-years-tab transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[0.98] active:scale-[0.95]"
                                :class="{ 'is-active': activeTab === tab.id }"
                                @click="activeTab = tab.id"
                                @keydown="onTabKeydown($event, tabIndex)"
                            >
                                {{ tab.name }}
                            </button>
                        </nav>
                    </div>
                </div>

                <p v-if="saveNotice" class="text-sm font-medium text-amber-800" role="status" aria-live="polite">
                    {{ saveNotice }}
                </p>
            </header>

            <div v-if="reportYear.isLocked" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
                <p class="font-medium">This report year is locked.</p>
                <p class="mt-1 text-amber-800">Unlock it from the report years list to edit sections or delete data.</p>
            </div>

            <div class="animate-fade-in-up w-full delay-1">
                <MetadataSection
                    v-show="activeTab === 'metadata'"
                    :report-year-id="reportYear.id"
                    :year="reportYear.year"
                    :title="reportYear.title"
                    :description="reportYear.description"
                    :status="reportYear.status"
                    :published-at-label="publishedAtLabel"
                    :can-update-full-report="abilities.updateFullReport"
                    :expected-updated-at="sectionTs.metadata"
                    :is-read-only="isReadOnly"
                    @notice="showSaveNotice"
                    @title-change="draftTitle = $event"
                />

                <GfpsMembershipSection
                    v-show="activeTab === 'gfps_membership'"
                    :report-year-id="reportYear.id"
                    :membership="reportYear.gfpsMembership"
                    :expected-updated-at="sectionTs.gfpsMembership"
                    :is-read-only="isReadOnly"
                    @notice="showSaveNotice"
                />

                <ScholarshipSection
                    v-show="activeTab === 'scholarship'"
                    :report-year="reportYear"
                    :school-years="schoolYears"
                    :can-update="abilities.updateScholarship"
                    :can-delete="abilities.deleteScholarship"
                    :is-read-only="isReadOnly"
                    @notice="showSaveNotice"
                />

                <GfpsAssembliesSection
                    v-show="activeTab === 'gfps_assemblies'"
                    :report-year-id="reportYear.id"
                    :rows="reportYear.gfpsAssemblies"
                    :expected-updated-at="sectionTs.gfpsAssemblies"
                    :is-read-only="isReadOnly"
                    @notice="showSaveNotice"
                />

                <EmployeeStatusSection
                    v-show="activeTab === 'employee_status'"
                    :report-year-id="reportYear.id"
                    :rows="reportYear.employeeStatuses"
                    :expected-updated-at="sectionTs.employeeStatuses"
                    :is-read-only="isReadOnly"
                    @notice="showSaveNotice"
                />

                <RstlMonthlySection
                    v-show="activeTab === 'rstl_monthly'"
                    :report-year-id="reportYear.id"
                    :rows="reportYear.rstlMonthly"
                    :expected-updated-at="sectionTs.rstlMonthly"
                    :is-read-only="isReadOnly"
                    @notice="showSaveNotice"
                />

                <ProgramFundingSection
                    v-show="activeTab === 'program_funding'"
                    :report-year-id="reportYear.id"
                    :rows="reportYear.programFunding"
                    :editable-funding-slugs="reportYear.editableFundingSlugs"
                    :expected-updated-at="sectionTs.programFunding"
                    :is-read-only="isReadOnly"
                    @notice="showSaveNotice"
                />
            </div>
        </div>
    </AppLayout>
</template>
