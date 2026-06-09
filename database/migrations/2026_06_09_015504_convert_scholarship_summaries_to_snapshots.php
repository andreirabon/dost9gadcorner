<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scholarship_summaries', function (Blueprint $table) {
            // Must drop FK first, then unique index, then re-add FK without unique
            $table->dropForeign(['report_year_id']);
            $table->dropUnique(['report_year_id']);
            $table->foreign('report_year_id')->references('id')->on('report_years')->cascadeOnDelete();

            // Edit-tracking columns
            $table->foreignId('last_edited_by')->nullable()->after('male_count')
                  ->constrained('users')->nullOnDelete();
            $table->timestamp('last_edited_at')->nullable()->after('last_edited_by');

            // Index for efficient ordering
            $table->index(['report_year_id', 'as_of_date']);
        });
    }

    public function down(): void
    {
        Schema::table('scholarship_summaries', function (Blueprint $table) {
            $table->dropIndex(['report_year_id', 'as_of_date']);
            $table->dropConstrainedForeignId('last_edited_by');
            $table->dropColumn('last_edited_at');

            // Restore unique constraint (drop non-unique FK, re-add as unique)
            $table->dropForeign(['report_year_id']);
            $table->unique('report_year_id');
            $table->foreign('report_year_id')->references('id')->on('report_years')->cascadeOnDelete();
        });
    }
};
