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
        Schema::table('program_funding_summaries', function (Blueprint $table) {
            $table->unsignedInteger('funded_projects_count')->default(0);
            $table->decimal('funded_projects_value', 20, 6)->default(0);
            $table->unsignedInteger('training_participants')->default(0);

            $table->unsignedInteger('jobs_total')->default(0);
            $table->unsignedInteger('jobs_male')->default(0);
            $table->unsignedInteger('jobs_female')->default(0);
            $table->unsignedInteger('jobs_pwd')->default(0);
            $table->unsignedInteger('jobs_senior_citizen')->default(0);
            $table->unsignedInteger('jobs_ip')->default(0);
            $table->unsignedInteger('jobs_4ps')->default(0);

            $table->unsignedInteger('special_projects_research_male')->default(0);
            $table->unsignedInteger('special_projects_research_female')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_funding_summaries', function (Blueprint $table) {
            $table->dropColumn([
                'funded_projects_count',
                'funded_projects_value',
                'training_participants',
                'jobs_total',
                'jobs_male',
                'jobs_female',
                'jobs_pwd',
                'jobs_senior_citizen',
                'jobs_ip',
                'jobs_4ps',
                'special_projects_research_male',
                'special_projects_research_female',
            ]);
        });
    }
};
