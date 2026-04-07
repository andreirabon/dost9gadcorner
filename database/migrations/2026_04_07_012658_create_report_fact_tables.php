<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gfps_membership_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('female_count')->default(0);
            $table->unsignedInteger('male_count')->default(0);
            $table->timestamps();

            $table->unique('report_year_id');
        });

        Schema::create('gfps_assembly_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('gfps_assembly_period_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('female_count')->default(0);
            $table->unsignedInteger('male_count')->default(0);
            $table->timestamps();

            $table->unique(['report_year_id', 'gfps_assembly_period_id'], 'gfps_attendance_year_period_unique');
        });

        Schema::create('employee_status_breakdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employment_status_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('female_count')->default(0);
            $table->unsignedInteger('male_count')->default(0);
            $table->timestamps();

            $table->unique(['report_year_id', 'employment_status_id'], 'employee_status_year_status_unique');
        });

        Schema::create('scholarship_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->string('school_year_label');
            $table->date('as_of_date')->nullable();
            $table->unsignedInteger('female_count')->default(0);
            $table->unsignedInteger('male_count')->default(0);
            $table->timestamps();

            $table->unique('report_year_id');
        });

        Schema::create('rstl_monthly_breakdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('report_month_id')->constrained('report_months')->cascadeOnDelete();
            $table->unsignedInteger('female_count')->default(0);
            $table->unsignedInteger('female_led_count')->default(0);
            $table->unsignedInteger('male_count')->default(0);
            $table->unsignedInteger('male_led_count')->default(0);
            $table->timestamps();

            $table->unique(['report_year_id', 'report_month_id'], 'rstl_breakdown_year_month_unique');
        });

        Schema::create('program_funding_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('funding_program_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('female_projects')->default(0);
            $table->decimal('female_amount', 15, 2)->default(0);
            $table->unsignedInteger('male_projects')->default(0);
            $table->decimal('male_amount', 15, 2)->default(0);
            $table->timestamps();

            $table->unique(['report_year_id', 'funding_program_id'], 'program_funding_year_program_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_funding_summaries');
        Schema::dropIfExists('rstl_monthly_breakdowns');
        Schema::dropIfExists('scholarship_summaries');
        Schema::dropIfExists('employee_status_breakdowns');
        Schema::dropIfExists('gfps_assembly_attendances');
        Schema::dropIfExists('gfps_membership_summaries');
    }
};
