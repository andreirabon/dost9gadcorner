<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('gfps_membership_summaries', function (Blueprint $table) {
            $table->dropColumn(['non_binary_count', 'genderqueer_count']);
        });

        Schema::table('gfps_assembly_attendances', function (Blueprint $table) {
            $table->dropColumn(['non_binary_count', 'genderqueer_count']);
        });

        Schema::table('employee_status_breakdowns', function (Blueprint $table) {
            $table->dropColumn(['non_binary_count', 'genderqueer_count']);
        });

        Schema::table('scholarship_summaries', function (Blueprint $table) {
            $table->dropColumn(['non_binary_count', 'genderqueer_count']);
        });

        Schema::table('rstl_monthly_breakdowns', function (Blueprint $table) {
            $table->dropColumn([
                'non_binary_count', 'non_binary_led_count',
                'genderqueer_count', 'genderqueer_led_count'
            ]);
        });

        Schema::table('program_funding_summaries', function (Blueprint $table) {
            $table->dropColumn([
                'non_binary_projects', 'non_binary_amount',
                'genderqueer_projects', 'genderqueer_amount'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gfps_membership_summaries', function (Blueprint $table) {
            $table->unsignedInteger('non_binary_count')->default(0)->after('female_count');
            $table->unsignedInteger('genderqueer_count')->default(0)->after('non_binary_count');
        });

        Schema::table('gfps_assembly_attendances', function (Blueprint $table) {
            $table->unsignedInteger('non_binary_count')->default(0)->after('female_count');
            $table->unsignedInteger('genderqueer_count')->default(0)->after('non_binary_count');
        });

        Schema::table('employee_status_breakdowns', function (Blueprint $table) {
            $table->unsignedInteger('non_binary_count')->default(0)->after('female_count');
            $table->unsignedInteger('genderqueer_count')->default(0)->after('non_binary_count');
        });

        Schema::table('scholarship_summaries', function (Blueprint $table) {
            $table->unsignedInteger('non_binary_count')->default(0)->after('female_count');
            $table->unsignedInteger('genderqueer_count')->default(0)->after('non_binary_count');
        });

        Schema::table('rstl_monthly_breakdowns', function (Blueprint $table) {
            $table->unsignedInteger('non_binary_count')->default(0)->after('female_led_count');
            $table->unsignedInteger('non_binary_led_count')->default(0)->after('non_binary_count');
            $table->unsignedInteger('genderqueer_count')->default(0)->after('non_binary_led_count');
            $table->unsignedInteger('genderqueer_led_count')->default(0)->after('genderqueer_count');
        });

        Schema::table('program_funding_summaries', function (Blueprint $table) {
            $table->unsignedInteger('non_binary_projects')->default(0)->after('female_amount');
            $table->decimal('non_binary_amount', 15, 2)->default(0)->after('non_binary_projects');
            $table->unsignedInteger('genderqueer_projects')->default(0)->after('non_binary_amount');
            $table->decimal('genderqueer_amount', 15, 2)->default(0)->after('genderqueer_projects');
        });
    }
};
