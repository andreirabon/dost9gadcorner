<?php

namespace Database\Seeders;

use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ReportMonth;
use App\Models\ScholarshipProgram;
use Illuminate\Database\Seeder;

class ReportLookupSeeder extends Seeder
{
    public function run(): void
    {
        EmploymentStatus::query()->upsert([
            ['name' => 'Plantilla', 'slug' => 'plantilla', 'sort_order' => 1],
            ['name' => 'COS', 'slug' => 'cos', 'sort_order' => 2],
            ['name' => 'Agency', 'slug' => 'agency', 'sort_order' => 3],
            ['name' => 'JO', 'slug' => 'jo', 'sort_order' => 4],
        ], ['slug'], ['name', 'sort_order']);

        GfpsAssemblyPeriod::query()->upsert([
            ['name' => '1st Assembly', 'slug' => '1st_assembly', 'sort_order' => 1],
            ['name' => '2nd Assembly', 'slug' => '2nd_assembly', 'sort_order' => 2],
            ['name' => '3rd Quarter', 'slug' => '3rd_quarter', 'sort_order' => 3],
            ['name' => '4th Quarter', 'slug' => '4th_quarter', 'sort_order' => 4],
        ], ['slug'], ['name', 'sort_order']);

        ReportMonth::query()->upsert([
            ['name' => 'January', 'short_name' => 'Jan', 'month_number' => 1],
            ['name' => 'February', 'short_name' => 'Feb', 'month_number' => 2],
            ['name' => 'March', 'short_name' => 'Mar', 'month_number' => 3],
            ['name' => 'April', 'short_name' => 'Apr', 'month_number' => 4],
            ['name' => 'May', 'short_name' => 'May', 'month_number' => 5],
            ['name' => 'June', 'short_name' => 'Jun', 'month_number' => 6],
            ['name' => 'July', 'short_name' => 'Jul', 'month_number' => 7],
            ['name' => 'August', 'short_name' => 'Aug', 'month_number' => 8],
            ['name' => 'September', 'short_name' => 'Sep', 'month_number' => 9],
            ['name' => 'October', 'short_name' => 'Oct', 'month_number' => 10],
            ['name' => 'November', 'short_name' => 'Nov', 'month_number' => 11],
            ['name' => 'December', 'short_name' => 'Dec', 'month_number' => 12],
        ], ['month_number'], ['name', 'short_name']);

        FundingProgram::query()->upsert([
            ['name' => 'SETUP ZC/IC', 'slug' => 'setup-zc-ic', 'sort_order' => 1],
            ['name' => 'SETUP ZSP', 'slug' => 'setup-zsp', 'sort_order' => 2],
            ['name' => 'SETUP ZDS', 'slug' => 'setup-zds', 'sort_order' => 3],
            ['name' => 'SETUP ZDN', 'slug' => 'setup-zdn', 'sort_order' => 4],
            ['name' => 'CEST ZC/IC', 'slug' => 'cest-zc-ic', 'sort_order' => 5],
            ['name' => 'CEST ZSP', 'slug' => 'cest-zsp', 'sort_order' => 6],
            ['name' => 'CEST ZDS', 'slug' => 'cest-zds', 'sort_order' => 7],
            ['name' => 'CEST ZDN', 'slug' => 'cest-zdn', 'sort_order' => 8],
            ['name' => 'GIA ZC/IC', 'slug' => 'gia-zc-ic', 'sort_order' => 9],
            ['name' => 'GIA ZSP', 'slug' => 'gia-zsp', 'sort_order' => 10],
            ['name' => 'GIA ZDS', 'slug' => 'gia-zds', 'sort_order' => 11],
            ['name' => 'GIA ZDN', 'slug' => 'gia-zdn', 'sort_order' => 12],
            // Special projects research is provincial, not a SETUP/CEST/GIA
            // metric, so it gets one row per province rather than three.
            ['name' => 'Special Projects Research ZC/IC', 'slug' => 'research-zc-ic', 'sort_order' => 13],
            ['name' => 'Special Projects Research ZSP', 'slug' => 'research-zsp', 'sort_order' => 14],
            ['name' => 'Special Projects Research ZDS', 'slug' => 'research-zds', 'sort_order' => 15],
            ['name' => 'Special Projects Research ZDN', 'slug' => 'research-zdn', 'sort_order' => 16],
        ], ['slug'], ['name', 'sort_order']);

        /*
         * Scholarship programs applicants apply to. `short_name` is what the
         * data tables show — the full titles are too long for a column — while
         * `name` stays available for headings and tooltips.
         */
        ScholarshipProgram::query()->upsert([
            [
                'name' => 'S&T Undergraduate Scholarships',
                'short_name' => 'S&T Undergraduate',
                'slug' => 'undergraduate-st',
                'level' => ScholarshipProgram::LEVEL_UNDERGRADUATE,
                'sort_order' => 1,
            ],
            [
                'name' => 'Junior Level Science Scholarships',
                'short_name' => 'JLSS',
                'slug' => 'undergraduate-jlss',
                'level' => ScholarshipProgram::LEVEL_UNDERGRADUATE,
                'sort_order' => 2,
            ],
            [
                'name' => 'BEST for IP Scholarship Program',
                'short_name' => 'BEST for IP',
                'slug' => 'undergraduate-best-ip',
                'level' => ScholarshipProgram::LEVEL_UNDERGRADUATE,
                'sort_order' => 3,
            ],
            [
                'name' => 'Accelerated Science and Technology Human Resource Development Program',
                'short_name' => 'ASTHRDP',
                'slug' => 'graduate-asthrdp',
                'level' => ScholarshipProgram::LEVEL_GRADUATE,
                'sort_order' => 4,
            ],
            [
                'name' => 'Capacity Building Program in Science and Mathematics Education',
                'short_name' => 'CBPSME',
                'slug' => 'graduate-cbpsme',
                'level' => ScholarshipProgram::LEVEL_GRADUATE,
                'sort_order' => 5,
            ],
            [
                'name' => 'Engineering Research and Development for Technology',
                'short_name' => 'ERDT',
                'slug' => 'graduate-erdt',
                'level' => ScholarshipProgram::LEVEL_GRADUATE,
                'sort_order' => 6,
            ],
            [
                'name' => 'Science and Technology Regional Alliance of Universities for National Development',
                'short_name' => 'STRAND',
                'slug' => 'graduate-strand',
                'level' => ScholarshipProgram::LEVEL_GRADUATE,
                'sort_order' => 7,
            ],
            [
                'name' => 'Foreign Graduate Scholarship Program',
                'short_name' => 'FGSP',
                'slug' => 'graduate-foreign',
                'level' => ScholarshipProgram::LEVEL_GRADUATE,
                'sort_order' => 8,
            ],
        ], ['slug'], ['name', 'short_name', 'level', 'sort_order']);

        $this->call(SchoolYearSeeder::class);
    }
}
