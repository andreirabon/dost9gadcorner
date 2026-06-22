<script setup lang="ts">
import ReportBackNavLink from '@/components/reports/ReportBackNavLink.vue';
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast/use-toast';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import { formatPublishedAt } from '@/helpers/formatPublishedAt';
import { cloneSnapshot, diffObjectPatch, diffRowPatches, hasPatch, normalizeNumeric } from '@/helpers/reportPatch';
import AppLayout from '@/layouts/AppLayout.vue';
import type { EditableReportYear, LookupSchoolYear, ReportYearEditAbilities, ScholarshipSnapshot, SectionTimestamps } from '@/types/reports';
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { echo } from '@laravel/echo-vue';
import {
    Calendar,
    CheckCircle2,
    Pencil,
    Plus,
    Save,
    Sparkles,
    Trash2,
    X,
} from '@lucide/vue';
import { computed, onUnmounted, ref, watch } from 'vue';

interface Editor {
    id: number;
    username: string;
}

interface Props {
 reportYear: EditableReportYear;
 schoolYears: LookupSchoolYear[];
 abilities: ReportYearEditAbilities;
 sectionTimestamps: SectionTimestamps;
}

const props = defineProps<Props>();

const { toast } = useToast();

const sectionTs = ref<SectionTimestamps>({ ...props.sectionTimestamps });

// Track which sections were recently updated by another user
const STORAGE_KEY = `report-year-${props.reportYear.id}-section-timestamps`;

function computeRecentlyUpdatedSections(): Set<string> {
 const stored = localStorage.getItem(STORAGE_KEY);
 if (!stored) return new Set<string>();

 try {
  const storedTimestamps: SectionTimestamps = JSON.parse(stored);
  const updated = new Set<string>();

  // Compare stored timestamps with current - any differences mean that section was updated
  const mappings: [keyof SectionTimestamps, string][] = [
   ['metadata', 'metadata'],
   ['gfpsMembership', 'gfps_membership'],
   ['gfpsAssemblies', 'gfps_assemblies'],
   ['employeeStatuses', 'employee_status'],
   ['scholarship', 'scholarship'],
   ['rstlMonthly', 'rstl_monthly'],
   ['programFunding', 'program_funding'],
  ];

  for (const [tsKey, tabId] of mappings) {
   const storedVal = storedTimestamps[tsKey];
   const currentVal = props.sectionTimestamps[tsKey];
   if (storedVal !== currentVal) {
    updated.add(tabId);
   }
  }

  return updated;
 } catch {
  return new Set<string>();
 }
}

const recentlyUpdatedSections = ref<Set<string>>(computeRecentlyUpdatedSections());

const dismissRecentUpdate = (tabId: string) => {
 recentlyUpdatedSections.value.delete(tabId);
};

const hasRecentUpdate = (tabId: string): boolean => recentlyUpdatedSections.value.has(tabId);

watch(() => props.sectionTimestamps, (fresh) => {
 sectionTs.value = { ...fresh };
});

const handleConflictError = (errors: Record<string, string>): boolean => {
 if (errors.conflict) {
  toast({
   title: 'Save Conflict',
   description: errors.conflict,
   type: 'error',
   duration: 0,
   action: {
    label: 'Refresh',
    onClick: () => router.reload(),
   },
  });
  return true;
 }
 return false;
};

const currentEditors = ref<Editor[]>([]);

