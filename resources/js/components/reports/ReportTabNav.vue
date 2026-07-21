<script setup lang="ts">
import { REPORT_TABPANEL_ID, REPORT_TABS, reportTabSlug, type TabType } from '@/helpers/reportTabs';

interface Props {
    activeTab: TabType;
    tabs?: TabType[];
}

const props = withDefaults(defineProps<Props>(), {
    tabs: () => REPORT_TABS,
});

const emit = defineEmits<{
    select: [tab: TabType];
}>();

const selectNextTab = (direction: 1 | -1): void => {
    const currentIndex = props.tabs.indexOf(props.activeTab);
    if (currentIndex === -1) {
        return;
    }

    const nextIndex = (currentIndex + direction + props.tabs.length) % props.tabs.length;
    emit('select', props.tabs[nextIndex]);
};

const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        selectNextTab(1);
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        selectNextTab(-1);
        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        emit('select', props.tabs[0]);
        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        emit('select', props.tabs[props.tabs.length - 1]);
    }
};
</script>

<template>
    <div class="report-view-tabs" role="tablist" aria-label="Report sections">
        <button
            v-for="tab in tabs"
            :key="tab"
            :id="`report-tab-${reportTabSlug(tab)}`"
            @click="emit('select', tab)"
            @keydown="handleKeydown"
            :class="['report-view-tab', { 'is-active': activeTab === tab }]"
            role="tab"
            :aria-selected="activeTab === tab"
            :aria-controls="REPORT_TABPANEL_ID"
            type="button"
        >
            {{ tab }}
        </button>
    </div>
</template>
