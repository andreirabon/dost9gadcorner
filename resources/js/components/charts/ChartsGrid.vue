<script setup lang="ts">
import Chart from './Chart.vue';
import ChartContainer from './ChartContainer.vue';

interface ChartData {
    labels: string[];
    datasets: any[];
}

interface Props {
    barData: ChartData;
    lineData: ChartData;
    pieData: ChartData;
    projectName: string;
    isLoading?: boolean;
}

defineProps<Props>();
</script>

<template>
    <div class="space-y-6">
        <!-- Charts Grid -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Bar Chart -->
            <ChartContainer :is-loading="isLoading">
                <Chart :chart-data="barData" chart-type="bar" :title="`${projectName} - Business Ownership by Gender`" />
            </ChartContainer>

            <!-- Line Chart -->
            <ChartContainer :is-loading="isLoading">
                <Chart :chart-data="lineData" chart-type="line" :title="`${projectName} - Development Progress by Gender`" />
            </ChartContainer>
        </div>

        <!-- Pie Chart (Full Width) -->
        <ChartContainer :is-loading="isLoading">
            <Chart :chart-data="pieData" chart-type="pie" :title="`${projectName} - Business Distribution by Type & Gender`" />
        </ChartContainer>
    </div>
</template>