const getAvatarColor = (username: string): string => {
    const colors = [
        'bg-blue-100 text-blue-700', 'bg-rose-100 text-rose-700',
        'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700',
        'bg-purple-100 text-purple-700', 'bg-fuchsia-100 text-fuchsia-700',
        'bg-indigo-100 text-indigo-700', 'bg-teal-100 text-teal-700',
        'bg-orange-100 text-orange-700', 'bg-cyan-100 text-cyan-700',
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getInitial = (username?: string): string => {
    return username ? username.charAt(0).toUpperCase() : '?';
};

const presenceChannelName = `report-year.edit.${props.reportYear.id}`;

// Initialize WebSockets
echo().join(presenceChannelName)
    .here((users: Editor[]) => {
        currentEditors.value = users;
    })
    .joining((user: Editor) => {
        currentEditors.value.push(user);
        toast({ title: 'User joined', description: `${user.username} is now viewing this report.` });
    })
    .leaving((user: Editor) => {
        currentEditors.value = currentEditors.value.filter(u => String(u.id) !== String(user.id));
    });

const page = usePage();
const currentUserId = computed(() => page.props.auth?.user?.id as number | null);

echo().private('report-years')
    .listen('ReportYearUpdated', (e: { reportYear: { id: number }; userId: number | null; section: string | null }) => {
        if (e.reportYear.id !== props.reportYear.id || e.userId === currentUserId.value) {
            return;
        }

        // Only notify if the updated section is visible to the current user
        if (e.section && !visibleTabs.value.some(t => t.id === e.section)) {
            return;
        }

        // Store current timestamps before they change (for post-refresh comparison)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sectionTs.value));

        const sectionLabel = e.section
            ? visibleTabs.value.find(t => t.id === e.section)?.name ?? e.section
            : null;

        toast({
            title: 'Report Updated',
            description: sectionLabel
                ? `Another user has saved changes to "${sectionLabel}". You may want to refresh to see the latest data.`
                : 'Another user has saved changes to this report. You may want to refresh to see the latest data.',
            type: 'warning',
            duration: 8000,
        });
    });

// Prevent memory leaks / ghost users on navigation
onUnmounted(() => {
    echo().leave(presenceChannelName);
    echo().leave('report-years');
    localStorage.removeItem(STORAGE_KEY);
});

// Clear recently updated indicators after 2 minutes
setTimeout(() => {
 recentlyUpdatedSections.value.clear();
 localStorage.removeItem(STORAGE_KEY);
}, 2 * 60 * 1000);

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

const metadataForm = useForm({
 year: props.reportYear.year,
 title: props.reportYear.title ?? '',
 description: props.reportYear.description ?? '',
 status: props.reportYear.status,
});

const gfpsMembershipForm = useForm({
    female_count: props.reportYear.gfpsMembership.femaleCount,
    male_count: props.reportYear.gfpsMembership.maleCount,
});

const gfpsAssembliesForm = useForm({
    attendances: props.reportYear.gfpsAssemblies.map((row) => ({
        period_id: row.periodId,
        female_count: row.femaleCount,
        male_count: row.maleCount,
    })),
});

const employeeStatusesForm = useForm({
    breakdowns: props.reportYear.employeeStatuses.map((row) => ({
        employment_status_id: row.employmentStatusId,
        female_count: row.femaleCount,
        male_count: row.maleCount,
    })),
});

// --- Scholarship snapshots ---
const latestSnapshot = computed(() => props.reportYear.scholarshipSnapshots[0] ?? null);

const todayDate = new Date().toLocaleDateString('en-CA');

const newSnapshotForm = useForm({
    school_year_id: latestSnapshot.value?.schoolYearId ?? '',
    as_of_date: todayDate,
    female_count: 0,
    male_count: 0,
});

const showAddForm = ref(false);
const editingSnapshotId = ref<number | null>(null);
const editSnapshotForm = useForm({
    school_year_id: '' as string | number,
    as_of_date: '',
    female_count: 0,
    male_count: 0,
});

const startEditSnapshot = (snap: ScholarshipSnapshot) => {
    editingSnapshotId.value = snap.id;
    editSnapshotForm.school_year_id = snap.schoolYearId ?? '';
    editSnapshotForm.as_of_date = snap.asOfDate ?? '';
    editSnapshotForm.female_count = snap.femaleCount;
    editSnapshotForm.male_count = snap.maleCount;
};

const cancelEditSnapshot = () => {
 editingSnapshotId.value = null;
 editSnapshotForm.reset();
};

const rstlForm = useForm({
    breakdowns: props.reportYear.rstlMonthly.map((row) => ({
        report_month_id: row.reportMonthId,
        female_count: row.femaleCount,
        female_led_count: row.femaleLedCount,
        male_count: row.maleCount,
        male_led_count: row.maleLedCount,
    })),
});

const fundingForm = useForm({
    summaries: props.reportYear.programFunding.map((row) => ({
        funding_program_id: row.fundingProgramId,
        female_projects: row.femaleProjects ?? 0,
        female_amount: row.femaleAmount ?? 0,
        male_projects: row.maleProjects ?? 0,
        male_amount: row.maleAmount ?? 0,
    })),
});

const snapshotMetadataForm = () =>
 cloneSnapshot({
  year: normalizeNumeric(metadataForm.year),
  title: metadataForm.title,
  description: metadataForm.description,
  status: metadataForm.status,
 });

const snapshotGfpsMembershipForm = () =>
    cloneSnapshot({
        female_count: gfpsMembershipForm.female_count,
        male_count: gfpsMembershipForm.male_count,
    });

// (snapshotScholarshipForm removed — snapshots use store/update, not diff-patch)

const originalMetadata = ref(snapshotMetadataForm());
const originalGfpsMembership = ref(snapshotGfpsMembershipForm());
const originalGfpsAssemblies = ref(cloneSnapshot(gfpsAssembliesForm.attendances));
const originalEmployeeStatuses = ref(cloneSnapshot(employeeStatusesForm.breakdowns));

const originalRstlBreakdowns = ref(cloneSnapshot(rstlForm.breakdowns));
const originalFundingSummaries = ref(cloneSnapshot(fundingForm.summaries));

const saveNotice = ref<string | null>(null);
const metadataSaving = ref(false);

const showSaveNotice = (message: string) => {
 saveNotice.value = message;
 window.setTimeout(() => {
  if (saveNotice.value === message) {
   saveNotice.value = null;
  }
 }, 3000);
};

const patchOptions = { preserveScroll: true as const };

const updateMetadata = () => {
 const metadataFields = props.abilities.updateFullReport
  ? (['year', 'title', 'description', 'status'] as const)
  : (['year', 'title', 'description'] as const);

 const patch = diffObjectPatch(originalMetadata.value, snapshotMetadataForm(), [...metadataFields], {
  numeric: ['year'],
 });

 if (!hasPatch(patch)) {
  showSaveNotice('No changes to save.');
  return;
 }

 const url = props.abilities.updateFullReport
  ? route('report-years.update', props.reportYear.id)
  : route('report-years.metadata.update', props.reportYear.id);

 metadataSaving.value = true;
 metadataForm.clearErrors();

 router.patch(url, { ...(patch ?? {}), expected_updated_at: sectionTs.value.metadata } as Record<string, string | number | null>, {
  ...patchOptions,
  onSuccess: () => {
   originalMetadata.value = snapshotMetadataForm();
  },
  onError: (errors) => {
   if (handleConflictError(errors)) {
    metadataSaving.value = false;
    return;
   }
   metadataForm.setError(errors);
   const first = Object.values(errors)[0];
   const message = Array.isArray(first) ? first[0] : first;
   if (typeof message === 'string' && message !== '') {
    showSaveNotice(message);
   }
  },
  onFinish: () => {
   metadataSaving.value = false;
  },
 });
};

const updateGfpsMembership = () => {
    const patch = diffObjectPatch(originalGfpsMembership.value, snapshotGfpsMembershipForm(), ['female_count', 'male_count'], {
        numeric: ['female_count', 'male_count'],
    });

 if (!hasPatch(patch)) {
  showSaveNotice('No changes to save.');
  return;
 }

  gfpsMembershipForm
   .transform(() => ({ ...patch, expected_updated_at: sectionTs.value.gfpsMembership }))
   .patch(route('report-years.gfps-membership.update', props.reportYear.id), {
    ...patchOptions,
    onSuccess: () => {
     originalGfpsMembership.value = snapshotGfpsMembershipForm();
    },
    onError: (errors) => {
     handleConflictError(errors);
    },
   });
};

const updateGfpsAssemblies = () => {
 const attendances = diffRowPatches(
        originalGfpsAssemblies.value,
        gfpsAssembliesForm.attendances,
        'period_id',
        ['female_count', 'male_count'],
 );

 if (!hasPatch(attendances)) {
  showSaveNotice('No changes to save.');
  return;
 }

  gfpsAssembliesForm
   .transform(() => ({ attendances, expected_updated_at: sectionTs.value.gfpsAssemblies }))
   .patch(route('report-years.gfps-assemblies.update', props.reportYear.id), {
    ...patchOptions,
    onSuccess: () => {
     originalGfpsAssemblies.value = cloneSnapshot(gfpsAssembliesForm.attendances);
    },
    onError: (errors) => {
     handleConflictError(errors);
    },
   });
};

const updateEmployeeStatuses = () => {
 const breakdowns = diffRowPatches(
        originalEmployeeStatuses.value,
        employeeStatusesForm.breakdowns,
        'employment_status_id',
        ['female_count', 'male_count'],
 );

 if (!hasPatch(breakdowns)) {
  showSaveNotice('No changes to save.');
  return;
 }

  employeeStatusesForm
   .transform(() => ({ breakdowns, expected_updated_at: sectionTs.value.employeeStatuses }))
   .patch(route('report-years.employee-statuses.update', props.reportYear.id), {
    ...patchOptions,
    onSuccess: () => {
     originalEmployeeStatuses.value = cloneSnapshot(employeeStatusesForm.breakdowns);
    },
    onError: (errors) => {
     handleConflictError(errors);
    },
   });
};

const storeScholarshipSnapshot = () => {
 newSnapshotForm.post(route('report-years.scholarship.store', props.reportYear.id), {
  ...patchOptions,
  onSuccess: () => {
            newSnapshotForm.reset('female_count', 'male_count');
   newSnapshotForm.as_of_date = todayDate;
   showAddForm.value = false;
  },
  onError: (errors) => {
   handleConflictError(errors);
  },
 });
};

const saveEditSnapshot = (snapshotId: number) => {
 const snap = props.reportYear.scholarshipSnapshots.find(s => s.id === snapshotId);
 if (!snap) return;

 editSnapshotForm
  .transform((data) => ({ ...data, expected_updated_at: snap.updatedAt }))
  .patch(route('report-years.scholarship.update', [props.reportYear.id, snapshotId]), {
   ...patchOptions,
   onSuccess: () => {
    editingSnapshotId.value = null;
   },
   onError: (errors) => {
    handleConflictError(errors);
   },
  });
};

const deleteScholarshipSnapshot = (snapshotId: number) => {
 if (!confirm('Permanently delete this snapshot? This cannot be undone.')) return;

 router.delete(route('report-years.scholarship.destroy', [props.reportYear.id, snapshotId]), {
  ...patchOptions,
 });
};

const updateRstlMonthly = () => {
 const breakdowns = diffRowPatches(
        originalRstlBreakdowns.value,
        rstlForm.breakdowns,
        'report_month_id',
        ['female_count', 'female_led_count', 'male_count', 'male_led_count'],
 );

 if (!hasPatch(breakdowns)) {
  showSaveNotice('No changes to save.');
  return;
 }

  rstlForm
   .transform(() => ({ breakdowns, expected_updated_at: sectionTs.value.rstlMonthly }))
   .patch(route('report-years.rstl-monthly.update', props.reportYear.id), {
    ...patchOptions,
    onSuccess: () => {
     originalRstlBreakdowns.value = cloneSnapshot(rstlForm.breakdowns);
    },
    onError: (errors) => {
     handleConflictError(errors);
    },
   });
};

const updateProgramFunding = () => {
 const summaries = diffRowPatches(
        originalFundingSummaries.value,
        fundingForm.summaries,
        'funding_program_id',
        ['female_projects', 'female_amount', 'male_projects', 'male_amount'],
        { decimalFields: ['female_amount', 'male_amount'] },
 );

 if (!hasPatch(summaries)) {
  showSaveNotice('No changes to save.');
  return;
 }

  fundingForm
   .transform(() => ({ summaries, expected_updated_at: sectionTs.value.programFunding }))
   .patch(route('report-years.program-funding.update', props.reportYear.id), {
    ...patchOptions,
    onSuccess: () => {
     originalFundingSummaries.value = cloneSnapshot(fundingForm.summaries);
    },
    onError: (errors) => {
     handleConflictError(errors);
    },
   });
};

const inputClass = 'report-field w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]';
const tableInputClass = 'report-field report-years-data-input w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]';

const isSetupFundingSlug = (slug: string): boolean => slug === 'setup' || slug.startsWith('setup-');
const isCestFundingSlug = (slug: string): boolean => slug === 'cest' || slug.startsWith('cest-');

const fundingRows = computed(() =>
 fundingForm.summaries.map((row, index) => ({
  row,
  label: props.reportYear.programFunding[index]?.label ?? `Program ${index + 1}`,
  slug: props.reportYear.programFunding[index]?.slug ?? '',
 })),
);

const setupFundingRows = computed(() => {
    const username = page.props.auth.user?.username?.toLowerCase();
    
    return fundingRows.value.filter((item) => {
        if (!isSetupFundingSlug(item.slug)) {
            return false;
        }

        if (username === 'toszcic' && item.slug !== 'setup-zc-ic') return false;
        if (username === 'toszsp' && item.slug !== 'setup-zsp') return false;
        if (username === 'toszds' && item.slug !== 'setup-zds') return false;
        if (username === 'toszdn' && item.slug !== 'setup-zdn') return false;

        return true;
    });
});
const cestFundingRows = computed(() => {
    const username = page.props.auth.user?.username?.toLowerCase();
    
    return fundingRows.value.filter((item) => {
        if (!isCestFundingSlug(item.slug)) {
            return false;
        }

        if (username === 'toszcic' && item.slug !== 'cest-zc-ic') return false;
        if (username === 'toszsp' && item.slug !== 'cest-zsp') return false;
        if (username === 'toszds' && item.slug !== 'cest-zds') return false;
        if (username === 'toszdn' && item.slug !== 'cest-zdn') return false;

        return true;
    });
});

const isPublished = computed(() => props.reportYear.status === 'published');

const publishedAtLabel = computed(() => formatPublishedAt(props.reportYear.publishedAt));

const descriptionLength = computed(() => String(metadataForm.description ?? '').length);

const metadataPatchError = computed(() => {
 const errors = metadataForm.errors as Record<string, string | undefined>;

 return errors.patch;
});

const displayReportTitle = computed(() => {
 const t = String(metadataForm.title ?? '').trim();
 if (t) {
 return t;
 }
 const fromServer = props.reportYear.title?.trim();
 if (fromServer) {
 return fromServer;
 }

 return `${props.reportYear.year} report`;
});

const toNum = (v: unknown): number => {
 const n = Number(v);
 return Number.isFinite(n) ? n : 0;
};

const gfpsMembershipTotal = computed(() =>
    toNum(gfpsMembershipForm.female_count) + toNum(gfpsMembershipForm.male_count),
);

const newSnapshotTotal = computed(() =>
    toNum(newSnapshotForm.female_count) + toNum(newSnapshotForm.male_count),
);

const editSnapshotTotal = computed(() =>
    toNum(editSnapshotForm.female_count) + toNum(editSnapshotForm.male_count),
);

const activeTab = ref('metadata');

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
 <AppLayout
 :show-footer="false"
 content-class="report-years-page"
 >
 <Head :title="`Manage ${reportYear.year} report`" />

 <div class="report-years-inner report-years-inner--edit">
 <header class="report-years-edit-header animate-fade-in-up">
 <div class="report-years-edit-intro">
 <div class="report-years-edit-hero">
 <div class="report-years-edit-hero-top">
 <div class="report-years-edit-hero-badges">
 <div v-if="currentEditors.length > 1" class="flex space-x-1.5 mr-2">
 <div v-for="editor in currentEditors" :key="editor.id" class="flex h-6 items-center justify-center rounded-full px-2.5 text-[10px] font-bold shadow-sm" :class="getAvatarColor(editor.username ?? '')" :title="editor.username ?? 'Unknown User'">
 {{ editor.username }}
 </div>
 </div>
 <span v-else class="report-years-edit-meta-chip">Currently Editing</span>
 <span
 class="report-years-status-badge"
 :class="isPublished ? 'report-years-status-badge--published' : 'report-years-status-badge--pending'"
 >
 <Calendar
 v-if="isPublished"
 class="size-3.5 shrink-0 text-emerald-700"
 :stroke-width="2"
 aria-hidden="true"
 />
 <span
 class="report-years-status-badge-label"
 :class="isPublished ? 'report-years-status-badge-label--published' : 'report-years-status-badge-label--pending'"
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
 Not set
 </span>
 <span
 v-else
 class="report-years-status-badge-detail report-years-status-badge-detail--pending"
 >
 Awaiting publication
 </span>
 </span>
 </div>
 <ReportBackNavLink :href="route('report-years.index')" inline>
 Select Another Year
 </ReportBackNavLink>
 </div>
 <h1 class="report-years-edit-hero-title">
 {{ displayReportTitle }}
 </h1>
 <p class="report-years-lede text-xs">
 Sections may be updated in any order. Save each tab when you finish that section. Visible tabs follow your account access.
 </p>
 </div>

 <div class="report-years-tab-bar">
 <nav class="report-years-tab-nav" aria-label="Report sections" role="tablist">
<button
v-for="tab in visibleTabs"
:key="tab.id"
type="button"
role="tab"
:aria-selected="activeTab === tab.id"
class="report-years-tab transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[0.98] active:scale-[0.95]"
:class="{ 'is-active': activeTab === tab.id, 'has-recent-update': hasRecentUpdate(tab.id) }"
@click="activeTab = tab.id; dismissRecentUpdate(tab.id)"
>
<Sparkles
v-if="hasRecentUpdate(tab.id)"
class="mr-1.5 size-3.5 text-amber-500"
aria-hidden="true"
/>
{{ tab.name }}
<span
v-if="hasRecentUpdate(tab.id)"
class="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800"
>
    Updated
</span>
</button>
 </nav>
 </div>
 </div>

 <p
 v-if="saveNotice"
 class="text-xs font-medium text-amber-800"
 role="status"
 aria-live="polite"
 >
 {{ saveNotice }}
 </p>
 </header>

 <div class="w-full animate-fade-in-up delay-1">
<section v-show="activeTab === 'metadata'" class="report-panel" role="tabpanel">
<div
v-if="hasRecentUpdate('metadata')"
class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
role="status"
>
<Sparkles class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
<span class="flex-1">This section was recently updated by another user.</span>
<button
type="button"
class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]"
@click="dismissRecentUpdate('metadata')"
>
Dismiss
</button>
</div>

<HeadingSmall
variant="report"
title="Metadata"
description="Calendar year, publication status, and the title and description readers see for this report."
/>

 <form
 class="report-form report-form--edit w-full"
 autocomplete="off"
 @submit.prevent="updateMetadata"
 >
 <div class="grid gap-4 sm:grid-cols-[10rem_14rem]">
 <div class="grid gap-2">
 <Label for="year">Year</Label>
 <Input
 id="year"
 v-model="metadataForm.year"
 name="year"
 type="number"
 :min="REPORT_YEAR_FIELD_LIMITS.yearMin"
 :max="REPORT_YEAR_FIELD_LIMITS.yearMax"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="metadataForm.errors.year" />
 </div>

 <div v-if="abilities.updateFullReport" class="grid gap-2">
 <Label for="status">Status</Label>
 <select id="status" v-model="metadataForm.status" name="status" class="report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]">
 <option value="pending">Pending</option>
 <option value="published">Published</option>
 </select>
 <InputError :message="metadataForm.errors.status" />
 </div>
 <div v-else class="grid gap-2">
 <span class="text-sm font-medium text-black">Status</span>
 <p
 class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-black"
 >
 <span
 v-if="metadataForm.status === 'published'"
 class="font-medium text-emerald-800"
 >
 Published<template v-if="publishedAtLabel"> · {{ publishedAtLabel }}</template>
 </span>
 <span v-else class="font-medium text-amber-800">Pending</span>
 </p>
 </div>
 </div>

 <div class="grid gap-2">
 <Label for="title">Title</Label>
 <Input
 id="title"
 v-model="metadataForm.title"
 name="title"
 type="text"
 placeholder="Optional custom title"
 :maxlength="REPORT_YEAR_FIELD_LIMITS.title"
 :class="inputClass"
 />
 <p class="text-xs text-black">Up to {{ REPORT_YEAR_FIELD_LIMITS.title }} characters.</p>
 <InputError :message="metadataForm.errors.title" />
 </div>

 <div class="grid gap-2">
 <Label for="description">Description</Label>
 <textarea
 id="description"
 v-model="metadataForm.description"
 name="description"
 rows="4"
 class="report-textarea transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
 :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
 />
 <p class="text-xs text-black">
 {{ descriptionLength }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
 </p>
 <InputError :message="metadataForm.errors.description" />
 </div>

 <InputError :message="metadataPatchError" />

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2">
 <Button type="submit" :disabled="metadataSaving" class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save metadata
 </Button>
 <p v-show="metadataForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

<section v-show="activeTab === 'gfps_membership'" class="report-panel" role="tabpanel">
<div
v-if="hasRecentUpdate('gfps_membership')"
class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
role="status"
>
<Sparkles class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
<span class="flex-1">This section was recently updated by another user.</span>
<button
type="button"
class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]"
@click="dismissRecentUpdate('gfps_membership')"
>
Dismiss
</button>
</div>

<HeadingSmall
variant="report"
title="GFPS membership"
description="Total GFPS members by sex for this reporting year. Use whole numbers only."
/>

 <form
 class="report-form report-form--edit w-full"
 @submit.prevent="updateGfpsMembership"
 >
 <div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 shadow-sm">
 <div class="grid gap-4 sm:grid-cols-2">
 <div class="grid gap-2">
 <Label for="gfps_female_count">Female</Label>
 <Input
 id="gfps_female_count"
 v-model="gfpsMembershipForm.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="gfpsMembershipForm.errors.female_count" />
 </div>


 <div class="grid gap-2">
 <Label for="gfps_male_count">Male</Label>
 <Input
 id="gfps_male_count"
 v-model="gfpsMembershipForm.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="gfpsMembershipForm.errors.male_count" />
 </div>
 </div>
 <p class="mt-1 max-w-md text-xs text-black">
 Total members: <span class="font-medium text-black tabular-nums">{{ gfpsMembershipTotal }}</span>
 </p>
 </div>

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2">
 <Button type="submit" class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]" :disabled="gfpsMembershipForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save GFPS membership
 </Button>
 <p v-show="gfpsMembershipForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

