<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('school_years', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->unsignedTinyInteger('sort_order')->default(1);
            $table->timestamps();
        });

        // Seed existing data if any exists
        $labels = DB::table('scholarship_summaries')->pluck('school_year_label')->filter()->unique();
        $sortOrder = 1;
        foreach ($labels as $label) {
            DB::table('school_years')->insert(['name' => $label, 'sort_order' => $sortOrder++]);
        }

        Schema::table('scholarship_summaries', function (Blueprint $table) {
            $table->foreignId('school_year_id')->nullable()->after('report_year_id')->constrained()->nullOnDelete();
        });

        // Map existing labels to IDs
        $summaries = DB::table('scholarship_summaries')->get();
        foreach ($summaries as $summary) {
            if ($summary->school_year_label) {
                $sy = DB::table('school_years')->where('name', $summary->school_year_label)->first();
                if ($sy) {
                    DB::table('scholarship_summaries')->where('id', $summary->id)->update(['school_year_id' => $sy->id]);
                }
            }
        }

        // Now drop the string column
        Schema::table('scholarship_summaries', function (Blueprint $table) {
            $table->dropColumn('school_year_label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scholarship_summaries', function (Blueprint $table) {
            $table->string('school_year_label')->after('school_year_id')->nullable();
        });

        $summaries = DB::table('scholarship_summaries')->get();
        foreach ($summaries as $summary) {
            if ($summary->school_year_id) {
                $sy = DB::table('school_years')->where('id', $summary->school_year_id)->first();
                if ($sy) {
                    DB::table('scholarship_summaries')->where('id', $summary->id)->update(['school_year_label' => $sy->name]);
                }
            }
        }

        Schema::table('scholarship_summaries', function (Blueprint $table) {
            $table->dropForeign(['school_year_id']);
            $table->dropColumn('school_year_id');
        });

        Schema::dropIfExists('school_years');
    }
};
