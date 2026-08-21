<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * GFPS members split by employment status.
     *
     * Separate from `employee_status_breakdowns`, which counts every DOST IX
     * employee: these are the GFPS members only. The counts are entered by hand
     * alongside `gfps_membership_summaries` rather than derived from it, so the
     * two are allowed to disagree.
     */
    public function up(): void
    {
        Schema::create('gfps_member_status_breakdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employment_status_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('female_count')->default(0);
            $table->unsignedInteger('male_count')->default(0);
            $table->timestamps();

            $table->unique(['report_year_id', 'employment_status_id'], 'gfps_member_status_year_status_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gfps_member_status_breakdowns');
    }
};