<section v-show="activeTab === 'scholarship'" class="report-panel" role="tabpanel">
<div
v-if="hasRecentUpdate('scholarship')"
class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
role="status"
>
<Sparkles class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
<span class="flex-1">This section was recently updated by another user.</span>
<button
type="button"
class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]"
@click="dismissRecentUpdate('scholarship')"
>
Dismiss
</button>
</div>

<HeadingSmall
variant="report"
title="Scholarship"
description="Track scholar counts across the year. Each update is saved as a separate snapshot — previous data is always preserved."
/>

  <Transition name="fade-slide" mode="out-in">
   <div v-if="!showAddForm" key="btn" class="mt-6 mb-6">
    <Button
     type="button"
     variant="outline"
     class="flex items-center gap-2 border-emerald-200 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
     @click="showAddForm = true"
    >
     <Plus class="size-4 text-emerald-600 animate-pulse" aria-hidden="true" />
     <span>Add New Snapshot</span>
    </Button>
   </div>

   <form
    v-else
    key="form"
    class="report-form report-form--edit w-full mb-6 border border-zinc-200 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mt-6 transition-[transform,background-color,border-color,color] duration-200 ease-out"
    @submit.prevent="storeScholarshipSnapshot"
   >
    <div class="mb-4 flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
     <div class="flex items-center gap-2">
      <Plus class="size-4 text-emerald-600" aria-hidden="true" />
      <span class="text-sm font-semibold text-zinc-900">Add New Snapshot</span>
     </div>
     <button
      type="button"
      class="text-xs text-zinc-400 hover:text-zinc-700 underline transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"
      @click="showAddForm = false"
     >
      Cancel
     </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] mt-6">
     <div class="grid gap-2">
      <Label for="new_school_year_id">School year</Label>
      <select
       id="new_school_year_id"
       v-model="newSnapshotForm.school_year_id"
       class="report-select transition-all hover:border-zinc-300 focus:border-zinc-400"
      >
       <option value="" disabled>Select school year…</option>
       <option v-for="sy in schoolYears" :key="sy.id" :value="sy.id">
        {{ sy.label }}
       </option>
      </select>
      <InputError :message="newSnapshotForm.errors.school_year_id" />
     </div>

     <div class="grid gap-2">
      <Label for="new_as_of_date">As of date</Label>
      <Input id="new_as_of_date" v-model="newSnapshotForm.as_of_date" type="date" :max="todayDate" :class="inputClass" />
      <InputError :message="newSnapshotForm.errors.as_of_date" />
     </div>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 mt-6 shadow-sm">
     <div class="grid gap-4 sm:grid-cols-2">
      <div class="grid gap-2">
       <Label for="new_female_count">Female</Label>
       <Input
        id="new_female_count"
        v-model="newSnapshotForm.female_count"
        type="number"
        min="0"
        inputmode="numeric"
        :class="inputClass"
       />
       <InputError :message="newSnapshotForm.errors.female_count" />
      </div>


      <div class="grid gap-2">
       <Label for="new_male_count">Male</Label>
       <Input
        id="new_male_count"
        v-model="newSnapshotForm.male_count"
        type="number"
        min="0"
        inputmode="numeric"
        :class="inputClass"
       />
       <InputError :message="newSnapshotForm.errors.male_count" />
      </div>
     </div>

     <div class="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm">
      <span class="text-zinc-500 font-medium">Total Scholars</span>
      <span class="rounded-lg bg-zinc-950 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums">
       {{ newSnapshotTotal }}
      </span>
     </div>
    </div>

    <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-4 mt-6">
     <Button type="submit" class="report-save-btn flex items-center gap-2 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" :disabled="newSnapshotForm.processing">
      <Plus class="size-4" :stroke-width="2.5" aria-hidden="true" />
      Save new snapshot
     </Button>
     <Button
      type="button"
      variant="ghost"
      class="text-zinc-500 hover:text-zinc-800 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
      @click="showAddForm = false"
     >
      Cancel
     </Button>
     <p v-show="newSnapshotForm.recentlySuccessful" class="report-save-hint">
      <CheckCircle2 class="size-4 shrink-0 text-emerald-600" :stroke-width="2" aria-hidden="true" />
      Saved
     </p>
    </div>
   </form>
  </Transition>

  <!-- Snapshot History -->
  <div v-if="reportYear.scholarshipSnapshots.length > 0" class="mt-8">
   <div class="mb-4 flex items-center gap-2">
    <span class="text-sm font-semibold text-zinc-900">Snapshot History</span>
    <span class="rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700">{{ reportYear.scholarshipSnapshots.length }}</span>
   </div>

   <!-- Vertical Timeline line -->
   <div class="relative pl-6 border-l border-zinc-200 ml-3 space-y-6">
    <div
     v-for="(snap, index) in reportYear.scholarshipSnapshots"
     :key="snap.id"
     class="relative rounded-2xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5"
     :class="index === 0 ? 'border-emerald-200 bg-emerald-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.01)]' : 'border-zinc-200 bg-white'"
    >
     <!-- Timeline node indicator dot -->
     <div
      class="absolute -left-[33px] top-[26px] flex h-4 w-4 items-center justify-center rounded-full bg-white border-2"
      :class="index === 0 ? 'border-emerald-500' : 'border-zinc-300'"
     >
      <div
       class="h-1.5 w-1.5 rounded-full"
       :class="index === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'"
      />
     </div>

     <!-- View mode -->
     <template v-if="editingSnapshotId !== snap.id">
      <div class="flex items-start justify-between gap-4">
       <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 flex-wrap">
         <span class="text-sm font-semibold text-zinc-900">
          As of {{ snap.asOfDate ?? 'No date' }}
         </span>
         <span
          v-if="index === 0"
          class="inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800"
         >
          Latest Snapshot
         </span>
        </div>
        <div class="mt-2 text-xs text-zinc-600 flex flex-wrap gap-x-4 gap-y-1">
         <span>School Year: <span class="font-medium text-zinc-900">{{ snap.schoolYearLabel || 'No school year' }}</span></span>
         <span>F: <span class="font-semibold text-zinc-950 font-mono tabular-nums">{{ snap.femaleCount ?? 0 }}</span></span>
         <span>M: <span class="font-semibold text-zinc-950 font-mono tabular-nums">{{ snap.maleCount ?? 0 }}</span></span>
         <span class="font-medium text-zinc-900">Total: <span class="font-bold text-zinc-950 font-mono tabular-nums">{{ Number(snap.femaleCount ?? 0) + Number(snap.maleCount ?? 0) }}</span></span>
        </div>
        <p class="mt-2 text-[10px] text-zinc-400 flex items-center gap-1.5">
         <Calendar class="size-3 text-zinc-400" />
         <span>Added {{ snap.createdAt ? new Date(snap.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'unknown' }}</span>
         <template v-if="snap.lastEditedBy">
          <span>·</span>
          <span>Last edited by <span class="font-medium text-zinc-600">{{ snap.lastEditedBy }}</span></span>
          <template v-if="snap.lastEditedAt">
           <span>on {{ new Date(snap.lastEditedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) }}</span>
          </template>
         </template>
        </p>
       </div>
       <div class="flex shrink-0 items-center gap-1.5">
        <button
         v-if="abilities.updateScholarship"
         type="button"
         class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"
         @click="startEditSnapshot(snap)"
        >
         <Pencil class="size-3.5" aria-hidden="true" />
         Edit
        </button>
        <button
         v-if="abilities.deleteScholarship"
         type="button"
         class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"
         @click="deleteScholarshipSnapshot(snap.id)"
        >
         <Trash2 class="size-3.5" aria-hidden="true" />
         Delete
        </button>
       </div>
      </div>
     </template>

     <!-- Edit mode -->
     <template v-else>
      <form @submit.prevent="saveEditSnapshot(snap.id)" class="space-y-4">
       <div class="mb-2 flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-2">
        <span class="text-sm font-semibold text-zinc-900 flex items-center gap-2">
         <Pencil class="size-4 text-zinc-500" aria-hidden="true" />
         Editing Snapshot
        </span>
        <button type="button" class="text-zinc-400 hover:text-zinc-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]" @click="cancelEditSnapshot">
         <X class="size-4" />
        </button>
       </div>

       <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] mt-4">
        <div class="grid gap-2">
         <Label :for="`edit_school_year_${snap.id}`">School year</Label>
         <select
          :id="`edit_school_year_${snap.id}`"
          v-model="editSnapshotForm.school_year_id"
          class="report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
         >
          <option value="" disabled>Select school year…</option>
          <option v-for="sy in schoolYears" :key="sy.id" :value="sy.id">
           {{ sy.label }}
          </option>
         </select>
         <InputError :message="editSnapshotForm.errors.school_year_id" />
        </div>

        <div class="grid gap-2">
         <Label :for="`edit_as_of_date_${snap.id}`">As of date</Label>
         <Input :id="`edit_as_of_date_${snap.id}`" v-model="editSnapshotForm.as_of_date" type="date" :max="todayDate" :class="inputClass" />
         <InputError :message="editSnapshotForm.errors.as_of_date" />
        </div>
       </div>

       <div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 mt-4">
        <div class="grid gap-4 sm:grid-cols-2">
         <div class="grid gap-2">
          <Label :for="`edit_female_${snap.id}`">Female</Label>
          <Input
           :id="`edit_female_${snap.id}`"
           v-model="editSnapshotForm.female_count"
           type="number"
           min="0"
           inputmode="numeric"
           :class="inputClass"
          />
          <InputError :message="editSnapshotForm.errors.female_count" />
         </div>
         <div class="grid gap-2">
          <Label :for="`edit_male_${snap.id}`">Male</Label>
          <Input
           :id="`edit_male_${snap.id}`"
           v-model="editSnapshotForm.male_count"
           type="number"
           min="0"
           inputmode="numeric"
           :class="inputClass"
          />
          <InputError :message="editSnapshotForm.errors.male_count" />
         </div>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm">
         <span class="text-zinc-500 font-medium">Total Scholars</span>
         <span class="rounded-lg bg-zinc-950 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums">
          {{ editSnapshotTotal }}
         </span>
        </div>
       </div>

       <div class="flex flex-wrap items-center gap-3 border-zinc-200/80 border-t pt-4 mt-6">
        <Button type="submit" class="report-save-btn active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" :disabled="editSnapshotForm.processing">
         <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
         Save changes
        </Button>
        <Button
         type="button"
         variant="ghost"
         class="text-zinc-500 hover:text-zinc-800 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
         @click="cancelEditSnapshot"
        >
         Cancel
        </Button>
       </div>
      </form>
     </template>
    </div>
   </div>
  </div>

  <div v-else class="mt-6 rounded-2xl border border-dashed border-zinc-200 p-8 text-center bg-zinc-50/20">
   <Calendar class="size-8 text-zinc-400 mx-auto mb-3" />
   <h4 class="text-sm font-semibold text-zinc-900">No snapshots recorded</h4>
   <p class="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
    No scholarship data snapshots have been added for this year yet. Click "Add New Snapshot" above to create the first record.
   </p>
  </div>
 </section>

