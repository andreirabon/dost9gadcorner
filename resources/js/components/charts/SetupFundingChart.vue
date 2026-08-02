<script setup lang="ts">
import FundingSplitChart from '@/components/charts/FundingSplitChart.vue';

interface SetupFundingData {
    femaleProjects: number;
    femaleAmount: number;
    maleProjects: number;
    maleAmount: number;
}

interface Props {
    data: SetupFundingData;
    title?: string;
}

withDefaults(defineProps<Props>(), {
    title: '',
});
</script>

<template>
    <FundingSplitChart :data="data" :title="title" />
</template>
