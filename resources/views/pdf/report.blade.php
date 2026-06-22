<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report {{ $year['year'] }} - {{ $year['title'] }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @if($withCharts)
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    @endif
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .page-break {
            page-break-after: always;
        }
        .avoid-break {
            page-break-inside: avoid;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            text-align: left;
        }
        th {
            background-color: #f9fafb;
            font-weight: 600;
        }
    </style>
</head>
<body class="p-8 bg-white text-gray-900">
    <div class="mb-8 border-b pb-4">
        <h1 class="text-3xl font-bold">Gender and Development Report</h1>
        <h2 class="text-xl text-gray-600 mt-2">{{ $year['year'] }} - {{ $year['title'] }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ $year['description'] }}</p>
    </div>

    @if(!$year['reportData'])
        <p class="text-gray-500 italic">Data is pending and not yet published for this year.</p>
    @else
        @php
            $data = $year['reportData'];
        @endphp

        <!-- GFPS Membership -->
        <div class="avoid-break mb-8">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">GFPS Membership Summary</h3>
            <div class="flex flex-wrap -mx-4">
                <div class="w-full lg:w-1/2 px-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Gender</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Female</td>
                                <td>{{ $data['gfpsMembership']['femaleCount'] }}</td>
                            </tr>
                            <tr>
                                <td>Male</td>
                                <td>{{ $data['gfpsMembership']['maleCount'] }}</td>
                            </tr>
                            <tr class="font-bold bg-gray-50">
                                <td>Total</td>
                                <td>{{ $data['gfpsMembership']['femaleCount'] + $data['gfpsMembership']['maleCount'] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                @if($withCharts)
                    <div class="w-full lg:w-1/2 px-4 flex justify-center items-center">
                        <div id="chart-gfps-membership" class="w-full max-w-sm"></div>
                    </div>
                @endif
            </div>
        </div>

        <!-- Employee Statuses -->
        <div class="avoid-break mb-8">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Employment Status Breakdowns</h3>
            <div class="flex flex-wrap -mx-4">
                <div class="w-full lg:w-1/2 px-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Female</th>
                                <th>Male</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($data['employeeStatuses'] as $status)
                            <tr>
                                <td>{{ $status['label'] }}</td>
                                <td>{{ $status['female'] }}</td>
                                <td>{{ $status['male'] }}</td>
                                <td>{{ $status['female'] + $status['male'] }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @if($withCharts)
                    <div class="w-full lg:w-1/2 px-4 flex justify-center items-center">
                        <div id="chart-employee-status" class="w-full"></div>
                    </div>
                @endif
            </div>
        </div>

        <!-- GFPS Assemblies -->
        <div class="avoid-break mb-8">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">GFPS Assembly Attendances</h3>
            <div class="flex flex-wrap -mx-4">
                <div class="w-full lg:w-1/2 px-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Female</th>
                                <th>Male</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($data['gfpsAssemblies'] as $assembly)
                            <tr>
                                <td>{{ $assembly['label'] }}</td>
                                <td>{{ $assembly['female'] }}</td>
                                <td>{{ $assembly['male'] }}</td>
                                <td>{{ $assembly['female'] + $assembly['male'] }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @if($withCharts)
                    <div class="w-full lg:w-1/2 px-4 flex justify-center items-center">
                        <div id="chart-gfps-assemblies" class="w-full"></div>
                    </div>
                @endif
            </div>
        </div>

        <div class="page-break"></div>

        <!-- Scholarship -->
        <div class="avoid-break mb-8">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Scholarship Statistics</h3>
            <p class="text-sm text-gray-600 mb-4">As of {{ $data['scholarship']['asOfDate'] ?? 'N/A' }} ({{ $data['scholarship']['schoolYearLabel'] ?? 'N/A' }})</p>
            <div class="flex flex-wrap -mx-4">
                <div class="w-full lg:w-1/2 px-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Gender</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Female</td>
                                <td>{{ $data['scholarship']['femaleCount'] }}</td>
                            </tr>
                            <tr>
                                <td>Male</td>
                                <td>{{ $data['scholarship']['maleCount'] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                @if($withCharts)
                    <div class="w-full lg:w-1/2 px-4 flex justify-center items-center">
                        <div id="chart-scholarship" class="w-full max-w-sm"></div>
                    </div>
                @endif
            </div>
        </div>

        <!-- RSTL Monthly -->
        <div class="avoid-break mb-8">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">RSTL Monthly Services</h3>
            <div class="flex flex-wrap -mx-4">
                <div class="w-full lg:w-1/2 px-4">
                    <table class="text-sm">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Female</th>
                                <th>Female Led</th>
                                <th>Male</th>
                                <th>Male Led</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($data['rstlMonthly'] as $month)
                            <tr>
                                <td>{{ $month['label'] }}</td>
                                <td>{{ $month['female'] }}</td>
                                <td>{{ $month['femaleLed'] }}</td>
                                <td>{{ $month['male'] }}</td>
                                <td>{{ $month['maleLed'] }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @if($withCharts)
                    <div class="w-full lg:w-1/2 px-4 flex justify-center items-center">
                        <div id="chart-rstl" class="w-full"></div>
                    </div>
                @endif
            </div>
        </div>

        @if($withCharts)
            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    const data = @json($data);

                    // GFPS Membership Chart
                    new ApexCharts(document.querySelector("#chart-gfps-membership"), {
                        series: [data.gfpsMembership.femaleCount, data.gfpsMembership.maleCount],
                        labels: ['Female', 'Male'],
                        chart: { type: 'donut', height: 250, animations: { enabled: false } },
                        colors: ['#ec4899', '#3b82f6'],
                    }).render();

                    // Employee Statuses Chart
                    new ApexCharts(document.querySelector("#chart-employee-status"), {
                        series: [{
                            name: 'Female',
                            data: data.employeeStatuses.map(s => s.female)
                        }, {
                            name: 'Male',
                            data: data.employeeStatuses.map(s => s.male)
                        }],
                        chart: { type: 'bar', height: 300, stacked: true, animations: { enabled: false } },
                        xaxis: { categories: data.employeeStatuses.map(s => s.label) },
                        colors: ['#ec4899', '#3b82f6'],
                    }).render();

                    // GFPS Assemblies Chart
                    new ApexCharts(document.querySelector("#chart-gfps-assemblies"), {
                        series: [{
                            name: 'Female',
                            data: data.gfpsAssemblies.map(s => s.female)
                        }, {
                            name: 'Male',
                            data: data.gfpsAssemblies.map(s => s.male)
                        }],
                        chart: { type: 'bar', height: 300, animations: { enabled: false } },
                        xaxis: { categories: data.gfpsAssemblies.map(s => s.label) },
                        colors: ['#ec4899', '#3b82f6'],
                    }).render();

                    // Scholarship Chart
                    new ApexCharts(document.querySelector("#chart-scholarship"), {
                        series: [data.scholarship.femaleCount, data.scholarship.maleCount],
                        labels: ['Female', 'Male'],
                        chart: { type: 'pie', height: 250, animations: { enabled: false } },
                        colors: ['#ec4899', '#3b82f6'],
                    }).render();

                    // RSTL Chart
                    new ApexCharts(document.querySelector("#chart-rstl"), {
                        series: [
                            { name: 'Female', data: data.rstlMonthly.map(s => s.female) },
                            { name: 'Male', data: data.rstlMonthly.map(s => s.male) }
                        ],
                        chart: { type: 'area', height: 300, animations: { enabled: false } },
                        xaxis: { categories: data.rstlMonthly.map(s => s.label) },
                        colors: ['#ec4899', '#3b82f6'],
                        dataLabels: { enabled: false },
                        stroke: { curve: 'smooth' }
                    }).render();
                });
            </script>
        @endif
    @endif
</body>
</html>