<section v-show="activeTab === 'gfps_assemblies'" class="report-panel" role="tabpanel">
<div
v-if="hasRecentUpdate('gfps_assemblies')"
class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
role="status"
>
<Sparkles class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
<span class="flex-1">This section was recently updated by another user.</span>
<button
type="button"
class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]"
@click="dismissRecentUpdate('gfps_assemblies')"
>
Dismiss
</button>
</div>

<HeadingSmall
variant="report"
title="GFPS assemblies"
description="Attendance by assembly period. Enter headcounts by sex for each row."
/>

 <form class="report-form report-form--edit w-full" @submit.prevent="updateGfpsAssemblies">
 <div class="report-years-data-table">
 <div class="report-years-data-head report-years-data-head--3col">
 <span class="report-years-data-head-label">Period</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
 </div>
 <div
 v-for="(row, index) in gfpsAssembliesForm.attendances"
 :key="row.period_id"
 class="report-years-data-row report-years-data-row--3col"
 >
 <div class="report-years-data-row-label">
 {{ reportYear.gfpsAssemblies[index]?.label }}
 </div>

 <div class="report-years-data-cell">
 <Label :for="`gfps_assembly_female_${row.period_id}`" class="report-years-data-cell-label md:sr-only">Female count</Label>
 <Input
 :id="`gfps_assembly_female_${row.period_id}`"
 v-model="row.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>


 <div class="report-years-data-cell">
 <Label :for="`gfps_assembly_male_${row.period_id}`" class="report-years-data-cell-label md:sr-only">Male count</Label>
 <Input
 :id="`gfps_assembly_male_${row.period_id}`"
 v-model="row.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>
 </div>
 </div>

 <InputError :message="gfpsAssembliesForm.errors.attendances" />

 <div class="report-years-form-actions">
 <Button type="submit" class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]" :disabled="gfpsAssembliesForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save assemblies
 </Button>
 <p v-show="gfpsAssembliesForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

