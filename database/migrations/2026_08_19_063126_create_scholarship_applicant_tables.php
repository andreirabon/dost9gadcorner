<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * Lookup of the scholarship programs applicants can apply to.
         *
         * `level` separates undergraduate from graduate so the screens can group
         * them without parsing the name. `short_name` exists because the full
         * titles run to eighty characters and would wrap a table column to four
         * lines; the full name stays available for headings and tooltips.
         */
        Schema::create('scholarship_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_name');
            $table->string('slug')->unique();
            $table->string('level', 32);
            $table->unsignedTinyInteger('sort_order')->default(1);
            $table->timestamps();

            $table->index('level');
        });

        /*
         * Applicants per program, per report year. Sex-disaggregated like every
         * other fact table in this report.
         */
        Schema::create('scholarship_applicant_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scholarship_program_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('female_count')->default(0);
            $table->unsignedInteger('male_count')->default(0);
            $table->timestamps();

            $table->unique(['report_year_id', 'scholarship_program_id'], 'scholarship_applicants_year_program_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scholarship_applicant_summaries');
        Schema::dropIfExists('scholarship_programs');
    }
};
