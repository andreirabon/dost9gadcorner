export const mockChartData = {
    gia: {
        bar: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Male-Owned Businesses',
                    data: [85, 120, 95, 180, 165],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                },
                {
                    label: 'Female-Owned Businesses',
                    data: [65, 100, 85, 140, 115],
                    backgroundColor: '#ec4899',
                    borderColor: '#db2777',
                    borderWidth: 2,
                },
            ],
        },
        line: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Male Development Progress',
                    data: [12, 19, 25, 32, 28, 35, 42, 38, 45, 52, 48, 55],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Female Development Progress',
                    data: [8, 15, 22, 28, 25, 31, 38, 34, 41, 47, 44, 50],
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: '#ec4899',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        pie: {
            labels: ['Male-Owned Tech', 'Female-Owned Tech', 'Male-Owned Service', 'Female-Owned Service', 'Mixed Ownership'],
            datasets: [
                {
                    data: [245, 185, 156, 128, 95],
                    backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
            ],
        },
    },
    setup: {
        bar: {
            labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
            datasets: [
                {
                    label: 'Male-Owned Businesses',
                    data: [28, 35, 22, 42],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                },
                {
                    label: 'Female-Owned Businesses',
                    data: [17, 27, 16, 29],
                    backgroundColor: '#ec4899',
                    borderColor: '#db2777',
                    borderWidth: 2,
                },
            ],
        },
        line: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [
                {
                    label: 'Male Setup Completion Rate',
                    data: [15, 28, 45, 62, 78, 85, 92, 98],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'Female Setup Completion Rate',
                    data: [12, 25, 42, 58, 74, 82, 89, 95],
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: '#ec4899',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        pie: {
            labels: ['Male Early Stage', 'Female Early Stage', 'Male Advanced', 'Female Advanced', 'Completed'],
            datasets: [
                {
                    data: [45, 38, 32, 28, 67],
                    backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
            ],
        },
    },
    cest: {
        bar: {
            labels: ['Community A', 'Community B', 'Community C', 'Community D', 'Community E'],
            datasets: [
                {
                    label: 'Male-Owned Businesses',
                    data: [7, 11, 5, 14, 9],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                },
                {
                    label: 'Female-Owned Businesses',
                    data: [5, 8, 3, 11, 7],
                    backgroundColor: '#ec4899',
                    borderColor: '#db2777',
                    borderWidth: 2,
                },
            ],
        },
        line: {
            labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6'],
            datasets: [
                {
                    label: 'Male Community Engagement',
                    data: [20, 35, 42, 38, 55, 62],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Female Community Engagement',
                    data: [18, 32, 39, 35, 51, 58],
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: '#ec4899',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        pie: {
            labels: ['Male Rural', 'Female Rural', 'Male Urban', 'Female Urban', 'Mixed Communities'],
            datasets: [
                {
                    data: [35, 28, 42, 38, 25],
                    backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
            ],
        },
    },
};