<section v-show="activeTab === 'employee_status'" class="report-panel" role="tabpanel">
<div
v-if="hasRecentUpdate('employee_status')"
class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
role="status"
>
<Sparkles class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
<span class="flex-1">This section was recently updated by another user.</span>
<button
type="button"
class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]"
@click="dismissRecentUpdate('employee_status')"
>
Dismiss
</button>
</div>

<HeadingSmall
variant="report"
title="Employee status"
description="Workforce headcounts by employment status and sex. Use the same definitions as HR records."
/>

 <form class="report-form report-form--edit w-full" @submit.prevent="updateEmployeeStatuses">
 <div class="report-years-data-table">
 <div class="report-years-data-head report-years-data-head--3col">
 <span class="report-years-data-head-label">Employment status</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
 </div>
 <div
 v-for="(row, index) in employeeStatusesForm.breakdowns"
 :key="row.employment_status_id"
 class="report-years-data-row report-years-data-row--3col"
 >
 <div class="report-years-data-row-label">
 {{ reportYear.employeeStatuses[index]?.label }}
 </div>

 <div class="report-years-data-cell">
 <Label :for="`employee_female_${row.employment_status_id}`" class="report-years-data-cell-label md:sr-only">Female count</Label>
 <Input
 :id="`employee_female_${row.employment_status_id}`"
 v-model="row.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>


 <div class="report-years-data-cell">
 <Label :for="`employee_male_${row.employment_status_id}`" class="report-years-data-cell-label md:sr-only">Male count</Label>
 <Input
 :id="`employee_male_${row.employment_status_id}`"
 v-model="row.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>
 </div>
 </div>

 <InputError :message="employeeStatusesForm.errors.breakdowns" />

 <div class="report-years-form-actions">
 <Button type="submit" class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]" :disabled="employeeStatusesForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save employee status
 </Button>
 <p v-show="employeeStatusesForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

<section v-show="activeTab === 'rstl_monthly'" class="report-panel" role="tabpanel">
<div
v-if="hasRecentUpdate('rstl_monthly')"
class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
role="status"
>
<Sparkles class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
<span class="flex-1">This section was recently updated by another user.</span>
<button
type="button"
class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]"
@click="dismissRecentUpdate('rstl_monthly')"
>
Dismiss
</button>
</div>

<HeadingSmall
variant="report"
title="RSTL by month"
description="Monthly RSTL activity: clients or visits by sex, plus female-led and male-led counts. Scroll horizontally on small screens if the column labels do not fit."
/>

 <form class="report-form report-form--edit w-full" @submit.prevent="updateRstlMonthly">
 <div class="report-years-data-table-scroll">
 <div class="report-years-data-table report-years-data-table--wide report-years-data-table--rstl">
 <div class="report-years-data-head report-years-data-head--5col">
 <span class="report-years-data-head-label">Month</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female-led</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Male-led</span>
 </div>
 <div
 v-for="(row, index) in rstlForm.breakdowns"
 :key="row.report_month_id"
 class="report-years-data-row report-years-data-row--5col"
 >
 <div class="report-years-data-row-label">
 {{ reportYear.rstlMonthly[index]?.label }}
 </div>

 <div class="report-years-data-cell">
 <Label :for="`rstl_female_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Female</Label>
 <Input
 :id="`rstl_female_${row.report_month_id}`"
 v-model="row.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>

 <div class="report-years-data-cell">
 <Label :for="`rstl_female_led_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Female-led</Label>
 <Input
 :id="`rstl_female_led_${row.report_month_id}`"
 v-model="row.female_led_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>


 <div class="report-years-data-cell">
 <Label :for="`rstl_male_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Male</Label>
 <Input
 :id="`rstl_male_${row.report_month_id}`"
 v-model="row.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>

 <div class="report-years-data-cell">
 <Label :for="`rstl_male_led_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Male-led</Label>
 <Input
 :id="`rstl_male_led_${row.report_month_id}`"
 v-model="row.male_led_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>
 </div>
 </div>
 </div>

 <InputError :message="rstlForm.errors.breakdowns" />

 <div class="report-years-form-actions">
 <Button type="submit" class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]" :disabled="rstlForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save RSTL
 </Button>
 <p v-show="rstlForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

<section v-show="activeTab === 'program_funding'" class="report-panel" role="tabpanel">
<div
v-if="hasRecentUpdate('program_funding')"
class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
role="status"
>
<Sparkles class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
<span class="flex-1">This section was recently updated by another user.</span>
<button
type="button"
class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]"
@click="dismissRecentUpdate('program_funding')"
>
Dismiss
</button>
</div>

<HeadingSmall
variant="report"
title="Program funding"
description="Projects and funding amounts by program, split by sex. Amounts use your organization’s currency; enter decimals as needed."
 />

 <form class="report-form report-form--edit w-full" @submit.prevent="updateProgramFunding">
 <div class="space-y-6">
 <div class="space-y-2">
 <p class="text-xs font-semibold tracking-wide text-foreground uppercase">SETUP</p>
 <div class="report-years-data-table-scroll">
 <div class="report-years-data-table report-years-data-table--wide report-years-data-table--funding">
 <div class="report-years-data-head report-years-data-head--funding">
 <span class="report-years-data-head-label">Program</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female projects</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female amount</span>

 <span class="report-years-data-head-label report-years-data-head-label--center">Male projects</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Male amount</span>
 </div>
 <div
 v-for="item in setupFundingRows"
 :key="item.row.funding_program_id"
 class="report-years-data-row report-years-data-row--funding"
 >
 <div class="report-years-data-row-label">
 {{ item.label }}
 </div>

 <div class="report-years-data-cell">
 <Label :for="`funding_female_projects_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Female projects</Label>
 <Input
 :id="`funding_female_projects_${item.row.funding_program_id}`"
 v-model="item.row.female_projects"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>

 <div class="report-years-data-cell">
 <Label :for="`funding_female_amount_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Female amount</Label>
 <Input
 :id="`funding_female_amount_${item.row.funding_program_id}`"
 v-model="item.row.female_amount"
 type="number"
 min="0"
 step="0.01"
 inputmode="decimal"
 placeholder="0.00"
 :class="tableInputClass"
 />
 </div>


 <div class="report-years-data-cell">
 <Label :for="`funding_male_projects_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Male projects</Label>
 <Input
 :id="`funding_male_projects_${item.row.funding_program_id}`"
 v-model="item.row.male_projects"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>

 <div class="report-years-data-cell">
 <Label :for="`funding_male_amount_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Male amount</Label>
 <Input
 :id="`funding_male_amount_${item.row.funding_program_id}`"
 v-model="item.row.male_amount"
 type="number"
 min="0"
 step="0.01"
 inputmode="decimal"
 placeholder="0.00"
 :class="tableInputClass"
 />
 </div>
 </div>
 </div>
 </div>
 </div>

 <div class="space-y-2">
 <p class="text-xs font-semibold tracking-wide text-foreground uppercase">CEST</p>
 <div class="report-years-data-table-scroll">
 <div class="report-years-data-table report-years-data-table--wide report-years-data-table--funding">
 <div class="report-years-data-head report-years-data-head--funding">
 <span class="report-years-data-head-label">Program</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female projects</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Female amount</span>

 <span class="report-years-data-head-label report-years-data-head-label--center">Male projects</span>
 <span class="report-years-data-head-label report-years-data-head-label--center">Male amount</span>
 </div>
 <div
 v-for="item in cestFundingRows"
 :key="item.row.funding_program_id"
 class="report-years-data-row report-years-data-row--funding"
 >
 <div class="report-years-data-row-label">
 {{ item.label }}
 </div>

 <div class="report-years-data-cell">
 <Label :for="`funding_female_projects_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Female projects</Label>
 <Input
 :id="`funding_female_projects_${item.row.funding_program_id}`"
 v-model="item.row.female_projects"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>

 <div class="report-years-data-cell">
 <Label :for="`funding_female_amount_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Female amount</Label>
 <Input
 :id="`funding_female_amount_${item.row.funding_program_id}`"
 v-model="item.row.female_amount"
 type="number"
 min="0"
 step="0.01"
 inputmode="decimal"
 placeholder="0.00"
 :class="tableInputClass"
 />
 </div>


 <div class="report-years-data-cell">
 <Label :for="`funding_male_projects_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Male projects</Label>
 <Input
 :id="`funding_male_projects_${item.row.funding_program_id}`"
 v-model="item.row.male_projects"
 type="number"
 min="0"
 inputmode="numeric"
 :class="tableInputClass"
 />
 </div>

 <div class="report-years-data-cell">
 <Label :for="`funding_male_amount_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">Male amount</Label>
 <Input
 :id="`funding_male_amount_${item.row.funding_program_id}`"
 v-model="item.row.male_amount"
 type="number"
 min="0"
 step="0.01"
 inputmode="decimal"
 placeholder="0.00"
 :class="tableInputClass"
 />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <InputError :message="fundingForm.errors.summaries" />

 <div class="report-years-form-actions">
 <Button type="submit" class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]" :disabled="fundingForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save program funding
 </Button>
 <p v-show="fundingForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>
 </div>
 </div>
 </AppLayout>
 </template>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 400ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
.delay-1 {
  animation-delay: 60ms;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
